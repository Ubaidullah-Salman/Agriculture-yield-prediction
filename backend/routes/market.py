from flask import Blueprint, request, jsonify
from middleware.auth_middleware import token_required
import random
from ml_models.crop_price_model import CropPriceModel
import time

market_bp = Blueprint('market', __name__)
advisory_bp = Blueprint('advisory', __name__)

price_model = CropPriceModel()

# Global state for simulation
class MarketSimulator:
    def __init__(self, base_prices):
        self.current_prices = base_prices.copy()
        self.last_update = time.time()
    
    def get_prices(self):
        # Update prices based on time elapsed or just random walk on call
        # For demo: simple random walk
        for crop in self.current_prices:
            # -0.5% to +0.5% fluctuation per call
            change = random.uniform(-0.005, 0.005) 
            self.current_prices[crop] = self.current_prices[crop] * (1 + change)
            
            # Keep within 20% of base price to prevent drift to crazy numbers
            base = price_model.market_prices[crop]
            if self.current_prices[crop] > base * 1.2:
                self.current_prices[crop] = base * 1.2
            elif self.current_prices[crop] < base * 0.8:
                self.current_prices[crop] = base * 0.8
                
        return self.current_prices

# Initialize simulator with base prices from model
simulator = MarketSimulator(price_model.market_prices)

# Market Routes
@market_bp.route('/prices', methods=['GET'])
@token_required
def get_prices():
    # Get live simulated prices
    live_prices = simulator.get_prices()
    
    data = []
    
    for crop_name, price in live_prices.items():
        # Calculate daily change vs the STATIC base price
        base = price_model.market_prices[crop_name]
        change_pct = ((price - base) / base) * 100
        
        data.append({
            'crop': crop_name.title(),
            'price': int(price),
            'unit': 'PKR/40kg',
            'change': f"{change_pct:+.2f}%",
            'trend': 'up' if change_pct > 0 else 'down'
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
