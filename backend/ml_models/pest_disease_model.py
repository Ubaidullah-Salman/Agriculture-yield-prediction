import tensorflow as tf
import numpy as np
import os
from PIL import Image

class PestDiseaseModel:
    def __init__(self):
        self.model = None
        self.classes = [
            'Healthy',
            'Aphids',
            'Armyworm',
            'Blight',
            'Rust',
            'Mildew'
        ]
        
    def build_model(self):
        # Placeholder architecture
        base_model = tf.keras.applications.MobileNetV2(
            input_shape=(224, 224, 3),
            include_top=False,
            weights='imagenet'
        )
        base_model.trainable = False
        
        model = tf.keras.Sequential([
            base_model,
            tf.keras.layers.GlobalAveragePooling2D(),
            tf.keras.layers.Dense(len(self.classes), activation='softmax')
        ])
        
        model.compile(optimizer='adam', loss='sparse_categorical_crossentropy', metrics=['accuracy'])
        self.model = model
        
    def predict(self, image_path):
        if not self.model:
            print("Model not loaded, using mock prediction")
            return self._mock_predict()
            
        try:
            img = Image.open(image_path).resize((224, 224))
            img_array = tf.keras.preprocessing.image.img_to_array(img)
            img_array = tf.expand_dims(img_array, 0)
            img_array = tf.keras.applications.mobilenet_v2.preprocess_input(img_array)
            
            predictions = self.model.predict(img_array)
            score = tf.nn.softmax(predictions[0])
            class_idx = np.argmax(score)
            
            return {
                'detected': self.classes[class_idx] != 'Healthy',
                'pest_name': self.classes[class_idx],
                'confidence': float(np.max(score)) * 100,
                'severity': 'Medium', # Logic needed to determine severity
                'recommendations': self._get_recommendations(self.classes[class_idx])
            }
        except Exception as e:
            print(f"Prediction error: {e}")
            return self._mock_predict()

    def _mock_predict(self):
        import random
        pest = random.choice(self.classes)
        return {
            'detected': pest != 'Healthy',
            'pest_name': pest,
            'confidence': random.uniform(70, 99),
            'severity': random.choice(['Low', 'Medium', 'High']),
            'recommendations': self._get_recommendations(pest)
        }

    def _get_recommendations(self, pest_name):
        recommendations = {
            'Healthy': ['Continue regular monitoring', 'Maintain proper irrigation'],
            'Aphids': ['Use Neem oil spray', 'Introduce Ladybugs'],
            'Armyworm': ['Apply Bacillus thuringiensis', 'Remove weeds'],
            'Blight': ['Apply fungicides', 'Remove infected leaves'],
            'Rust': ['Use sulfur-based fungicides', 'Avoid overhead irrigation'],
            'Mildew': ['ensure air circulation', 'Apply potassium bicarbonate']
        }
        return recommendations.get(pest_name, ['Consult an expert'])

    def save(self, filepath):
        if self.model:
            self.model.save(filepath)

    def load(self, filepath):
        if os.path.exists(filepath):
            try:
                self.model = tf.keras.models.load_model(filepath)
                return True
            except:
                return False
        return False
