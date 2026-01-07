from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import json
import bcrypt

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), default='user')  # 'user' or 'admin'
    
    # Profile fields
    phone = db.Column(db.String(20), nullable=True)
    location = db.Column(db.String(100), nullable=True)
    farm_size = db.Column(db.String(50), nullable=True)
    
    # Metadata
    status = db.Column(db.String(20), default='active')  # 'active', 'inactive'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    last_login = db.Column(db.DateTime, nullable=True)
    
    # Relationships
    farms = db.relationship('Farm', backref='owner', lazy=True)
    predictions = db.relationship('Prediction', backref='user', lazy=True)
    network_metrics = db.relationship('NetworkMetric', backref='user', lazy=True)
    notifications = db.relationship('Notification', backref='user', lazy=True)

    def set_password(self, password):
        self.password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    def check_password(self, password):
        return bcrypt.checkpw(password.encode('utf-8'), self.password_hash.encode('utf-8'))

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'role': self.role,
            'phone': self.phone,
            'location': self.location,
            'farm_size': self.farm_size,
            'status': self.status,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'last_login': self.last_login.isoformat() if self.last_login else None
        }

class Farm(db.Model):
    __tablename__ = 'farms'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    location = db.Column(db.String(100), nullable=False)
    size_acres = db.Column(db.Float, nullable=False)
    soil_type = db.Column(db.String(50), nullable=True)
    irrigation_type = db.Column(db.String(50), nullable=True)
    current_crop = db.Column(db.String(50), nullable=True)
    status = db.Column(db.String(20), default='active')  # 'active', 'fallow'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'name': self.name,
            'location': self.location,
            'size_acres': self.size_acres,
            'soil_type': self.soil_type,
            'irrigation_type': self.irrigation_type,
            'current_crop': self.current_crop,
            'status': self.status,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }

class Prediction(db.Model):
    __tablename__ = 'predictions'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    prediction_type = db.Column(db.String(50), nullable=False)  # 'yield', 'price', 'pest'
    input_data = db.Column(db.Text, nullable=False)
    result_data = db.Column(db.Text, nullable=False)
    image_path = db.Column(db.String(255), nullable=True)
    feedback_score = db.Column(db.Integer, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'prediction_type': self.prediction_type,
            'input_data': json.loads(self.input_data) if self.input_data else {},
            'result_data': json.loads(self.result_data) if self.result_data else {},
            'image_path': self.image_path,
            'created_at': self.created_at.isoformat()
        }

class Notification(db.Model):
    __tablename__ = 'notifications'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    title = db.Column(db.String(100), nullable=False)
    message = db.Column(db.Text, nullable=False)
    type = db.Column(db.String(20), default='info')  # 'info', 'warning', 'success', 'error'
    is_read = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'title': self.title,
            'message': self.message,
            'type': self.type,
            'is_read': self.is_read,
            'created_at': self.created_at.isoformat()
        }

class NetworkMetric(db.Model):
    __tablename__ = 'network_metrics'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    latency_ms = db.Column(db.Float, nullable=True)
    packet_loss_rate = db.Column(db.Float, nullable=True)
    connection_quality = db.Column(db.String(20), nullable=True)
    connection_type = db.Column(db.String(20), nullable=True)
    isp_name = db.Column(db.String(100), nullable=True)
    ip_address = db.Column(db.String(50), nullable=True)
    region = db.Column(db.String(50), nullable=True)
    city = db.Column(db.String(100), nullable=True)
    device_type = db.Column(db.String(50), nullable=True)
    user_agent = db.Column(db.String(255), nullable=True)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'latency_ms': self.latency_ms,
            'packet_loss_rate': self.packet_loss_rate,
            'connection_quality': self.connection_quality,
            'connection_type': self.connection_type,
            'isp_name': self.isp_name,
            'region': self.region,
            'timestamp': self.timestamp.isoformat()
        }

def init_db(app):
    with app.app_context():
        db.create_all()
        admin = User.query.filter_by(email='admin@agri.com').first()
        if not admin:
            admin = User(name='Admin User', email='admin@agri.com', role='admin', status='active', phone='1234567890', location='Headquarters')
            admin.set_password('admin123')
            db.session.add(admin)
            db.session.commit()
            welcome = Notification(user_id=admin.id, title="Welcome to AgriPredict", message="Your administrative dashboard is ready. monitor system health and user activity here.", type="success")
            db.session.add(welcome)
            db.session.commit()
            print("Admin user and notification created")
