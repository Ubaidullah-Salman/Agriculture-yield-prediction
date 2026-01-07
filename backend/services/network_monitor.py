from models import db, NetworkMetric, User
from sqlalchemy import func
from datetime import datetime, timedelta
import geoip2.database
import user_agents
from utils.dsa import Graph

class NetworkMonitor:
    def __init__(self):
        # DSA ROADMAP: Use Graph to track region-to-region network topology
        self.topology = Graph()
        # Mocking some regional connections
        self.topology.add_edge('North', 'Central', weight=20)
        self.topology.add_edge('Central', 'South', weight=15)
        self.topology.add_edge('South', 'West', weight=30)
        self.topology.add_edge('West', 'North', weight=25)
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
        
        # Organize results by region for quick lookup
        stats_map = {r.region: r for r in results}
        
        # DSA ROADMAP: Use BFS to analyze connectivity from a reference region (e.g., 'North')
        reachable_regions = self.topology.bfs('North')
        
        # Always return all regions in our topology
        final_stats = []
        for region_name in self.topology.nodes:
            stats = stats_map.get(region_name)
            final_stats.append({
                'region': region_name,
                'latency': round(stats.avg_latency, 1) if stats and stats.avg_latency else 0,
                'packetLoss': round(stats.avg_loss, 2) if stats and stats.avg_loss else 0,
                'users': stats.count if stats else 0,
                'quality': 'Excellent' if not stats or (stats.avg_latency or 0) < 100 else 'Good',
                'isReachable': region_name in reachable_regions # DSA Insight
            })
            
        return final_stats

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
