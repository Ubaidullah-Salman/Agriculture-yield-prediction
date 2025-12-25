import os
import joblib
from config import Config
from ml_models.crop_yield_model import CropYieldModel
from ml_models.crop_recommendation_model import CropRecommendationModel
from ml_models.pest_disease_model import PestDiseaseModel

class ModelLoader:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance.yield_model = CropYieldModel()
            cls._instance.recommend_model = CropRecommendationModel()
            cls._instance.pest_model = PestDiseaseModel()
            cls._instance.yield_scaler = None
            cls._instance.recommend_scaler = None
            cls._instance.recommend_encoder = None
            cls._instance._load_all()
        return cls._instance

    def _load_all(self):
        yield_model_path = os.path.join(Config.MODEL_PATH, 'crop_yeild_prediction.joblib')
        yield_scaler_path = os.path.join(Config.MODEL_PATH, 'crop_yeild_scaler.joblib')
        
        recommend_model_path = os.path.join(Config.MODEL_PATH, 'crop_recomend_model.joblib')
        recommend_scaler_path = os.path.join(Config.MODEL_PATH, 'crop_recomend_minmax_scaler.joblib')
        recommend_encoder_path = os.path.join(Config.MODEL_PATH, 'crop_recomend_label_encoder.joblib')
        
        # Load Yield Model
        if not self.yield_model.load(yield_model_path):
            print(f"Warning: Yield model not found at {yield_model_path}")

        # Load Yield Scaler
        if os.path.exists(yield_scaler_path):
            self.yield_scaler = joblib.load(yield_scaler_path)
            print("Yield scaler loaded successfully.")
        
        # Load Recommendation Model
        if not self.recommend_model.load(recommend_model_path):
            print(f"Warning: Recommendation model not found at {recommend_model_path}")
            
        # Load Recommendation Scaler
        if os.path.exists(recommend_scaler_path):
            self.recommend_scaler = joblib.load(recommend_scaler_path)
            print("Recommendation scaler loaded successfully.")

        # Load Recommendation Encoder
        if os.path.exists(recommend_encoder_path):
            self.recommend_encoder = joblib.load(recommend_encoder_path)
            print("Recommendation encoder loaded successfully.")

    # Helper method to predict easily
    def predict_yield(self, input_data: dict):
        return self.yield_model.predict(input_data, self.yield_scaler)
        
    def predict_recommendation(self, input_data: dict):
        return self.recommend_model.predict(input_data, self.recommend_scaler, self.recommend_encoder)

    def predict_pest(self, image_path: str):
        return self.pest_model.predict(image_path)
