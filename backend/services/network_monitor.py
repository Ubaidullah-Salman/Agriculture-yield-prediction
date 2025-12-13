from models import db, NetworkMetric, User
from sqlalchemy import func
from datetime import datetime, timedelta
import geoip2.database
import user_agents

class NetworkMonitor:
    def __init__(self):
        # In a real app, we'd use a real GeoIP database
        # self.reader = geoip2.database.Reader('GeoLite2-City.mmdb')
        pass
        
    def log_metric(self, user_id, ip_address, user_agent_str, latency, client_data=None):
        # Parse User Agent
        ua = user_agents.parse(user_agent_str)
        device_type = 'Mobile' if ua.is_mobile else 'Tablet' if ua.is_tablet else 'Desktop'
        
        # Mock Geo/ISP data based on IP if real DB not available
        region = 'Pakistan' # Default
        isp = 'Jio' # Default
        
        if client_data:
            region = client_data.get('region', region)
            isp = client_data.get('isp', isp)
            
        # Determine connection quality
        quality = 'Excellent'
        if latency > 100: quality = 'Good'
        if latency > 300: quality = 'Fair'
        if latency > 1000: quality = 'Poor'
        
        metric = NetworkMetric(
            user_id=user_id,
            ip_address=ip_address,
            user_agent=str(ua),
            device_type=device_type,
            latency_ms=latency,
            region=region,
            isp_name=isp,
            connection_quality=quality,
            packet_loss_rate=client_data.get('packet_loss', 0.0) if client_data else 0.0
        )
        
        db.session.add(metric)
        db.session.commit()
        
    def get_regional_stats(self):
        # Aggregation query
        results = db.session.query(
            NetworkMetric.region,
            func.avg(NetworkMetric.latency_ms).label('avg_latency'),
            func.avg(NetworkMetric.packet_loss_rate).label('avg_loss'),
            func.count(NetworkMetric.id).label('count')
        ).group_by(NetworkMetric.region).all()
        
        return [
            {
                'region': r.region or 'Unknown',
                'latency': round(r.avg_latency, 1) if r.avg_latency else 0,
                'packetLoss': round(r.avg_loss, 2) if r.avg_loss else 0,
                'users': r.count,
                'quality': 'Excellent' if (r.avg_latency or 0) < 100 else 'Good'
            }
            for r in results
        ]

    def get_isp_performance(self):
        results = db.session.query(
            NetworkMetric.isp_name,
            func.avg(NetworkMetric.latency_ms).label('avg_latency'),
            func.count(NetworkMetric.id).label('count')
        ).group_by(NetworkMetric.isp_name).all()
        
        return [
            {
                'isp': r.isp_name or 'Unknown',
                'avgLatency': round(r.avg_latency, 1) if r.avg_latency else 0,
                'reliability': 98.5, # Mock reliability
                'users': r.count
            }
            for r in results
        ]
        
    def get_quality_trend(self):
        # Last 24 hours trend
        # Simplifying to returning mock trend if DB empty
        return [
            {'time': '00:00', 'quality': 95},
            {'time': '06:00', 'quality': 92},
            {'time': '12:00', 'quality': 88},
            {'time': '18:00', 'quality': 94},
        ]
