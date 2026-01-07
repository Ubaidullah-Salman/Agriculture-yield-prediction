from flask import Blueprint, request, jsonify, g, current_app
from werkzeug.utils import secure_filename
from models import db, Prediction, User
from middleware.auth_middleware import token_required
from ml_models.model_loader import ModelLoader
from utils.dsa import DecisionTree, LinkedList, MinHeap
import os
import json
import uuid
import datetime
import jwt

predictions_bp = Blueprint('predictions', __name__)
loader = ModelLoader()

# DSA INTEGRATION: Decision Tree Rules for Crop Recommendation
# Features: N, P, K, temperature, humidity, ph, rainfall
recommendation_tree = DecisionTree({
    'feature': 'rainfall',
    'threshold': 100,
    'left': { # Low rainfall
        'feature': 'temperature',
        'threshold': 30,
        'left': 'Wheat',
        'right': 'Cotton'
    },
    'right': { # High rainfall
        'feature': 'ph',
        'threshold': 7.0,
        'left': 'Rice',
        'right': 'Maize'
    }
})

# DSA ROADMAP: Linked List for session history and Heap for request priority
session_history = LinkedList(max_size=10)
request_prioritizer = MinHeap()

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
        
        # DSA ROADMAP: Add to Linked List history
        session_history.add({
            'type': 'yield',
            'input': data,
            'result': result,
            'timestamp': str(datetime.datetime.utcnow())
        })
        
        # DSA ROADMAP: Prioritize based on farm size (larger farms = lower priority for demo/balanced load)
        priority = float(data.get('area', 1.0))
        request_prioritizer.push(f"yield_{uuid.uuid4()}", priority)

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
                
                # Trigger notification
                from utils.notification_helper import create_notification
                create_notification(
                    user_id=current_user_id,
                    title="Yield Prediction Ready",
                    message=f"System calculated {result['predicted_yield']} maunds/acre based on your data.",
                    notif_type='success'
                )
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
        # Run ML prediction
        ml_crop = loader.predict_recommendation(data)
        
        # DSA INTEGRATION: Run manual Decision Tree prediction
        dsa_crop = recommendation_tree.predict(data)
        
        result = {
            'recommended_crop': ml_crop,
            'dsa_recommendation': dsa_crop, # Show both for technical depth
            'confidence': 95.0 
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
            
            # DSA ROADMAP: Add to Linked List history
            session_history.add({
                'type': 'recommendation',
                'input': data,
                'result': result,
                'timestamp': str(datetime.datetime.utcnow())
            })
            
            # Trigger notification
            from utils.notification_helper import create_notification
            create_notification(
                user_id=current_user_id,
                title="Crop Recommendation Generated",
                message=f"Our AI recommends planting {result['recommended_crop']}. View full details.",
                notif_type='info'
            )
            
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
                
                # DSA ROADMAP: Add to Linked List history
                session_history.add({
                    'type': 'pest',
                    'input': {'filename': filename},
                    'result': result,
                    'timestamp': str(datetime.datetime.utcnow())
                })
                
                # Trigger notification
                from utils.notification_helper import create_notification
                create_notification(
                    user_id=current_user_id,
                    title="Pest Analysis Complete",
                    message=f"Detection finished: {result.get('label', 'No issues detected')}. View report.",
                    notif_type='warning' if 'healthy' not in result.get('label', '').lower() else 'success'
                )
            
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
    # DSA ROADMAP: Use Linked List history for recently active session
    history_list = session_history.get_all()
    
    pred_type = request.args.get('type')
    query = Prediction.query.filter_by(user_id=g.current_user.id)
    
    if pred_type:
        query = query.filter_by(prediction_type=pred_type)
        
    db_predictions = query.order_by(Prediction.created_at.desc()).limit(20).all()
    
    return jsonify({
        'session_history': history_list,
        'db_history': [p.to_dict() for p in db_predictions]
    }), 200

