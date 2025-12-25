import pandas as pd
import joblib
import os

class CropYieldModel:
    # Feature order as per notebook training
    selected_features = [
        'District', 'Year', 'avg_rainfall', 'avg_temperature',
        'Crop_Cotton', 'Crop_Maize', 'Crop_Rice', 'Crop_Sugarcane', 'Crop_Wheat',
        'soil_quality_Good', 'soil_quality_Moderate', 'soil_quality_Poor'
    ]

    # Reconstructed District Frequencies from notebook value_counts()
    # Values represent normalize=True (count / 5568)
    DISTRICT_MAP = {
        'Jhelum': 192/5568, 'Sargodha': 192/5568, 'Khushab': 192/5568,
        'Faisalabad': 192/5568, 'Mianwali': 192/5568, 'M.B.Din': 192/5568,
        'Jhang': 192/5568, 'Bahawalpur': 160/5568, 'Bhakkar': 160/5568,
        'T.T. Singh': 160/5568, 'Sheikhupura': 160/5568, 'Kasur': 160/5568,
        'Okara': 160/5568, 'Sahiwal': 160/5568, 'Pakpattan': 160/5568,
        'Multan': 160/5568, 'Lodhran': 160/5568, 'Khanewal': 160/5568,
        'Vehari': 160/5568, 'Muzaffargarh': 160/5568, 'Layyah': 160/5568,
        'D.G.khan': 160/5568, 'Rajanpur': 160/5568, 'Narowal': 160/5568,
        'Bahawalnagar': 160/5568, 'Gujrat': 160/5568, 'Sialkot': 160/5568,
        'Hafizabad': 128/5568, 'Attock': 128/5568, 'Gujranwala': 128/5568,
        'R.Y.Khan': 128/5568, 'Lahore': 128/5568, 'Rawalpindi': 96/5568,
        'Cahkwal': 64/5568, 'Islamabad': 64/5568, 'Chakwal': 64/5568,
        'T.T.Singh': 32/5568, 'Nankana Sahib': 32/5568, 'Rahim Yar Khan': 32/5568
    }

    def __init__(self):
        self.model = None

    def load(self, path):
        if os.path.exists(path):
            self.model = joblib.load(path)
            print(f"Yield model loaded successfully from {path}")
            return True
        return False

    def preprocess(self, input_data, scaler):
        """
        input_data expected keys:
        - District (string)
        - Year (int/string)
        - avg_rainfall (float)
        - avg_temperature (float)
        - Crop (string: Cotton, Maize, Rice, Sugarcane, Wheat)
        - soil_quality (string: Good, Moderate, Poor)
        """
        if scaler is None:
            raise ValueError("Scaler not loaded")
        
        # Create DataFrame
        df = pd.DataFrame([input_data])
        
        # 1. Year as int (if provided as string like '1990-91')
        if isinstance(df['Year'].iloc[0], str) and '-' in df['Year'].iloc[0]:
            df['Year'] = df['Year'].str.split('-').str[0].astype(int)
        else:
            df['Year'] = df['Year'].astype(int)

        # 2. District Frequency Encoding
        district = df['District'].iloc[0]
        df['District'] = self.DISTRICT_MAP.get(district, 0.0)

        # 3. Scaling (Rainfall and Temperature)
        scale_cols = ['avg_rainfall', 'avg_temperature']
        df[scale_cols] = scaler.transform(df[scale_cols])

        # 4. One-Hot Encoding (Manual for consistency with notebook head())
        crops = ['Cotton', 'Maize', 'Rice', 'Sugarcane', 'Wheat']
        for crop in crops:
            df[f'Crop_{crop}'] = 1.0 if input_data.get('Crop') == crop else 0.0
            
        qualities = ['Good', 'Moderate', 'Poor']
        for q in qualities:
            df[f'soil_quality_{q}'] = 1.0 if input_data.get('soil_quality') == q else 0.0

        # Ensure all columns present and in order
        for col in self.selected_features:
            if col not in df.columns:
                df[col] = 0.0
        
        df = df[self.selected_features]
        return df

    def predict(self, input_data, scaler):
        if self.model is None:
            raise ValueError("Model not loaded")
        df = self.preprocess(input_data, scaler)
        return self.model.predict(df)[0]
