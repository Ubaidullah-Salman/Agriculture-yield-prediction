import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    # Flask settings
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-prod')
    DEBUG = os.getenv('FLASK_DEBUG', 'True') == 'True'
    
    # Database settings
    # Using the exact connection URL found in your .env
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', 'mysql+mysqlconnector://agri_user:22998833@localhost/agri_db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # JWT settings
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'jwt-secret-key-change-in-prod')
    JWT_ACCESS_TOKEN_EXPIRES = 86400  # 24 hours
    
    # File Upload settings
    UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'uploads')
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB max upload size
    
    # External APIs
    OPENWEATHER_API_KEY = os.getenv('OPENWEATHER_API_KEY', '')
    
    # ML Models paths
    MODEL_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'ml_models', 'models')

# Create necessary directories
os.makedirs(Config.UPLOAD_FOLDER, exist_ok=True)
os.makedirs(Config.MODEL_PATH, exist_ok=True)



