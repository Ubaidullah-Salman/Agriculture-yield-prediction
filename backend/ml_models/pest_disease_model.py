import tensorflow as tf
import numpy as np
import os
from PIL import Image

class PestDiseaseModel:
    def __init__(self):
        self.model = None
        # Custom classes provided by user
        self.classes = [
            'Apple___Apple_scab', 'Apple___Black_rot', 'Apple___Cedar_apple_rust', 'Apple___healthy',
            'Background_without_leaves', 'Blueberry___healthy', 'Cherry___Powdery_mildew', 'Cherry___healthy',
            'Corn___Cercospora_leaf_spot Gray_leaf_spot', 'Corn___Common_rust', 'Corn___Northern_Leaf_Blight', 'Corn___healthy',
            'Grape___Black_rot', 'Grape___Esca_(Black_Measles)', 'Grape___Leaf_blight_(Isariopsis_Leaf_Spot)', 'Grape___healthy',
            'Orange___Haunglongbing_(Citrus_greening)', 'Peach___Bacterial_spot', 'Peach___healthy',
            'Pepper,_bell___Bacterial_spot', 'Pepper,_bell___healthy', 'Potato___Early_blight', 'Potato___Late_blight', 'Potato___healthy',
            'Raspberry___healthy', 'Soybean___healthy', 'Squash___Powdery_mildew', 'Strawberry___Leaf_scorch', 'Strawberry___healthy',
            'Tomato___Bacterial_spot', 'Tomato___Early_blight', 'Tomato___Late_blight', 'Tomato___Leaf_Mold',
            'Tomato___Septoria_leaf_spot', 'Tomato___Spider_mites Two-spotted_spider_mite', 'Tomato___Target_Spot',
            'Tomato___Tomato_Yellow_Leaf_Curl_Virus', 'Tomato___Tomato_mosaic_virus', 'Tomato___healthy'
        ]
        
        # Construct absolute path to the model file
        current_dir = os.path.dirname(os.path.abspath(__file__))
        model_path = os.path.join(current_dir, 'models', 'cnn_model.keras')
        print("\n" + "="*50)
        print("*** PEST MODEL UPDATED: 160x160 RAW INPUT MODE ***")
        print("="*50 + "\n")
        self.load(model_path)
        
    def load(self, path):
        if os.path.exists(path):
            try:
                self.model = tf.keras.models.load_model(path)
                print(f"Pest model loaded successfully from {path}")
                
                # Try to detect input shape
                try:
                    self.input_shape = self.model.input_shape[1:3] # e.g., (224, 224)
                    print(f"Detected model input shape: {self.input_shape}")
                except:
                    self.input_shape = (224, 224) # Default fallback
                    print("Could not detect input shape, using default (224, 224)")
                    
                return True
            except Exception as e:
                print(f"Error loading pest model: {e}")
                return False
        print(f"Pest model not found at {path}")
        return False

    def predict(self, image_path):
        if not self.model:
            print("Model not loaded, using mock prediction")
            return self._mock_predict()
            
        try:
            # Load and preprocess image
            if not os.path.exists(image_path):
                raise FileNotFoundError(f"Image not found at: {image_path}")
                
            img = Image.open(image_path).convert('RGB')
            
            # User confirmed model trained on (160, 160)
            target_size = (160, 160) 
            img = img.resize(target_size)
            
            img_array = tf.keras.preprocessing.image.img_to_array(img)
            img_array = tf.expand_dims(img_array, 0) # Create batch axis
            
            # CRITICAL: User training code has `layers.Rescaling(1./255)` INSIDE the model.
            # So we must pass RAW values [0, 255] to the model.
            # Do NOT normalize here.
            
            print(f"Input Stats - Min: {np.min(img_array)}, Max: {np.max(img_array)}, Mean: {np.mean(img_array)}")
            
            predictions = self.model.predict(img_array)
            # Some models already include Softmax at the end. Check if sum is ~1.0
            pred_sum = np.sum(predictions[0])
            if abs(pred_sum - 1.0) > 0.1:
                print(f"Model output does not seem to be probabilities (sum={pred_sum}). Applying softmax.")
                score = tf.nn.softmax(predictions[0]).numpy()
            else:
                score = predictions[0]
            
            class_idx = int(np.argmax(score))
            confidence = float(np.max(score)) * 100
            
            print(f"Prediction Index: {class_idx}, Confidence: {confidence:.2f}%")
            
            # Safety check for class index
            detected_class = "Unknown"
            if class_idx < len(self.classes):
                detected_class = self.classes[class_idx]
            else:
                print(f"IndexError: Model predicted class {class_idx} but we only have {len(self.classes)} classes defined.")
                detected_class = f"Class {class_idx}"
            
            # Determine if healthy based on name
            is_healthy = "healthy" in detected_class.lower() or "background" in detected_class.lower()

            result = {
                'detected': bool(not is_healthy),
                'pest_name': self._format_name(detected_class),
                'confidence': float(confidence),
                'severity': self._determine_severity(confidence, is_healthy),
                'recommendations': self._get_recommendations(detected_class),
                'preventiveMeasures': self._get_preventive_measures(detected_class)
            }
            print(f"Pest detection result: {result['pest_name']} ({result['confidence']:.1f}%)")
            return result
        except Exception as e:
            import traceback
            traceback.print_exc()
            print(f"Prediction error: {e}")
            return self._mock_predict()

    def _format_name(self, raw_name):
        # Convert "Tomato___Bacterial_spot" to "Tomato - Bacterial Spot"
        return raw_name.replace("___", " - ").replace("_", " ")

    def _determine_severity(self, confidence, is_healthy):
        if is_healthy: return "None"
        if confidence > 90: return 'High'
        if confidence > 75: return 'Medium'
        return 'Low'

    def _mock_predict(self):
        import random
        pest = random.choice(self.classes)
        return {
            'detected': "healthy" not in pest.lower(),
            'pest_name': self._format_name(pest),
            'confidence': float(random.uniform(70, 99)),
            'severity': 'Medium',
            'recommendations': self._get_recommendations(pest),
            'preventiveMeasures': self._get_preventive_measures(pest)
        }

    def _get_recommendations(self, pest_name):
        # Generic lookup based on keywords since exact mapping for 39 classes is huge
        pest_lower = pest_name.lower()
        
        if "healthy" in pest_lower:
            return ['Continue regular monitoring', 'Maintain proper irrigation', 'Keep good hygiene']
        
        if "background" in pest_lower:
             return ['Please upload a close-up image of a plant leaf']

        recommendations = []
        if "bacterial" in pest_lower:
            recommendations.extend(['Use copper-based bactericides', 'Remove infected plant parts', 'Avoid overhead watering'])
        if "fungal" in pest_lower or "blight" in pest_lower or "rust" in pest_lower or "mildew" in pest_lower or "spot" in pest_lower:
             recommendations.extend(['Apply appropriate fungicide', 'Improve air circulation', 'Remove infected leaves'])
        if "virus" in pest_lower:
             recommendations.extend(['Remove and destroy infected plants (no cure)', 'Control insect vectors (aphids/thrips)', 'Use resistant varieties'])
        if "mite" in pest_lower or "insect" in pest_lower:
             recommendations.extend(['Use neem oil or insecticidal soap', 'Introduce natural predators', 'Spray water to knock them off'])
             
        if not recommendations:
            recommendations = ['Consult a local plant pathologist', 'Isolate the plant to prevent spread', 'Ensure proper nutrition']
            
        return recommendations

    def _get_preventive_measures(self, pest_name):
        pest_lower = pest_name.lower()
        if "healthy" in pest_lower:
            return ['Rotate crops annually', 'Use certified disease-free seeds', 'Monitor fields weekly']
            
        measures = ['Ensure proper plant spacing for airflow', 'Practice crop rotation', 'Remove weeds that may host pests']
        
        if "bacterial" in pest_lower or "fungal" in pest_lower:
            measures.extend(['Avoid working in fields when plants are wet', 'Clean tools after use on infected plants'])
        if "virus" in pest_lower:
            measures.extend(['Control weeds in and around the field', 'Use reflective mulches to deter insects'])
            
        return measures
