import requests
from config import Config
import random

class WeatherService:
    BASE_URL = "http://api.openweathermap.org/data/2.5"
    
    def get_current_weather(self, location):
        api_key = Config.OPENWEATHER_API_KEY
        
        if not api_key:
            return self._mock_current_weather(location)
            
        try:
            response = requests.get(f"{self.BASE_URL}/weather", params={
                'q': location,
                'appid': api_key,
                'units': 'metric'
            })
            if response.status_code == 200:
                data = response.json()
                return {
                    'temp': round(data['main']['temp'], 1),
                    'condition': data['weather'][0]['main'],
                    'humidity': data['main']['humidity'],
                    'windSpeed': data['wind']['speed'],
                    'rain': data.get('rain', {}).get('1h', 0),
                    'location': data['name']
                }
            return self._mock_current_weather(location)
        except:
            return self._mock_current_weather(location)
            
    def get_forecast(self, location):
        api_key = Config.OPENWEATHER_API_KEY
        if not api_key:
            return self._mock_forecast()
            
        try:
            # OpenWeatherMap 5 day / 3 hour forecast
            url = f"{self.BASE_URL}/forecast"
            params = {
                'q': location,
                'appid': api_key,
                'units': 'metric'
            }
            response = requests.get(url, params=params)
            
            if response.status_code == 200:
                data = response.json()
                return self._process_forecast_data(data)
            
            print(f"Weather API Error: {response.status_code} - {response.text}")
            return self._mock_forecast()
        except Exception as e:
            print(f"Weather Service Exception: {str(e)}")
            return self._mock_forecast()

    def _process_forecast_data(self, data):
        # Process 3-hour intervals into daily summaries
        # We'll simply take one reading per day (e.g., noon) for simplicity 
        # or aggregate. Here, let's take the reading closest to 12:00 PM for each distinct day.
        
        processed = []
        seen_days = set()
        
        for item in data.get('list', []):
            dt_txt = item.get('dt_txt', '') # Format: "2022-08-30 15:00:00"
            date_str = dt_txt.split(' ')[0]
            time_str = dt_txt.split(' ')[1]
            
            # Simple logic: take the first available slot for a new day, 
            # ideally we want noon, but first available is safer to ensure we get 5 days
            if date_str not in seen_days:
                seen_days.add(date_str)
                
                # Extract day name (e.g., 'Mon')
                import datetime
                date_obj = datetime.datetime.strptime(date_str, '%Y-%m-%d')
                day_name = date_obj.strftime('%a')
                
                # Check for rain probability (pop is probability of precipitation 0-1)
                pop = item.get('pop', 0) * 100
                
                weather_main = item['weather'][0]['main']
                
                processed.append({
                    'day': day_name,
                    'temp': round(item['main']['temp'], 1),
                    'condition': weather_main,
                    'rain': int(pop)
                })
                
                if len(processed) >= 5:
                    break
                    
        return processed

    def get_advisories(self, location):
        # 1. Get current weather data to base analysis on
        #    We can reuse existing method or fetch fresh
        weather = self.get_current_weather(location)
        
        # 2. Initialize containers
        alerts = []
        irrigation = {}
        activities = {'recommended': [], 'restricted': []}
        
        # 3. Analyze Temperature
        temp = weather.get('temp', 25)
        if temp > 35:
            alerts.append({
                'id': 'heat-1', 'type': 'temperature', 'severity': 'medium',
                'title': 'High Temperature Alert',
                'message': f'Temperature is {temp}°C. Ensure crops are well-hydrated.',
                'time': 'Current'
            })
            irrigation = {
                'status': 'Irrigation Recommended',
                'message': 'High temperatures detected. Soil moisture loss is rapid.',
                'next_date': 'Today'
            }
        elif temp < 5:
             alerts.append({
                'id': 'cold-1', 'type': 'temperature', 'severity': 'high',
                'title': 'Frost Warning',
                'message': f'Freezing temperatures ({temp}°C) expected. Protect sensitive crops.',
                'time': 'Current'
            })

        # 4. Analyze Rain/Conditions
        condition = weather.get('condition', '').lower()
        if 'rain' in condition or 'drizzle' in condition or 'storm' in condition:
            alerts.append({
                'id': 'rain-1', 'type': 'weather', 'severity': 'high',
                'title': 'Rainfall Alert',
                'message': f'Condition is {weather.get("condition")}. detailed: Heavy rainfall expected.',
                'time': 'Current' 
            })
            irrigation = {
                'status': 'Skip Irrigation',
                'message': f'Natural rainfall detected ({condition}). Save water.',
                'next_date': 'Check back in 2 days'
            }
            activities['restricted'].append('Harvesting (Moisture risk)')
            activities['restricted'].append('Pest Control Spraying (Washout risk)')
        else:
            # If not raining and not super hot
            if not irrigation:
                irrigation = {
                   'status': 'Monitor Soil',
                   'message': 'Weather is mild. Check soil moisture sensor.',
                   'next_date': 'Tomorrow'
                }
            activities['recommended'].append('Harvesting')
            activities['recommended'].append('Weeding')

        # 5. Analyze Wind
        wind = weather.get('windSpeed', 0)
        if wind > 20:
             alerts.append({
                'id': 'wind-1', 'type': 'wind', 'severity': 'medium',
                'title': 'High Wind Alert',
                'message': f'Wind speeds at {wind} km/h. Avoid spraying.',
                'time': 'Current'
            })
             if 'Pest Control Spraying' not in activities['restricted']: # don't add duplicate
                 activities['restricted'].append('Pest Control Spraying (Drift risk)')
        else:
             if 'rain' not in condition:
                 activities['recommended'].append('Fertilizer Application')
                 activities['recommended'].append('Pest Control Spraying')

        return {
            'alerts': alerts,
            'irrigation': irrigation,
            'activities': activities
        }

    def _mock_current_weather(self, location):
        condition = random.choice(['Sunny', 'Cloudy', 'Rainy'])
        return {
            'temp': round(random.uniform(20, 35), 1),
            'condition': condition,
            'humidity': random.randint(30, 80),
            'windSpeed': random.randint(5, 25),
            'rain': random.uniform(0, 10) if condition == 'Rainy' else 0,
            'location': location or 'Unknown'
        }
        
    def _mock_forecast(self):
        days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
        return [
            {
                'day': day,
                'temp': round(random.uniform(20, 32), 1),
                'condition': random.choice(['Sunny', 'Cloudy', 'Rainy']),
                'rain': random.randint(0, 60)
            }
            for day in days
        ]
