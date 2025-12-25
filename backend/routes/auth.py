from flask import Blueprint, request, jsonify, current_app
from models import db, User
import jwt
import datetime
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
import os

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    
    # Basic validation
    if not data or not data.get('email') or not data.get('password') or not data.get('name'):
        return jsonify({'message': 'Missing required fields'}), 400
        
    if User.query.filter_by(email=data.get('email')).first():
        return jsonify({'message': 'Email already exists'}), 409
        
    try:
        new_user = User(
            name=data.get('name'),
            email=data.get('email'),
            role=data.get('role', 'user'),
            phone=data.get('phone'),
            location=data.get('location'),
            farm_size=data.get('farm_size')
        )
        new_user.set_password(data.get('password'))
        
        db.session.add(new_user)
        db.session.commit()
        
        return jsonify({'message': 'User created successfully', 'user': new_user.to_dict()}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'message': 'Missing email or password'}), 400
        
    user = User.query.filter_by(email=data.get('email')).first()
    
    if not user or not user.check_password(data.get('password')):
        return jsonify({'message': 'Invalid credentials'}), 401
        
    # Update last login
    user.last_login = datetime.datetime.utcnow()
    db.session.commit()
    
    # Generate token
    token = jwt.encode({
        'user_id': user.id,
        'role': user.role,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(seconds=current_app.config['JWT_ACCESS_TOKEN_EXPIRES'])
    }, current_app.config['JWT_SECRET_KEY'], algorithm="HS256")
    
    return jsonify({
        'token': token,
        'user': user.to_dict()
    }), 200

@auth_bp.route('/verify', methods=['GET'])
# We'll need to import token_required from middleware, but to avoid circular imports 
# in this file structure, we'll do the import inside the function or fix the structure later.
# For now, let's assume middleware is available or import it at top if possible.
def verify_token():
    from middleware.auth_middleware import token_required
    from flask import g
    
    @token_required
    def _verify():
        return jsonify({'valid': True, 'user': g.current_user.to_dict()}), 200
        
    return _verify()

@auth_bp.route('/google-login', methods=['POST'])
def google_login():
    data = request.get_json()
    token = data.get('token')
    
    if not token:
        return jsonify({'message': 'Missing token'}), 400
        
    try:
        # Verify the token
        CLIENT_ID = os.getenv('GOOGLE_CLIENT_ID')
        
        # Verify token - if CLIENT_ID is None, this might verify signature but not audience.
        # Ideally we want strict audience check.
        request_adapter = google_requests.Request()
        id_info = id_token.verify_oauth2_token(token, request_adapter, CLIENT_ID)

        # Check if user exists
        email = id_info['email']
        name = id_info.get('name', 'Unknown')
        
        user = User.query.filter_by(email=email).first()
        
        if not user:
            # Create new user
            user = User(
                name=name,
                email=email,
                role='user',
                password_hash='google_oauth_dummy_hash', 
                status='active',
                phone='',
                location='',
                farm_size=''
            )
            db.session.add(user)
            db.session.commit()
            
        # Update last login
        user.last_login = datetime.datetime.utcnow()
        db.session.commit()
        
        # Generate JWT
        token = jwt.encode({
            'user_id': user.id,
            'role': user.role,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(seconds=current_app.config['JWT_ACCESS_TOKEN_EXPIRES'])
        }, current_app.config['JWT_SECRET_KEY'], algorithm="HS256")
        
        return jsonify({
            'token': token,
            'user': user.to_dict()
        }), 200
        
    except ValueError as e:
        return jsonify({'message': f'Invalid token: {str(e)}'}), 401
    except Exception as e:
        print(f"GOOGLE LOGIN ERROR: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'message': str(e)}), 500
