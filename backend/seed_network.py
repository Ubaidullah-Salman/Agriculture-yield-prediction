from app import app
from models.database import db
from models.network_metrics import NetworkMetric
from models.user import User
import random
from datetime import datetime, timedelta

def seed_network_data():
    with app.app_context():
        print("Seeding network metrics...")
        
        # Get admin user or first user
        admin = User.query.filter_by(role='admin').first()
        user_id = admin.id if admin else 1
        
        isps = ['Jazz', 'Telenor', 'Zong', 'PTCL', 'StormFiber']
        regions = ['North', 'Central', 'South', 'West']
        qualities = ['Excellent', 'Good', 'Fair', 'Poor']
        
        # Create 100 random metrics over the last 24 hours
        now = datetime.utcnow()
        for i in range(100):
            region = random.choice(regions)
            isp = random.choice(isps)
            
            # Weighted random latency based on region
            base_latency = 20
            if region == 'North': base_latency = 30
            elif region == 'South': base_latency = 45
            elif region == 'West': base_latency = 60
            
            latency = base_latency + random.randint(0, 40)
            
            # Quality based on latency
            quality = 'Excellent'
            if latency > 100: quality = 'Good'
            if latency > 300: quality = 'Fair'
            
            metric = NetworkMetric(
                user_id=user_id,
                latency_ms=latency,
                packet_loss_rate=round(random.uniform(0, 2), 2),
                connection_quality=quality,
                isp_name=isp,
                region=region,
                ip_address=f"192.168.1.{random.randint(1, 254)}",
                device_type=random.choice(['Desktop', 'Mobile', 'Tablet']),
                timestamp=now - timedelta(minutes=random.randint(0, 1440))
            )
            db.session.add(metric)
            
        try:
            db.session.commit()
            print("Successfully seeded 100 network metrics!")
        except Exception as e:
            db.session.rollback()
            print(f"Error seeding data: {e}")

if __name__ == "__main__":
    seed_network_data()
