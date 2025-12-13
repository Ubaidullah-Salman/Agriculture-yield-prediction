from flask import Blueprint, request, jsonify
from middleware.auth_middleware import token_required
import random

market_bp = Blueprint('market', __name__)
advisory_bp = Blueprint('advisory', __name__)

# Market Routes
@market_bp.route('/prices', methods=['GET'])
@token_required
def get_prices():
    # Mock market data
    crops = ['Wheat', 'Rice', 'Cotton', 'Maize', 'Sugarcane', 'Soybean']
    data = []
    
    for crop in crops:
        base = random.randint(2000, 6000)
        change = random.uniform(-5.0, 5.0)
        data.append({
            'crop': crop,
            'price': base,
            'unit': 'INR/Quintal',
            'change': round(change, 2),
            'trend': 'up' if change > 0 else 'down'
        })
    return jsonify(data), 200

@market_bp.route('/history/<crop>', methods=['GET'])
@token_required
def get_history(crop):
    # Mock history
    return jsonify([
        {'date': '2023-01-01', 'price': 2500},
        {'date': '2023-01-02', 'price': 2550},
        {'date': '2023-01-03', 'price': 2520},
    ]), 200

# Advisory Routes
@advisory_bp.route('/', methods=['GET'])
@token_required
def get_advisory():
    crop = request.args.get('crop')
    # Mock advisory
    return jsonify({
        'crop': crop,
        'stage': 'Sowing',
        'recommendation': 'Ensure proper spacing and seed treatment.',
        'fertilizer': 'Use DAP 50kg/acre',
        'pest_management': 'Monitor for termites.'
    }), 200
