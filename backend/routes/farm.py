from flask import Blueprint, request, jsonify, g
from models import db, Farm
from middleware.auth_middleware import token_required

farm_bp = Blueprint('farm', __name__)

@farm_bp.route('/', methods=['GET'])
@token_required
def get_farms():
    farms = Farm.query.filter_by(user_id=g.current_user.id).all()
    return jsonify([farm.to_dict() for farm in farms]), 200

@farm_bp.route('/', methods=['POST'])
@token_required
def create_farm():
    data = request.get_json()
    
    if not data or not data.get('name') or not data.get('location') or not data.get('size_acres'):
        return jsonify({'message': 'Missing required fields'}), 400
        
    try:
        new_farm = Farm(
            user_id=g.current_user.id,
            name=data.get('name'),
            location=data.get('location'),
            size_acres=float(data.get('size_acres')),
            soil_type=data.get('soil_type'),
            irrigation_type=data.get('irrigation_type'),
            current_crop=data.get('current_crop')
        )
        
        db.session.add(new_farm)
        db.session.commit()
        return jsonify(new_farm.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 500

@farm_bp.route('/<int:farm_id>', methods=['PUT'])
@token_required
def update_farm(farm_id):
    farm = Farm.query.filter_by(id=farm_id, user_id=g.current_user.id).first_or_404()
    data = request.get_json()
    
    if 'name' in data: farm.name = data['name']
    if 'location' in data: farm.location = data['location']
    if 'size_acres' in data: farm.size_acres = float(data['size_acres'])
    if 'soil_type' in data: farm.soil_type = data['soil_type']
    if 'irrigation_type' in data: farm.irrigation_type = data['irrigation_type']
    if 'current_crop' in data: farm.current_crop = data['current_crop']
    if 'status' in data: farm.status = data['status']
    
    try:
        db.session.commit()
        return jsonify(farm.to_dict()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 500

@farm_bp.route('/<int:farm_id>', methods=['DELETE'])
@token_required
def delete_farm(farm_id):
    farm = Farm.query.filter_by(id=farm_id, user_id=g.current_user.id).first_or_404()
    try:
        db.session.delete(farm)
        db.session.commit()
        return jsonify({'message': 'Farm deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 500
