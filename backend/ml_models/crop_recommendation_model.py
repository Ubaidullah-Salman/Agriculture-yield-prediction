import os
import joblib
import pandas as pd
import numpy as np

class CropRecommendationModel:
    # Feature order as per notebook training:
    # N, P, K, temperature, humidity, ph, rainfall, district
    selected_features = [
        'N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall', 'district'
    ]

    # Reconstructed District Frequencies from notebook value_counts()
    # Values represent normalize=True (count / 2200)
    DISTRICT_MAP = {
        'gujrat': 176/2200, 'jhang': 110/2200, 'bakar': 99/2200,
        'sialkot': 88/2200, 'khanewal': 77/2200, 'narowall': 77/2200,
        'multan': 77/2200, 'lodhran': 77/2200, 'faisalabad': 66/2200,
        'sahiwal': 66/2200, 'mianwali': 66/2200, 'nankana sahib': 66/2200,
        'layyah': 66/2200, 'bahawalnagar': 66/2200, 'lahore': 66/2200,
        'hafizabad': 66/2200, 'shekupora': 66/2200, 'pakpatan': 66/2200,
        'vihari': 66/2200, 'gujranwala': 66/2200, 'rajanpur': 55/2200,
        'okara': 55/2200, 'kasur': 55/2200, 'm.b.din': 44/2200,
        'ryk': 44/2200, 'digikhan': 33/2200, 'm.garh': 33/2200,
        'd.g.khan': 33/2200, 'chainiot': 33/2200, 'muzafargarh': 33/2200,
        'tobataiksingh': 33/2200, 'bwp': 22/2200, 'attock': 22/2200,
        'rawalpindi': 22/2200, 'isl': 22/2200, 'sarjodha': 22/2200,
        'chakwall': 22/2200, 'jehlum': 22/2200, 'khushab': 22/2200
    }

    def __init__(self):
        self.model = None

    def load(self, path):
        if os.path.exists(path):
            self.model = joblib.load(path)
            print(f"Recommendation model loaded successfully from {path}")
            return True
        return False

    def preprocess(self, input_data, scaler):
        """
        input_data expected keys:
        - N (int/float)
        - P (int/float)
        - K (int/float)
        - temperature (float)
        - humidity (float)
        - ph (float)
        - rainfall (float)
        - district (string)
        """
        if scaler is None:
            raise ValueError("Scaler not loaded")
        
        # Create DataFrame
        df = pd.DataFrame([input_data])
        
        # 1. District Frequency Encoding
        dist = input_data.get('district', '').lower().strip()
        df['district'] = self.DISTRICT_MAP.get(dist, 0.0)

        # 2. Scaling
        scale_cols = ['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']
        df[scale_cols] = scaler.transform(df[scale_cols])

        # Ensure correct column order
        df = df[self.selected_features]
        return df

    def predict(self, input_data, scaler, label_encoder):
        if self.model is None:
            raise ValueError("Model not loaded")
        if label_encoder is None:
            raise ValueError("Label Encoder not loaded")
            
        df = self.preprocess(input_data, scaler)
        pred_numeric = self.model.predict(df)[0]
        
        # Inverse transform to get crop name
        crop_name = label_encoder.inverse_transform([pred_numeric])[0]
        return crop_name
