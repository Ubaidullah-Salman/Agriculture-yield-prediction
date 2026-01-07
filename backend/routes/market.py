from flask import Blueprint, request, jsonify, g
from middleware.auth_middleware import token_required
import random
from ml_models.crop_price_model import CropPriceModel
import time
from utils.dsa import merge_sort, binary_search, get_top_n_gainers

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
            # -5% to +5% fluctuation per call for clearer updates
            change = random.uniform(-0.05, 0.05) 
            self.current_prices[crop] = self.current_prices[crop] * (1 + change)
            
            # Keep within 30% of base price
            base = price_model.market_prices[crop]
            if self.current_prices[crop] > base * 1.3:
                self.current_prices[crop] = base * 1.3
            elif self.current_prices[crop] < base * 0.7:
                self.current_prices[crop] = base * 0.7
                
        return self.current_prices

# Initialize simulator with base prices from model
simulator = MarketSimulator(price_model.market_prices)

# Market Routes
@market_bp.route('/prices', methods=['GET'])
# Public route for easier access
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
    
    # DSA INTEGRATION: Use manual MergeSort to sort prices by crop name (Stable Sort)
    sorted_data = merge_sort(data, key=lambda x: x['crop'])
    
    return jsonify(sorted_data), 200

@market_bp.route('/search', methods=['GET'])
def search_crop():
    """
    Search for a specific crop using manual Binary Search.
    """
    query = request.args.get('q', '').strip()
    if not query:
        return jsonify({'message': 'Query required'}), 400
        
    live_prices = simulator.get_prices()
    data = []
    for crop_name, price in live_prices.items():
        base = price_model.market_prices[crop_name]
        change_pct = ((price - base) / base) * 100
        data.append({
            'crop': crop_name.title(),
            'price': int(price),
            'change': f"{change_pct:+.2f}%",
            'trend': 'up' if change_pct > 0 else 'down'
        })
    
    # Sort for binary search using MergeSort
    sorted_data = merge_sort(data, key=lambda x: x['crop'])
    
    # DSA INTEGRATION: Use manual Binary Search
    results = binary_search(sorted_data, query, key=lambda x: x['crop'])
    
    if results:
        return jsonify(results), 200
    return jsonify({'message': 'Crop not found'}), 404

@market_bp.route('/top-gainers', methods=['GET'])
def get_top_gainers():
    """
    Find top 3 gainers using manual Heap-based logic.
    """
    live_prices = simulator.get_prices()
    data = []
    for crop_name, price in live_prices.items():
        base = price_model.market_prices[crop_name]
        change_pct = ((price - base) / base) * 100
        data.append({
            'crop': crop_name.title(),
            'price': int(price),
            'change': f"{change_pct:+.2f}%",
            'trend': 'up' if change_pct > 0 else 'down'
        })
        
    # DSA INTEGRATION: Use manual Heap-based selection
    gainers = get_top_n_gainers(data, n=3)
    
    # Trigger notification for top gainer
    if gainers:
        from utils.notification_helper import create_notification
        top = gainers[0]
        user_id = 1
        if hasattr(g, 'current_user') and g.current_user:
            user_id = g.current_user.id
            
        create_notification(
            user_id=user_id,
            title=f"Market Alert: {top['crop']} Price Surge",
            message=f"The price of {top['crop']} has increased by {top['change']}. Check market insights.",
            notif_type='success'
        )
    
    return jsonify(gainers), 200

@market_bp.route('/history/<crop>', methods=['GET'])
# Public route
def get_history(crop):
    # dynamic history based on current price
    from datetime import datetime, timedelta
    
    current_price = simulator.current_prices.get(crop.title(), 2000)
    history = []
    
    for i in range(30, -1, -1):
        date = (datetime.now() - timedelta(days=i)).strftime('%Y-%m-%d')
        # slight random var per day to simulate trend
        day_price = current_price * random.uniform(0.9, 1.1)
        history.append({'date': date, 'price': int(day_price)})
        
    return jsonify(history), 200

