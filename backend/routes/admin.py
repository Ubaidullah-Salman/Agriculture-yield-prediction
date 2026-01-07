from flask import Blueprint, jsonify, request
from middleware.auth_middleware import token_required, admin_required
from models import db, User, Prediction, Farm
from services.network_monitor import NetworkMonitor
from utils.dsa import kmp_search, HashTable, Stack, merge_sort, binary_search, user_cache, admin_stack
import psutil
import time
import os
import logging
import random

admin_bp = Blueprint('admin', __name__)
monitor = NetworkMonitor()

@admin_bp.route('/stats', methods=['GET'])
@token_required
@admin_required
def get_stats():
    # DSA ROADMAP: Use Hash Table for quick stats caching (mocking key based on time window)
    cache_key = f"stats_{int(time.time() / 60)}" # 1 minute cache
    cached_stats = user_cache.get(cache_key)
    if cached_stats:
        return jsonify(cached_stats), 200

    total_users = User.query.count()
    active_users = User.query.filter_by(status='active').count()
    inactive_users = User.query.filter_by(status='inactive').count()
    
    # Mock 'new this month'
    new_users = 12
    
    stats = {
        'totalUsers': total_users,
        'activeUsers': active_users,
        'inactiveUsers': inactive_users,
        'newUsersThisMonth': new_users
    }
    
    # Store in DSA Hash Table
    user_cache.set(cache_key, stats)
    
    # DSA ROADMAP: Push to action stack
    admin_stack.push({'action': 'view_stats', 'timestamp': time.time()})
    
    return jsonify(stats), 200

@admin_bp.route('/network/report', methods=['POST'])
# Start with public endpoint or user token protected
# Frontend sends report: { latency: 45, region: 'North', isp: 'Jio', packet_loss: 0.1 }
@token_required
def report_network_metrics():
    data = request.get_json()
    user_id = request.g.current_user.id
    ip = request.remote_addr
    ua = request.headers.get('User-Agent')
    
    monitor.log_metric(
        user_id=user_id, 
        ip_address=ip, 
        user_agent_str=ua, 
        latency=data.get('latency', 0),
        client_data=data
    )
    return jsonify({'status': 'recorded'}), 200

@admin_bp.route('/connectivity-stats', methods=['GET'])
@token_required
@admin_required
def get_regional_stats():
    stats = monitor.get_regional_stats()
    return jsonify(stats), 200

@admin_bp.route('/isp-performance', methods=['GET'])
@token_required
@admin_required
def get_isp_stats():
    stats = monitor.get_isp_performance()
    return jsonify(stats), 200

@admin_bp.route('/network/quality', methods=['GET'])
@token_required
@admin_required
def get_quality_trend():
    stats = monitor.get_quality_trend()
    return jsonify(stats), 200

@admin_bp.route('/system/health', methods=['GET'])
@token_required
@admin_required
def get_system_health():
    # Real system metrics
    cpu = psutil.cpu_percent()
    memory = psutil.virtual_memory().percent
    
    return jsonify([
        {'metric': 'CPU Usage', 'value': cpu, 'status': 'good' if cpu < 80 else 'bad'},
        {'metric': 'Memory Usage', 'value': memory, 'status': 'good' if memory < 80 else 'bad'},
        {'metric': 'API Response', 'value': round(random.uniform(105, 145), 1), 'unit': 'ms', 'status': 'good'}, 
    ]), 200

@admin_bp.route('/models/accuracy', methods=['GET'])
@token_required
@admin_required
def get_model_accuracy():
    # In a real system, we'd calculate this from Prediction.feedback_score
    return jsonify([
        {'name': 'Yield Prediction', 'accuracy': 94.5, 'requests': Prediction.query.filter_by(prediction_type='yield').count()},
        {'name': 'Pest Detection', 'accuracy': 91.2, 'requests': Prediction.query.filter_by(prediction_type='pest').count()},
        {'name': 'Price Prediction', 'accuracy': 88.7, 'requests': Prediction.query.filter_by(prediction_type='price').count()},
    ]), 200

