from flask import Blueprint, request, jsonify, g
from models import db, User
from middleware.auth_middleware import token_required, admin_required
from utils.dsa import merge_sort, binary_search, admin_stack

users_bp = Blueprint('users', __name__)

@users_bp.route('/', methods=['GET'], strict_slashes=False)
@token_required
@admin_required
def get_all_users():
    users = User.query.all()
    data = [user.to_dict() for user in users]
    # DSA INTEGRATION: Stable MergeSort
    sorted_data = merge_sort(data, key=lambda x: x['name'])
    return jsonify(sorted_data), 200

@users_bp.route('/search', methods=['GET'])
@token_required
@admin_required
def search_users():
    """
    DSA INTEGRATION: Binary search for users by name.
    """
    query = request.args.get('q', '').strip()
    if not query:
        return jsonify({'message': 'Query required'}), 400
        
    users = User.query.all()
    data = [user.to_dict() for user in users]
    # Binary Search requires sorted data
    sorted_users = merge_sort(data, key=lambda x: x['name'])
    
    results = binary_search(sorted_users, query, key=lambda x: x['name'])
    
    if results:
        return jsonify(results), 200
    return jsonify({'message': 'No users found'}), 404

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
    if 'farm_size' in data or 'farmSize' in data: 
        user.farm_size = data.get('farm_size') or data.get('farmSize')
    
    # Admin only updates
    if g.current_user.role == 'admin':
        # DSA ROADMAP: Capture old data for undo
        old_data = user.to_dict()
        
        has_changed = False
        if 'role' in data and user.role != data['role']: 
            user.role = data['role']
            has_changed = True
        if 'status' in data and user.status != data['status']:
            user.status = data['status']
            has_changed = True
            
        if has_changed:
            admin_stack.push({
                'type': 'user_update',
                'user_id': user_id,
                'old_data': old_data,
                'action': f"Updated profile/status of {user.name}"
            })
        
        if 'status' in data: 
            user.status = data['status']
        
    try:
        db.session.commit()
        
        # Trigger notification
        from utils.notification_helper import create_notification
        create_notification(
            user_id=user.id,
            title="Profile Updated",
            message="Your profile information has been successfully updated.",
            notif_type='success'
        )
        
        return jsonify(user.to_dict()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 500

@users_bp.route('/', methods=['POST'])
@token_required
@admin_required
def create_user_admin():
    data = request.get_json()
    if not data or not data.get('email'):
        return jsonify({'message': 'Email is required'}), 400
        
    if User.query.filter_by(email=data.get('email')).first():
        return jsonify({'message': 'Email already exists'}), 409
        
    try:
        new_user = User(
            name=data.get('name', 'New Farmer'),
            email=data.get('email'),
            role=data.get('role', 'user'),
            phone=data.get('phone', ''),
            location=data.get('location', ''),
            farm_size=data.get('farm_size') or data.get('farmSize', ''),
            status='active'
        )
        new_user.set_password('welcome123') # Default password
        db.session.add(new_user)
        db.session.commit()
        
        # DSA ROADMAP: Push to undo stack
        admin_stack.push({
            'type': 'user_creation',
            'user_id': new_user.id,
            'action': f"Created user {new_user.name}"
        })
        
        return jsonify(new_user.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 500

@users_bp.route('/<int:user_id>', methods=['DELETE'])
@token_required
@admin_required
def delete_user(user_id):
    user = User.query.get_or_404(user_id)
    user_data = user.to_dict() # Capture all data before deletion
    try:
        # DSA ROADMAP: Push to undo stack WITH full data for restoration
        admin_stack.push({
            'type': 'user_deletion',
            'user_id': user_id,
            'user_data': user_data,
            'action': f"Deleted user {user.name}"
        })
        
        db.session.delete(user)
        db.session.commit()
        return jsonify({'message': 'User deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 500