# Advisory Routes
# Global advisories data
ADVISORIES = {
    'Wheat': {
        'stage': 'Tillering',
        'recommendations': [
            'Ensure first irrigation at CRI stage (21 days after sowing).',
            'Apply balanced NPK: 50kg Phosphorous and 60kg Nitrogen per acre.',
            'Use Zinc Sulfate (10kg/acre) in Zinc-deficient soils for better growth.',
            'Keep field free from narrow-leaf and broad-leaf weeds.',
            'Regularly scout for Yellow Rust and Aphids during cool weather.'
        ],
        'fertilizer': 'Use Urea (1 bag/acre) with first irrigation.',
        'pest_management': 'Monitor for Yellow Rust symptoms on leaves.',
        'season': 'Rabi',
        'expectedYield': '2.5 - 3.0 Tons/Acre',
        'stages': [
            {'title': 'Sowing Stage (0-15 days)', 'care': 'Prepare well-pulverized seedbed. Ensure seed treatment with fungicides.'},
            {'title': 'Vegetative Stage (15-45 days)', 'care': 'Apply first dose of Nitrogen. Maintain weed-free environment.'},
            {'title': 'Flowering Stage (45-75 days)', 'care': 'Maintain peak moisture. Apply remaining Urea for better grain fill.'},
            {'title': 'Maturity Stage (75+ days)', 'care': 'Stop irrigation 15 days before harvest. Watch for grain hardening.'}
        ]
    },
    'Rice': {
        'stage': 'Transplanting',
        'recommendations': [
            'Maintain a consistent 2-3 inch water depth after transplanting.',
            'Use high-yielding varieties like Basmati or IRRI based on soil type.',
            'Apply Zinc Sulfate (10kg/acre) during puddling or early growth.',
            'Manage weeds using pre-emergence herbicides within 3-5 days.',
            'Monitor for Stem Borer and Brown Plant Hopper (BPH) weekly.'
        ],
        'fertilizer': 'Apply Zinc Sulfate (10kg/acre) for better growth.',
        'pest_management': 'Watch for Leaf Folder and Stem Borer attacks.',
        'season': 'Kharif',
        'expectedYield': '2.0 - 2.8 Tons/Acre',
        'stages': [
            {'title': 'Nursery Stage (0-25 days)', 'care': 'Maintain consistent water level in nursery. Control weeds early.'},
            {'title': 'Transplanting (25-45 days)', 'care': 'Plant seedlings at 20x20cm spacing. Keep water levels high.'},
            {'title': 'Panicle Initiation (45-80 days)', 'care': 'Apply Nitrogen top-dressing. Monitor for Stem Borer.'},
            {'title': 'Harvesting (80+ days)', 'care': 'Drain field 10 days before harvest. Harvest when 80% grains are golden.'}
        ]
    },
    'Cotton': {
        'stage': 'Boll Formation',
        'recommendations': [
            'Ensure proper plant spacing (1.5 - 2.5 feet) for optimal airflow.',
            'Prioritize Potassium application (SOP) to improve boll weight.',
            'Implement Integrated Pest Management (IPM) for Whitefly control.',
            'Avoid excessive Nitrogen application which attracts sucking pests.',
            'Remove weeds regularly as they host many harmful pests.'
        ],
        'fertilizer': 'Apply Potassium (SOP) to improve fiber quality.',
        'pest_management': 'Regular scouting for Whitefly and Pink Bollworm.',
        'season': 'Kharif',
        'expectedYield': '1.2 - 1.8 Tons/Acre',
        'stages': [
            {'title': 'Sowing (0-20 days)', 'care': 'Apply pre-emergence herbicide. Maintain proper plant population.'},
            {'title': 'Squaring Stage (20-50 days)', 'care': 'Monitor for sucking pests. Ensure nitrogen application is on time.'},
            {'title': 'Boll Formation (50-90 days)', 'care': 'Apply Potassium. Heavy focus on Whitefly management.'},
            {'title': 'Picking Stage (90+ days)', 'care': 'Pick clean cotton. Avoid moisture during storage.'}
        ]
    },
    'Sugarcane': {
        'stage': 'Grand Growth',
        'recommendations': [
            'Ensure deep plowing (12-14 inches) for healthy root development.',
            'Use healthy, disease-free seed setts (ideally from 10-month crop).',
            'Apply Nitrogen in three split doses for higher sugar recovery.',
            'Earthing up at 120 days is essential to prevent crop lodging.',
            'Monitor for Borers and Pyrilla, especially in high-humidity seasons.'
        ],
        'fertilizer': 'Apply nitrogenous fertilizer in 3 split doses.',
        'pest_management': 'Monitor for Top Borer and Pyrilla.',
        'season': 'Annual',
        'expectedYield': '30 - 45 Tons/Acre',
        'stages': [
            {'title': 'Germination (0-45 days)', 'care': 'Replace gaps with fresh setts. Maintain consistent soil moisture.'},
            {'title': 'Tillering (45-120 days)', 'care': 'Earthing up is critical. Apply Nitrogen in split doses.'},
            {'title': 'Grand Growth (120-270 days)', 'care': 'Regular irrigation. Check for Top Borers frequently.'},
            {'title': 'Maturity (270+ days)', 'care': 'Reduce watering. Harvest when brix reaches 18 or above.'}
        ]
    },
    'Maize': {
        'stage': 'Tasseling',
        'recommendations': [
            'Use high-quality hybrid seeds for maximum yielding potential.',
            'Maintain high moisture during the critical silking stage.',
            'Apply Nitrogen (Urea) in 3-4 split applications for best results.',
            'Stay vigilant against Fall Armyworm during the vegetative stage.',
            'Ensure proper soil drainage to avoid waterlogging and root rot.'
        ],
        'fertilizer': 'Side-dress with Nitrogen (N) for high yield.',
        'pest_management': 'Check for Fall Armyworm in the whorl.',
        'season': 'Kharif/Spring',
        'expectedYield': '3.5 - 5.0 Tons/Acre',
        'stages': [
            {'title': 'Seedling (0-15 days)', 'care': 'Control birds during emergence. Ensure proper plant spacing.'},
            {'title': 'Knee-High (15-40 days)', 'care': 'First dose of Urea. Control Fall Armyworm immediately if seen.'},
            {'title': 'Tasseling/Silking (40-70 days)', 'care': 'CRITICAL WATER STAGE. Ensure zero water stress for pollination.'},
            {'title': 'Grain Fill (70+ days)', 'care': 'Apply final Nitrogen if needed. Monitor moisture until denting.'}
        ]
    },
    'Corn': {
        'stage': 'Vegetative',
        'recommendations': [
            'Ensure the soil is rich in organic matter before planting.',
            'Apply Phosphorous at sowing and Nitrogen at knee-high stage.',
            'Keep the field weed-free during the first 40 days of growth.',
            'Check for moisture stress when the leaves begin to curl.',
            'Harvest when corn kernels are firm and have a glossy finish.'
        ],
        'fertilizer': 'High demand for Nitrogen and Phosphorus during early growth.',
        'pest_management': 'Regular monitoring for Corn Earworm.',
        'season': 'Spring/Autumn',
        'expectedYield': '4.0 - 6.0 Tons/Acre',
        'stages': [
            {'title': 'Establishment (0-20 days)', 'care': 'Deep tillage is beneficial. Use high-quality hybrid seeds.'},
            {'title': 'Vegetative Growth (20-50 days)', 'care': 'Mechanical weeding is effective. Monitor nutrient balance.'},
            {'title': 'Ear Development (50-80 days)', 'care': 'Maintain soil moisture. Prevent stalk rot through air flow.'},
            {'title': 'Dry Down (80+ days)', 'care': 'Allow kernels to dry to 15-20% moisture before harvest.'}
        ]
    }
}

