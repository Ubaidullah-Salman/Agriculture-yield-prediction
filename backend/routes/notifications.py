from flask import Blueprint, request, jsonify, g
from models import db, Notification
from middleware.auth_middleware import token_required
from utils.dsa import CircularQueue

notifications_bp = Blueprint('notifications', __name__)

# DSA INTEGRATION: Circular Queue for recent notification cache
# In a real app, this would be per-user, but for demo we'll cache recent system-wide
notif_cache = CircularQueue(50)

@notifications_bp.route('/', methods=['GET'], strict_slashes=False)
@token_required
def get_notifications():
    # DSA INTEGRATION: Check cache first
    cached = notif_cache.get_all()
    # Filter for current user from cache (showing we can search/filter cached data)
    user_notifications = [n for n in cached if n['user_id'] == g.current_user.id]
    
    if user_notifications:
        return jsonify(user_notifications), 200

    notifications = Notification.query.filter_by(user_id=g.current_user.id).order_by(Notification.created_at.desc()).limit(20).all()
    data = [n.to_dict() for n in notifications]
    
    # Fill cache
    for d in data:
        notif_cache.enqueue(d)
        
    return jsonify(data), 200

@notifications_bp.route('/<int:notification_id>/read', methods=['PUT'])
@token_required
def mark_read(notification_id):
    notification = Notification.query.filter_by(id=notification_id, user_id=g.current_user.id).first_or_404()
    notification.is_read = True
    db.session.commit()
    return jsonify({'message': 'Notification marked as read'}), 200

@notifications_bp.route('/mark-all-read', methods=['PUT'])
@token_required
def mark_all_read():
    Notification.query.filter_by(user_id=g.current_user.id, is_read=False).update({Notification.is_read: True})
    db.session.commit()
    return jsonify({'message': 'All notifications marked as read'}), 200
