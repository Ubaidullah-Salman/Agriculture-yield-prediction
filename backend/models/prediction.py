from datetime import datetime
from .database import db
import json

class Prediction(db.Model):
    __tablename__ = 'predictions'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    prediction_type = db.Column(db.String(50), nullable=False)  # 'yield', 'price', 'pest'
    
    # Input parameters stored as JSON
    input_data = db.Column(db.Text, nullable=False)
    
    # Result data stored as JSON
    result_data = db.Column(db.Text, nullable=False)
    
    # If image inputs were used
    image_path = db.Column(db.String(255), nullable=True)
    
    feedback_score = db.Column(db.Integer, nullable=True)  # User rating of prediction usefulness
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
