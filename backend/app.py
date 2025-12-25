from flask import Flask, jsonify, send_from_directory, request
from flask_cors import CORS
from config import Config
from models import db, init_db
import os

# Import Blueprints
from routes.auth import auth_bp
from routes.users import users_bp
from routes.farm import farm_bp
from routes.predictions import predictions_bp
from routes.weather import weather_bp
from routes.admin import admin_bp
from routes.market import market_bp, advisory_bp

app = Flask(__name__)
app.config.from_object(Config)

# Enable CORS (allow all origins for dev, restrict in prod)
CORS(app)

# Initialize Database
db.init_app(app)

# Register Blueprints
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(users_bp, url_prefix='/api/users')
app.register_blueprint(farm_bp, url_prefix='/api/farms')

# Predictions Blueprint with aliases to match Frontend
app.register_blueprint(predictions_bp, url_prefix='/api/predict') # serve /yield
app.register_blueprint(predictions_bp, url_prefix='/api/detect', name='detect_bp')  # serve /pest
app.register_blueprint(predictions_bp, url_prefix='/api/crop', name='crop_bp')    # serve /price

app.register_blueprint(weather_bp, url_prefix='/api/weather')
app.register_blueprint(admin_bp, url_prefix='/api/admin')
app.register_blueprint(market_bp, url_prefix='/api/market')
# app.register_blueprint(market_bp, url_prefix='/api/market') # Removed duplicate
app.register_blueprint(advisory_bp, url_prefix='/api/advisory')

# --- DEBUGGING LOGGING ---
import logging
import traceback

# Setup basic file logging
logging.basicConfig(filename='app_debug.log', level=logging.DEBUG, 
                    format='%(asctime)s %(levelname)s: %(message)s')

@app.before_request
def log_request_info():
    logging.info(f"Requests: {request.method} {request.url}")
    # Be careful logging body if large, but for now we need it
    try:
        if request.is_json:
            logging.info(f"Body: {request.get_json()}")
        elif request.files:
            logging.info(f"Files: {request.files}")
    except:
        pass

@app.errorhandler(Exception)
def handle_exception(e):
    # Pass through HTTP errors
    if isinstance(e,  (int, str)): 
         return jsonify({"error": str(e)}), 500
         
    logging.error(f"Unhandled Exception: {str(e)}")
    logging.error(traceback.format_exc())
    return jsonify({
        "message": "Internal Server Error",
        "error": str(e),
        "trace": traceback.format_exc()
    }), 500
# -------------------------


@app.route('/health')
def health_check():
    return jsonify({'status': 'healthy'}), 200

@app.route('/api/init-db')
def initialize_database():
    try:
        init_db(app)
        return jsonify({'message': 'Database initialized successfully'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Serve uploaded files (for images)
@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)
@app.route('/')
def home():
    return jsonify({
        "message": "Agriculture Yield Prediction API is running.",
        "endpoints": [
            "/api/auth",
            "/api/users",
            "/api/farms",
            "/api/predict",
            "/api/weather",
            "/api/admin",
            "/api/market",
            "/api/advisory"
        ]
    })



if __name__ == '__main__':
    # Auto-create tables if they don't exist (for dev convenience)
    with app.app_context():
        # Create upload folder
        os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
        try:
            db.create_all()
            print("Database tables created.")
            init_db(app) # Create admin if needed
        except Exception as e:
            print(f"DB Connect Error (expected if no DB server): {e}")
            
    app.run(host='0.0.0.0', port=5000)