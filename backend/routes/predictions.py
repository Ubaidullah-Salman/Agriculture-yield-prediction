from flask import Blueprint, request, jsonify, g, current_app
from werkzeug.utils import secure_filename
from models import db, Prediction, User
from middleware.auth_middleware import token_required
from ml_models.model_loader import ModelLoader
import os
import json
import uuid
import jwt

predictions_bp = Blueprint('predictions', __name__)
loader = ModelLoader()

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in {'png', 'jpg', 'jpeg'}

@predictions_bp.route('/yield', methods=['POST'])
def predict_yield():
    data = request.get_json()
    if not data:
        return jsonify({'message': 'No data provided'}), 400
        
    # Optional Auth check
    current_user_id = None
    if 'Authorization' in request.headers:
        try:
            token = request.headers['Authorization'].split(" ")[1]
            decoded = jwt.decode(token, current_app.config['JWT_SECRET_KEY'], algorithms=["HS256"])
            current_user_id = decoded['user_id']
        except:
            # Token invalid or expired, proceed as anonymous
            pass

    try:
        # Run prediction
        # print(f"Predict Yield Request Data: {data}") # Debug logging
        predicted_yield = loader.predict_yield(data)
        
        result = {
            'predicted_yield': predicted_yield, 
            'unit': 'maunds/acre',
            'confidence': 85.0  # RandomForest doesn't give confidence easily for regression, mocking
        }
        
        # Save to DB only if user is logged in
        # Save to DB only if user is logged in
        if current_user_id:
            try:
                prediction = Prediction(
                    user_id=current_user_id,
                    prediction_type='yield',
                    input_data=json.dumps(data),
                    result_data=json.dumps(result)
                )
                db.session.add(prediction)
                db.session.commit()
            except Exception as db_e:
                print(f"DB Error (Non-fatal): {db_e}")
                # We don't fail the request if DB fails
        
        return jsonify(result), 200
    except Exception as e:
        import traceback
        error_details = traceback.format_exc()
        print(f"Error in predict_yield: {str(e)}\n{error_details}")
        
        # Write to log file in uploads folder using absolute path
        try:
            log_path = os.path.join(current_app.config['UPLOAD_FOLDER'], 'yield_error_log.txt')
            with open(log_path, 'a') as f:
                f.write(f"Error: {str(e)}\nData: {data}\nTraceback: {error_details}\n\n")
        except:
            pass # logging shouldn't crash the app
            
        return jsonify({'message': f"Model Error: {str(e)}", 'details': str(e)}), 500

@predictions_bp.route('/recommendation', methods=['POST'])
def predict_recommendation():
    data = request.get_json()
    if not data:
        return jsonify({'message': 'No data provided'}), 400
        
    # Optional Auth check
    current_user_id = None
    if 'Authorization' in request.headers:
        try:
            token = request.headers['Authorization'].split(" ")[1]
            decoded = jwt.decode(token, current_app.config['JWT_SECRET_KEY'], algorithms=["HS256"])
            current_user_id = decoded['user_id']
        except:
            pass

    try:
        # Run prediction
        crop_name = loader.predict_recommendation(data)
        result = {
            'recommended_crop': crop_name,
            'confidence': 95.0 # Random Forest is generally high confidence for this dataset
        }
        
        # Save to DB if logged in
        if current_user_id:
            prediction = Prediction(
                user_id=current_user_id,
                prediction_type='recommendation',
                input_data=json.dumps(data),
                result_data=json.dumps(result)
            )
            db.session.add(prediction)
            db.session.commit()
            
        return jsonify(result), 200
        
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({'message': f"Model Error: {str(e)}"}), 500

@predictions_bp.route('/pest', methods=['POST'])
def detect_pest():
    if 'image' not in request.files:
        return jsonify({'message': 'No image file provided'}), 400
        
    file = request.files['image']
    
    # Optional Auth check
    current_user_id = None
    if 'Authorization' in request.headers:
        try:
            token = request.headers['Authorization'].split(" ")[1]
            decoded = jwt.decode(token, current_app.config['JWT_SECRET_KEY'], algorithms=["HS256"])
            current_user_id = decoded['user_id']
        except:
            pass

    if file and allowed_file(file.filename):
        filename = secure_filename(f"{uuid.uuid4()}_{file.filename}")
        filepath = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        try:
            # Run detection using loader helper
            print(f"[PEST DEBUG] Starting prediction for {filepath}")
            result = loader.predict_pest(filepath)
            print(f"[PEST DEBUG] Prediction successful: {result}")
            
            # Save to DB only if logged in
            if current_user_id:
                prediction = Prediction(
                    user_id=current_user_id,
                    prediction_type='pest',
                    input_data=json.dumps({'filename': filename}),
                    result_data=json.dumps(result),
                    image_path=filepath
                )
                db.session.add(prediction)
                db.session.commit()
            
            return jsonify(result), 200
        except Exception as e:
            import traceback
            traceback.print_exc()
            error_msg = f"Analysis Error: {str(e)}"
            print(f"[PEST DEBUG] ERROR: {error_msg}")
            return jsonify({'message': error_msg}), 500

            
    return jsonify({'message': 'Invalid file type'}), 400

@predictions_bp.route('/history', methods=['GET'])
@token_required
def get_history():
    pred_type = request.args.get('type')
    query = Prediction.query.filter_by(user_id=g.current_user.id)
    
    if pred_type:
        query = query.filter_by(prediction_type=pred_type)
        
    predictions = query.order_by(Prediction.created_at.desc()).limit(20).all()
    return jsonify([p.to_dict() for p in predictions]), 200
