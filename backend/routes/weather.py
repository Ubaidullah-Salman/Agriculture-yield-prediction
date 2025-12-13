from flask import Blueprint, request, jsonify
from services.weather_service import WeatherService
from middleware.auth_middleware import token_required

weather_bp = Blueprint('weather', __name__)
service = WeatherService()

@weather_bp.route('/current', methods=['GET'])
@token_required
def current_weather():
    location = request.args.get('location', 'New Delhi')
    data = service.get_current_weather(location)
    return jsonify(data), 200

@weather_bp.route('/forecast', methods=['GET'])
@token_required
def forecast():
    location = request.args.get('location', 'New Delhi')
    data = service.get_forecast(location)
    return jsonify(data), 200

@weather_bp.route('/alerts', methods=['GET'])
@token_required
def alerts():
    # Mock alerts
    return jsonify([
        {
            'id': '1', 'type': 'weather', 'severity': 'high',
            'title': 'Heavy Rain', 'message': 'Heavy rain expected tomorrow.'
        }
    ]), 200
