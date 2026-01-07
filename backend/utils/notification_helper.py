from models import db, Notification
from routes.notifications import notif_cache
from datetime import datetime

def create_notification(user_id, title, message, notif_type='info'):
    """
    Creates a notification in the database and updates the circular queue cache.
    """
    try:
        new_notif = Notification(
            user_id=user_id,
            title=title,
            message=message,
            type=notif_type,
            created_at=datetime.utcnow()
        )
        db.session.add(new_notif)
        db.session.commit()
        
        # Also update the cache
        notif_cache.enqueue(new_notif.to_dict())
        
        return new_notif
    except Exception as e:
        print(f"Error creating notification: {e}")
        db.session.rollback()
        return None

def process_weather_alerts(user_id, alerts):
    """
    Takes a list of weather alerts and creates notifications for high severity ones.
    """
    for alert in alerts:
        if alert.get('severity') == 'high':
            create_notification(
                user_id=user_id,
                title=alert['title'],
                message=alert['message'],
                notif_type='warning'
            )
