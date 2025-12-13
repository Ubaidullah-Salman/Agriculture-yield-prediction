import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler
import joblib
import os

class CropYieldModel:
    def __init__(self):
        self.model = RandomForestRegressor(n_estimators=100, random_state=42)
        self.scaler = StandardScaler()
        self.label_encoders = {}
        self.feature_columns = [
            'crop_name', 'soil_type', 'location', 'land_size', 
            'fertilizer_usage', 'irrigation_type', 'rainfall', 
            'temperature', 'nitrogen', 'phosphorus', 'potassium', 'ph'
        ]
        self.categorical_cols = ['crop_name', 'soil_type', 'location', 'irrigation_type']
        
    def preprocess(self, data, training=False):
        # Convert dictionary to DataFrame
        df = pd.DataFrame([data]) if isinstance(data, dict) else data.copy()
        
        # Handle categorical variables
        for col in self.categorical_cols:
            if training:
                le = LabelEncoder()
                df[col] = le.fit_transform(df[col])
                self.label_encoders[col] = le
            else:
                if col in self.label_encoders:
                    # Handle unseen labels by assigning a default or trying to map
                    le = self.label_encoders[col]
                    # Simple fallback logic for demonstration
                    df[col] = df[col].apply(lambda x: le.transform([x])[0] if x in le.classes_ else 0)
        
        return df[self.feature_columns]

    def train(self, data_path='backend/data/yield_data.csv'):
        # Load data from CSV
        if os.path.exists(data_path):
            print(f"Loading real training data from {data_path}...")
            data = pd.read_csv(data_path)
            
            # Map CSV columns to model features
            # We'll augment the real data with synthetic features for those missing in the simple CSV
            # to maintain compatibility with the frontend inputs
            
            # Rename columns to match model expectations
            data = data.rename(columns={
                'Crop': 'crop_name',
                'Province': 'location',
                'Area': 'land_size',
                'Annual_Rainfall': 'rainfall',
                'Fertilizer': 'fertilizer_usage',
                'Yield': 'yield_per_acre' # Assuming Yield column is per unit area or we calculate it
            })
            
            # Calculate yield per acre if 'Production' and 'Area' exist
            if 'Production' in data.columns and 'land_size' in data.columns:
                 data['yield_per_acre'] = data['Production'] / data['land_size']
            
            # Fill missing features with realistic random values based on crop
            n_samples = len(data)
            soils = ['Loamy', 'Clay', 'Sandy', 'Black Soil', 'Red Soil']
            irrigations = ['Drip', 'Sprinkler', 'Flood']
            
            if 'soil_type' not in data.columns:
                data['soil_type'] = np.random.choice(soils, n_samples)
            if 'irrigation_type' not in data.columns:
                data['irrigation_type'] = np.random.choice(irrigations, n_samples)
            if 'temperature' not in data.columns:
                data['temperature'] = np.random.uniform(20, 35, n_samples)
            if 'nitrogen' not in data.columns:
                data['nitrogen'] = np.random.uniform(50, 200, n_samples)
            if 'phosphorus' not in data.columns:
                data['phosphorus'] = np.random.uniform(20, 100, n_samples)
            if 'potassium' not in data.columns:
                data['potassium'] = np.random.uniform(50, 200, n_samples)
            if 'ph' not in data.columns:
                data['ph'] = np.random.uniform(5.5, 8.5, n_samples)
                
        else:
            print("Real data not found, generating dummy data...")
            data = self._generate_dummy_data()
            
        X = self.preprocess(data, training=True)
        y = data['yield_per_acre']
        
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        self.model.fit(X_train, y_train)
        print(f"Yield Model trained on {len(data)} records. Score: {self.model.score(X_test, y_test)}")
        
    def predict(self, input_data):
        # input_data is a dictionary
        X = self.preprocess(input_data)
        prediction = self.model.predict(X)
        return float(prediction[0])
        
    def save(self, filepath):
        joblib.dump({
            'model': self.model,
            'label_encoders': self.label_encoders
        }, filepath)
        
    def load(self, filepath):
        if os.path.exists(filepath):
            artifacts = joblib.load(filepath)
            self.model = artifacts['model']
            self.label_encoders = artifacts['label_encoders']
            return True
        return False

    def _generate_dummy_data(self, n_samples=1000):
        # Fallback logic
        crops = ['Wheat', 'Rice', 'Cotton', 'Maize', 'Sugarcane']
        soils = ['Loamy', 'Clay', 'Sandy', 'Black Soil', 'Red Soil']
        locations = ['Punjab', 'Sindh', 'KPK', 'Balochistan']
        irrigations = ['Drip', 'Sprinkler', 'Flood']
        
        data = {
            'crop_name': np.random.choice(crops, n_samples),
            'soil_type': np.random.choice(soils, n_samples),
            'location': np.random.choice(locations, n_samples),
            'irrigation_type': np.random.choice(irrigations, n_samples),
            'land_size': np.random.uniform(1, 50, n_samples),
            'fertilizer_usage': np.random.uniform(50, 200, n_samples),
            'rainfall': np.random.uniform(500, 1200, n_samples),
            'temperature': np.random.uniform(20, 35, n_samples),
            'nitrogen': np.random.uniform(50, 200, n_samples),
            'phosphorus': np.random.uniform(20, 100, n_samples),
            'potassium': np.random.uniform(50, 200, n_samples),
            'ph': np.random.uniform(5.5, 8.5, n_samples),
        }
        
        # Simple formula for yield relation to make model learn something
        y = (
            data['nitrogen'] * 0.5 + 
            data['phosphorus'] * 0.3 + 
            data['rainfall'] * 0.2 + 
            np.random.normal(0, 50, n_samples)
        )
        data['yield_per_acre'] = y + 2000 # Base yield
        
        return pd.DataFrame(data)
