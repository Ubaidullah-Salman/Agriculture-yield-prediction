import matplotlib
matplotlib.use('Agg')  # Use non-interactive backend
import matplotlib.pyplot as plt
import seaborn as sns
import io
import base64
import pandas as pd
from models import Prediction

class AnalyticsService:
    def __init__(self):
        # Set visualization style
        sns.set_theme(style="whitegrid")
        plt.rcParams['figure.figsize'] = (10, 6)

    def generate_prediction_distribution(self, user_id):
        """Generates a seaborn countplot of prediction types for the user"""
        try:
            # Fetch data from DB
            predictions = Prediction.query.filter_by(user_id=user_id).all()
            if not predictions:
                return None
            
            df = pd.DataFrame([{
                'type': p.type.capitalize(),
                'result': p.result,
                'date': p.created_at
            } for p in predictions])

            plt.figure(figsize=(10, 6))
            ax = sns.countplot(data=df, x='type', hue='type', palette='viridis', legend=False)
            plt.title('Distribution of Agricultural Predictions (EDA)', fontsize=15)
            plt.xlabel('Prediction Category', fontsize=12)
            plt.ylabel('Count', fontsize=12)
            
            # Save to buffer
            buf = io.BytesIO()
            plt.savefig(buf, format='png', bbox_inches='tight')
            buf.seek(0)
            img_b64 = base64.b64encode(buf.read()).decode('utf-8')
            plt.close()
            return img_b64
        except Exception as e:
            print(f"Error generating plot: {e}")
            return None

    def generate_yield_analysis(self, user_id):
        """Generates a matplotlib analysis of predicted yields"""
        try:
            predictions = Prediction.query.filter_by(user_id=user_id, type='yield').all()
            if not predictions:
                return None
            
            data = []
            for p in predictions:
                # Try to extract numerical yield from result string if possible
                try:
                    val = float(p.result.split()[0])
                    data.append({'date': p.created_at, 'yield': val})
                except:
                    continue
            
            if not data:
                return None

            df = pd.DataFrame(data)
            df = df.sort_values('date')

            plt.figure(figsize=(10, 6))
            plt.plot(df['date'], df['yield'], marker='o', linestyle='-', color='#10b981', linewidth=2)
            plt.fill_between(df['date'], df['yield'], alpha=0.2, color='#10b981')
            plt.title('Historical Predicted Yield Trends (Data Science Analytics)', fontsize=15)
            plt.xlabel('Prediction Date', fontsize=12)
            plt.ylabel('Yield (muns/acre)', fontsize=12)
            plt.xticks(rotation=45)
            
            buf = io.BytesIO()
            plt.savefig(buf, format='png', bbox_inches='tight')
            buf.seek(0)
            img_b64 = base64.b64encode(buf.read()).decode('utf-8')
            plt.close()
            return img_b64
        except Exception as e:
            print(f"Error generating yield plot: {e}")
            return None
