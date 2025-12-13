from .database import db
from .user import User
from .farm import Farm
from .prediction import Prediction
from .network_metrics import NetworkMetric

def init_db(app):
    with app.app_context():
        db.create_all()
        # check if admin exists, if not create one
        admin = User.query.filter_by(email='admin@agri.com').first()
        if not admin:
            admin = User(
                name='Admin User',
                email='admin@agri.com',
                role='admin',
                status='active',
                phone='1234567890',
                location='Headquarters'
            )
            admin.set_password('admin123')
            db.session.add(admin)
            db.session.commit()
            print("Admin user created")
