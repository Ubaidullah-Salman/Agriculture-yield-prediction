from datetime import datetime
from .database import db

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
