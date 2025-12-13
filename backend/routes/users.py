from flask import Blueprint, request, jsonify, g
from models import db, User
from middleware.auth_middleware import token_required, admin_required

users_bp = Blueprint('users', __name__)

@users_bp.route('/', methods=['GET'])
@token_required
@admin_required
def get_all_users():
    users = User.query.all()
    return jsonify([user.to_dict() for user in users]), 200

@users_bp.route('/<int:user_id>', methods=['GET'])
@token_required
def get_user(user_id):
    # Users can only access their own profile unless they are admin
    if g.current_user.id != user_id and g.current_user.role != 'admin':
        return jsonify({'message': 'Unauthorized'}), 403
        
    user = User.query.get_or_404(user_id)
    return jsonify(user.to_dict()), 200

@users_bp.route('/<int:user_id>', methods=['PUT'])
@token_required
def update_user(user_id):
    if g.current_user.id != user_id and g.current_user.role != 'admin':
        return jsonify({'message': 'Unauthorized'}), 403
        
    user = User.query.get_or_404(user_id)
    data = request.get_json()
    
    if not data:
        return jsonify({'message': 'No data provided'}), 400
        
    # Update allowed fields
    if 'name' in data: user.name = data['name']
    if 'phone' in data: user.phone = data['phone']
    if 'location' in data: user.location = data['location']
    if 'farm_size' in data: user.farm_size = data['farm_size']
    
    # Admin only updates
    if g.current_user.role == 'admin':
        if 'role' in data: user.role = data['role']
        if 'status' in data: user.status = data['status']
        
    try:
        db.session.commit()
        return jsonify(user.to_dict()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 500

@users_bp.route('/<int:user_id>', methods=['DELETE'])
@token_required
@admin_required
def delete_user(user_id):
    user = User.query.get_or_404(user_id)
    try:
        db.session.delete(user)
        db.session.commit()
        return jsonify({'message': 'User deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 500
