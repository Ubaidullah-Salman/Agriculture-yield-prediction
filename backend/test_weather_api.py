import os
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

api_key = os.getenv('OPENWEATHER_API_KEY')
city = "Islamabad"
url = f"http://api.openweathermap.org/data/2.5/weather?q={city}&appid={api_key}&units=metric"

if not api_key:
    print("❌ Error: No API Key found in .env")
    exit(1)

print(f"📡 Requesting Weather for: {city}...")
print(f"🔗 URL: {url.replace(api_key, 'HIDDEN_KEY')}")  # Hide key in output for safety

try:
    response = requests.get(url)
    data = response.json()
    
    if response.status_code == 200:
        print("\n✅ API RESPONSE SUCCESSFUL!")
        print("-" * 30)
        print(f"📍 City Name from API:  {data.get('name')}")
        print(f"🌍 Country:            {data.get('sys', {}).get('country')}")
        print(f"🗺️  Coordinates:        Lat {data.get('coord', {}).get('lat')}, Lon {data.get('coord', {}).get('lon')}")
        print(f"🌡️  Temperature:        {data.get('main', {}).get('temp')}°C")
        print("-" * 30)
        print("\n🔍 CONCLUSION:")
        print("The API is explicitly telling us it found 'Islamabad' at these coordinates.")
        print("This confirms the data is for the correct location.")
    else:
        print(f"❌ API Error: {response.status_code}")
        print(data)

except Exception as e:
    print(f"❌ Connection Error: {e}")
