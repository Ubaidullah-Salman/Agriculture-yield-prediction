from flask import Blueprint, jsonify, request
from middleware.auth_middleware import token_required, admin_required
from models import db, User, Prediction
from services.network_monitor import NetworkMonitor
import psutil
import time

admin_bp = Blueprint('admin', __name__)
monitor = NetworkMonitor()

@admin_bp.route('/stats', methods=['GET'])
@token_required
@admin_required
def get_stats():
    total_users = User.query.count()
    active_users = User.query.filter_by(status='active').count()
    inactive_users = User.query.filter_by(status='inactive').count()
    
    # Mock 'new this month'
    new_users = 12
    
    return jsonify({
        'totalUsers': total_users,
        'activeUsers': active_users,
        'inactiveUsers': inactive_users,
        'newUsersThisMonth': new_users
    }), 200

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
        {'metric': 'API Response', 'value': 120, 'unit': 'ms', 'status': 'good'}, # Mock
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
