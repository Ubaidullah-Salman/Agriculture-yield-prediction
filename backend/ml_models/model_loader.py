from .crop_yield_model import CropYieldModel
from .crop_price_model import CropPriceModel
from .pest_disease_model import PestDiseaseModel
import os
from config import Config

class ModelLoader:
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(ModelLoader, cls).__new__(cls)
            cls._instance.yield_model = CropYieldModel()
            cls._instance.price_model = CropPriceModel()
            cls._instance.pest_model = PestDiseaseModel()
            cls._instance._load_all()
        return cls._instance
    
    def _load_all(self):
        # Try to load saved models, otherwise mock/train on fly
        yield_path = os.path.join(Config.MODEL_PATH, 'yield_model.joblib')
        price_path = os.path.join(Config.MODEL_PATH, 'price_model.joblib')
        pest_path = os.path.join(Config.MODEL_PATH, 'pest_model.h5')
        
        if not self.yield_model.load(yield_path):
            print("Yield model not found, initializing fresh/dummy...")
            self.yield_model.train() # Train on dummy data
            self.yield_model.save(yield_path)
            
        self.price_model.load(price_path) # Price model uses heuristics if load fails
        self.pest_model.load(pest_path)   # Pest model uses mocks if load fails or uses None
