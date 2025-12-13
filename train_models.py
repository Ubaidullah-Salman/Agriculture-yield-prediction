import os
import sys

# Add current directory to path so we can import config
sys.path.append(os.getcwd())

from backend.config import Config
from backend.ml_models.crop_yield_model import CropYieldModel
from backend.ml_models.crop_price_model import CropPriceModel
from backend.ml_models.pest_disease_model import PestDiseaseModel

def train_all():
    print("Initializing and training models with real data...")
    
    # Ensure model directory exists
    os.makedirs(Config.MODEL_PATH, exist_ok=True)
    
    # 1. Crop Yield Model
    print("\n--- Training Crop Yield Model ---")
    yield_model = CropYieldModel()
    # Path relative to project root
    yield_model.train(data_path='backend/data/yield_data.csv')
    yield_model.save(os.path.join(Config.MODEL_PATH, 'yield_model.pkl'))
    print("Crop Yield Model saved.")
    
    # 2. Crop Price Model
    print("\n--- Initializing Crop Price Model ---")
    price_model = CropPriceModel()
    # It loads data in init from backend/data/price_data.csv
    price_model.save(os.path.join(Config.MODEL_PATH, 'price_model.pkl'))
    print("Crop Price Model saved.")
    
    # 3. Pest Disease Model
    print("\n--- Initializing Pest Disease Model ---")
    pest_model = PestDiseaseModel()
    # We don't have real image data for training, so we just save the base structure
    # In a real scenario, we would call pest_model.build_model() and train
    pest_model.save(os.path.join(Config.MODEL_PATH, 'pest_model.h5'))
    print("Pest Disease Model saved (placeholder).")
    
    print("\nAll models updated successfully!")

if __name__ == "__main__":
    train_all()
