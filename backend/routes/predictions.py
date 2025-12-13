from flask import Blueprint, request, jsonify, g, current_app
from werkzeug.utils import secure_filename
from models import db, Prediction
from middleware.auth_middleware import token_required
from ml_models.model_loader import ModelLoader
import os
import json
import uuid

predictions_bp = Blueprint('predictions', __name__)
loader = ModelLoader()

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in {'png', 'jpg', 'jpeg'}

@predictions_bp.route('/yield', methods=['POST'])
@token_required
def predict_yield():
    data = request.get_json()
    if not data:
        return jsonify({'message': 'No data provided'}), 400
        
    try:
        # Run prediction
        predicted_yield = loader.yield_model.predict(data)
        
        result = {
            'predicted_yield': predicted_yield, 
            'unit': 'kg/acre',
            'confidence': 85.0  # RandomForest doesn't give confidence easily for regression, mocking
        }
        
        # Save to DB
        prediction = Prediction(
            user_id=g.current_user.id,
            prediction_type='yield',
            input_data=json.dumps(data),
            result_data=json.dumps(result)
        )
        db.session.add(prediction)
        db.session.commit()
        
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@predictions_bp.route('/predict-price', methods=['POST'])
@token_required
def predict_price():
    # Handle Image Upload
    if 'image' not in request.files:
        return jsonify({'message': 'No image file provided'}), 400
        
    file = request.files['image']
    crop_type = request.form.get('crop_type', 'wheat')
    
    if file.filename == '':
        return jsonify({'message': 'No selected file'}), 400
        
    if file and allowed_file(file.filename):
        filename = secure_filename(f"{uuid.uuid4()}_{file.filename}")
        filepath = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        try:
            # Analyze Quality
            quality_data = loader.price_model.analyze_quality(filepath)
            
            # Predict Price
            prediction_result = loader.price_model.predict_price(crop_type, quality_data)
            
            # Combine results
            full_result = {**quality_data, **prediction_result}
            
            # Save to DB
            prediction = Prediction(
                user_id=g.current_user.id,
                prediction_type='price',
                input_data=json.dumps({'crop_type': crop_type}),
                result_data=json.dumps(full_result),
                image_path=filepath
            )
            db.session.add(prediction)
            db.session.commit()
            
            return jsonify(full_result), 200
            
        except Exception as e:
            return jsonify({'message': str(e)}), 500
            
    return jsonify({'message': 'Invalid file type'}), 400

@predictions_bp.route('/pest', methods=['POST'])
@token_required
def detect_pest():
    if 'image' not in request.files:
        return jsonify({'message': 'No image file provided'}), 400
        
    file = request.files['image']
    
    if file and allowed_file(file.filename):
        filename = secure_filename(f"{uuid.uuid4()}_{file.filename}")
        filepath = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        try:
            # Run detection
            result = loader.pest_model.predict(filepath)
            
            # Save to DB
            prediction = Prediction(
                user_id=g.current_user.id,
                prediction_type='pest',
                input_data=json.dumps({'filename': filename}),
                result_data=json.dumps(result),
                image_path=filepath
            )
            db.session.add(prediction)
            db.session.commit()
            
            return jsonify(result), 200
        except Exception as e:
            return jsonify({'message': str(e)}), 500
            
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
