from flask import Blueprint, jsonify, g
from middleware.auth_middleware import token_required
from services.analytics_service import AnalyticsService

analytics_bp = Blueprint('analytics', __name__)
service = AnalyticsService()

@analytics_bp.route('/plots', methods=['GET'])
@token_required
def get_analytics_plots():
    try:
        user_id = g.current_user.id
        
        # Generate distribution plot
        dist_plot = service.generate_prediction_distribution(user_id)
        
        # Generate yield trend plot
        yield_plot = service.generate_yield_analysis(user_id)
        
        return jsonify({
            'distribution_plot': dist_plot,
            'yield_plot': yield_plot
        }), 200
    except Exception as e:
        print(f"Error in analytics routes: {e}")
        return jsonify({'error': str(e)}), 500