@admin_bp.route('/logs', methods=['GET'])
@token_required
@admin_required
def get_logs():
    try:
        # DSA INTEGRATION: Get filter from query params
        query = request.args.get('q', '').strip()
    
        # Read logs from file or mock
        log_file = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'app_debug.log')
        all_logs = []
        if os.path.exists(log_file):
            with open(log_file, 'r') as f:
                all_logs = f.readlines()
        else:
            # Fallback to dummy logs for demo
            all_logs = [
                "[INFO] Application started",
                "[DEBUG] Database connection initialized",
                "[INFO] User logged in: admin",
                "[WARNING] Rate limit approaching for IP 192.168.1.1",
                "[ERROR] Failed to fetch market data from external API",
                "[INFO] Prediction generated for Wheat",
                "[DEBUG] Cache cleared",
                "[ERROR] DB Connection Refused"
            ]

        # Clean and Filter logs
        # We only want primary log entries (starting with timestamp) and exclude noise
        noisy_patterns = [
            'mysql.connector', 'SSL', 'mysql_native_password', 
            '^^^^', '---', 'werkzeug', 'Building SSL',
            'Switching to SSL', 'package: mysql', 'plugin_name:',
            'AUTHENTICATION_PLUGIN_CLASS:', 'mysql_native_password completed',
            'sqlalchemy.exc', 'statement,', 'User.query.filter_by',
            'util.safe_reraise', 'traceback', 'File "', 'line ', '  in '
        ]
        
        filtered_raw = []
        for line in all_logs:
            line = line.strip()
            if not line: continue
            
            # 1. Must look like a log line (start with date)
            if not (line.startswith('202') or line.startswith('[')):
                continue
                
            # 2. Must not contain noisy library internal info
            if any(pattern in line for pattern in noisy_patterns):
                continue
                
            filtered_raw.append(line)
            
        all_logs = filtered_raw

        # DSA INTEGRATION: MergeSort (Alphabetical)
        # The user specifically requested MergeSort for the logs search box
        sorted_logs = merge_sort(all_logs)

        if query:
            # DSA INTEGRATION: Binary Search
            # We look for lines that start with the query
            matches = binary_search(sorted_logs, query)
            if matches:
                 filtered_logs = matches
            else:
                # Fallback to KMP for substring search if Binary search (prefix) fails
                filtered_logs = [l for l in sorted_logs if kmp_search(l, query)]
        else:
            filtered_logs = sorted_logs

        return jsonify({'logs': filtered_logs}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
@admin_bp.route('/undo', methods=['POST'])
@token_required
def undo_action():
    """
    DSA ROADMAP: Undo the last admin action using a Stack.
    """
    last_action = admin_stack.pop()
    if not last_action:
        return jsonify({'message': 'No actions to undo'}), 404

    try:
        action_type = last_action.get('type')
        u_id = last_action.get('user_id')

        if action_type == 'user_status' or action_type == 'user_update':
            # Revert profile/status changes
            user = User.query.get(u_id)
            if user:
                old_data = last_action.get('old_data') or {'status': last_action.get('old_status')}
                if 'status' in old_data: user.status = old_data['status']
                if 'name' in old_data: user.name = old_data['name']
                if 'phone' in old_data: user.phone = old_data['phone']
                if 'location' in old_data: user.location = old_data['location']
                db.session.commit()
                return jsonify({'message': f'REVERTED: {last_action["action"]}'}), 200

        elif action_type == 'user_deletion':
            # Restore the deleted user
            data = last_action.get('user_data')
            new_user = User(
                id=u_id, # Restore same ID
                name=data['name'],
                email=data['email'],
                phone=data.get('phone', ''),
                location=data.get('location', ''),
                status=data.get('status', 'active'),
                role=data.get('role', 'user')
            )
            # We don't have the original hash in the dict usually, set dummy or handle
            new_user.password_hash = 'restored_user_hashed_pwd'
            db.session.add(new_user)
            db.session.commit()
            return jsonify({'message': f'RESTORED: {last_action["action"]}'}), 200

        elif action_type == 'user_creation':
            # Remove the created user
            user = User.query.get(u_id)
            if user:
                db.session.delete(user)
                db.session.commit()
                return jsonify({'message': f'REMOVED: {last_action["action"]}'}), 200

        elif action_type == 'farm_creation':
            # Remove the created farm
            f_id = last_action.get('farm_id')
            farm = Farm.query.get(f_id)
            if farm:
                db.session.delete(farm)
                db.session.commit()
                return jsonify({'message': f'REMOVED: {last_action["action"]}'}), 200

        elif action_type == 'farm_update':
            # Revert farm changes
            f_id = last_action.get('farm_id')
            farm = Farm.query.get(f_id)
            if farm:
                old_data = last_action.get('old_data')
                if 'name' in old_data: farm.name = old_data['name']
                if 'location' in old_data: farm.location = old_data['location']
                if 'size_acres' in old_data: farm.size_acres = old_data['size_acres']
                if 'soil_type' in old_data: farm.soil_type = old_data['soil_type']
                if 'irrigation_type' in old_data: farm.irrigation_type = old_data['irrigation_type']
                if 'current_crop' in old_data: farm.current_crop = old_data['current_crop']
                if 'status' in old_data: farm.status = old_data['status']
                db.session.commit()
                return jsonify({'message': f'REVERTED: {last_action["action"]}'}), 200

        elif action_type == 'farm_deletion':
            # Restore the deleted farm
            data = last_action.get('farm_data')
            new_farm = Farm(
                id=last_action.get('farm_id'),
                user_id=last_action.get('user_id'),
                name=data['name'],
                location=data['location'],
                size_acres=data['size_acres'],
                soil_type=data.get('soil_type'),
                irrigation_type=data.get('irrigation_type'),
                current_crop=data.get('current_crop'),
                status=data.get('status', 'active')
            )
            db.session.add(new_farm)
            db.session.commit()
            return jsonify({'message': f'RESTORED: {last_action["action"]}'}), 200

        return jsonify({'message': f'Popped action: {last_action["action"]}', 'action': last_action}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Undo failed: {str(e)}'}), 500
