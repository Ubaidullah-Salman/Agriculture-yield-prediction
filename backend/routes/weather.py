from flask import Blueprint, request, jsonify
from services.weather_service import WeatherService
from middleware.auth_middleware import token_required

weather_bp = Blueprint('weather', __name__)
service = WeatherService()

@weather_bp.route('/current', methods=['GET'])
@token_required
def current_weather():
    from flask import g
    default_city = getattr(g.current_user, 'city', 'Multan') or 'Multan'
    location = request.args.get('location', default_city)
    data = service.get_current_weather(location)
    return jsonify(data), 200

@weather_bp.route('/forecast', methods=['GET'])
@token_required
def forecast():
    from flask import g
    default_city = getattr(g.current_user, 'city', 'Multan') or 'Multan'
    location = request.args.get('location', default_city)
    data = service.get_forecast(location)
    return jsonify(data), 200

@weather_bp.route('/alerts', methods=['GET'])
@token_required
def alerts():
    from flask import g
    from utils.notification_helper import process_weather_alerts
    default_city = getattr(g.current_user, 'city', 'Multan') or 'Multan'
    location = request.args.get('location', default_city)
    data = service.get_advisories(location)
    process_weather_alerts(g.current_user.id, data.get('alerts', []))
    return jsonify(data), 200

@weather_bp.route('/all', methods=['GET'])
@token_required
def all_weather_data():
    from flask import g
    from utils.notification_helper import process_weather_alerts
    default_city = getattr(g.current_user, 'city', 'Multan') or 'Multan'
    location = request.args.get('location', default_city)
    
    # Fetch all data in parallel or sequence
    current = service.get_current_weather(location)
    forecast = service.get_forecast(location)
    advisories = service.get_advisories(location)
    
    process_weather_alerts(g.current_user.id, advisories.get('alerts', []))
    
    return jsonify({
        'current': current,
        'forecast': forecast,
        'advisories': advisories
    }), 200