@advisory_bp.route('/', methods=['GET'])
@token_required
def get_advisory():
    crop_arg = request.args.get('crop', '')
    
    if not crop_arg:
        # Return all predefined advisories
        results = []
        for c, data in ADVISORIES.items():
            item = data.copy()
            item['crop'] = c
            results.append(item)
        return jsonify(results), 200
    
    crop = crop_arg.title()
    # Fallback for unknown crops
    default_advisory = {
        'crop': crop,
        'stage': 'General Care',
        'recommendations': [
            'Test soil to determine exact nutrient deficiencies.',
            'Follow local agricultural department sowing timelines.',
            'Ensure adequate irrigation as per crop requirement.',
            'Monitor for pests and diseases on a daily basis.',
            'Maintain proper field sanitation after every harvest.'
        ],
        'fertilizer': 'Apply balanced NPK as per soil test results.',
        'pest_management': 'Regular field scouting for early pest detection.',
        'season': 'Varies',
        'expectedYield': 'Varies by region',
        'stages': [
            {'title': 'Sowing', 'care': 'Prepare field and sow seeds at appropriate depth.'},
            {'title': 'Vegetative', 'care': 'Ensure proper nutrition and weed control.'},
            {'title': 'Flowering', 'care': 'Monitor water requirements and pest pressure.'},
            {'title': 'Maturity', 'care': 'Plan for timely harvest and post-harvest storage.'}
        ]
    }

    result = ADVISORIES.get(crop, default_advisory).copy()
    result['crop'] = crop
    return jsonify(result), 200

@advisory_bp.route('/search', methods=['GET'])
@token_required
def search_advisory():
    """
    Search for a crop advisory using manual MergeSort and Binary Search.
    """
    query = request.args.get('q', '').strip().title()
    if not query:
        return jsonify({'message': 'Query required'}), 400
        
    crops = ['Wheat', 'Rice', 'Cotton', 'Sugarcane', 'Maize', 'Corn']
    data = []
    
    # Simulate data fetching for all crops
    for c in crops:
        data.append({'crop': c})
        
    # DSA INTEGRATION: Stable MergeSort
    sorted_data = merge_sort(data, key=lambda x: x['crop'])
    
    # DSA INTEGRATION: Binary Search
    matches = binary_search(sorted_data, query, key=lambda x: x['crop'])
    
    if matches:
        # Return the full advisories for the matched crops
        results = []
        for m in matches:
            advisory = ADVISORIES.get(m['crop'], {}).copy()
            advisory['crop'] = m['crop']
            results.append(advisory)
        return jsonify(results), 200
        
    return jsonify({'message': 'Advisory not found'}), 404
