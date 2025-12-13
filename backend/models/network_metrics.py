from datetime import datetime
from .database import db

class NetworkMetric(db.Model):
    __tablename__ = 'network_metrics'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    
    # Connection metrics
    latency_ms = db.Column(db.Float, nullable=True)
    packet_loss_rate = db.Column(db.Float, nullable=True)
    connection_quality = db.Column(db.String(20), nullable=True)  # Excellent, Good, Fair, Poor
    connection_type = db.Column(db.String(20), nullable=True)  # 4G, 5G, WiFi, Broadband
    
    # ISP and Location data
    isp_name = db.Column(db.String(100), nullable=True)
    ip_address = db.Column(db.String(50), nullable=True)
    region = db.Column(db.String(50), nullable=True)  # North, South, East, West
    city = db.Column(db.String(100), nullable=True)
    
    # Device info
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
