import numpy as np
import pandas as pd
from sklearn.ensemble import GradientBoostingRegressor
import joblib
import os

class CropPriceModel:
    def __init__(self):
        self.model = GradientBoostingRegressor(n_estimators=100)
        self.market_prices = {}
        self._load_market_prices()
        
    def _load_market_prices(self):
        data_path = 'backend/data/price_data.csv'
        if os.path.exists(data_path):
            print(f"Loading real price data from {data_path}...")
            try:
                df = pd.read_csv(data_path)
                # Calculate average retail price per crop
                avg_prices = df.groupby('Crop')['Retail_Price'].mean().to_dict()
                # Normalize keys to lowercase
                self.market_prices = {k.lower(): v for k, v in avg_prices.items()}
            except Exception as e:
                print(f"Error loading price data: {e}")
                self._load_default_prices()
        else:
            print("Real price data not found, using defaults...")
            self._load_default_prices()
            
    def _load_default_prices(self):
        self.market_prices = {
            'wheat': 2400,
            'rice': 3000,
            'corn': 2000,
            'cotton': 6000,
            'soybean': 4000,
            'sugarcane': 350
        }
        
    def analyze_quality(self, image_path):
        # In a real scenario, this would use CV to analyze the grain image
        # For now, we mock the image analysis part
        import random
        return {
            'moisture': round(random.uniform(10, 16), 1),
            'impurities': round(random.uniform(0.5, 5.0), 1),
            'grain_size': random.choice(['Small', 'Medium', 'Large']),
            'color_quality': random.choice(['Fair', 'Good', 'Excellent']),
            'quality_score': random.randint(60, 95)
        }

    def predict_price(self, crop_type, quality_data):
        base_price = self.market_prices.get(crop_type.lower(), 2000)
        
        # Simple heuristic logic (replace with trained regression model if data available)
        quality_factor = quality_data['quality_score'] / 100.0
        
        # Moisture penalty
        moisture_penalty = 0
        if quality_data['moisture'] > 14:
            moisture_penalty = (quality_data['moisture'] - 14) * 20
            
        # Impurity penalty
        impurity_penalty = quality_data['impurities'] * 15
        
        predicted_price = base_price * quality_factor - moisture_penalty - impurity_penalty
        
        return {
            'predicted_price': round(max(predicted_price, base_price * 0.7), 2),
            'market_price': base_price,
            'price_difference': round(predicted_price - base_price, 2),
            'confidence': 85 + int(quality_data['quality_score'] / 10)
        }

    def save(self, filepath):
        # Save heuristics or regression weights
        joblib.dump(self.market_prices, filepath)

    def load(self, filepath):
        if os.path.exists(filepath):
            self.market_prices = joblib.load(filepath)
            return True
        return False
