# Agricultural Project Backend

A comprehensive Flask-based backend for the Agricultural Management System, featuring MySQL integration, ML models, and Network Monitoring.

## 🚀 Features

- **Authentication**: JWT-based secure login/signup
- **Database**: MySQL with SQLAlchemy ORM
- **ML Models**: 
  - Crop Yield Prediction (Random Forest)
  - Crop Price Prediction & Grain Analysis
  - Pest & Disease Detection (CNN)
- **APIs**:
  - Weather Forecast (OpenWeatherMap)
  - Market Prices
  - Farm Management
- **Network Monitoring**:
  - User Latency Tracking
  - ISP Performance Analytics
  - Regional Connectivity Stats

## 🛠️ Setup

1. **Install Python 3.10+**

2. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Configure Database**
   - Ensure MySQL is running.
   - Create a database named `agri_project_db` (or update `config.py`).
   - Copy `.env.example` to `.env` (optional) or set environment variables:
     ```
     DATABASE_URL=mysql+mysqlconnector://root:password@localhost/agri_project_db
     JWT_SECRET_KEY=your-secret
     OPENWEATHER_API_KEY=your-key
     ```

4. **Initialize Database**
   The app will automatically create tables on first run. You can also hit:
   `GET /api/init-db` to reset/init.

5. **Run Server**
   ```bash
   python app.py
   ```
   Server runs on `http://localhost:5000`.

## 📡 API Endpoints

### Auth
- `POST /api/auth/login`
- `POST /api/auth/signup`

### Predictions
- `POST /api/predict/yield` - Predict crop yield
- `POST /api/crop/predict-price` - Predict price from grain image
- `POST /api/detect/pest` - Detect pest from leaf image

### Admin & Network
- `GET /api/admin/stats` - Dashboard stats
- `GET /api/admin/connectivity-stats` - Regional network analysis
- `GET /api/admin/isp-performance` - ISP analytics
- `GET /api/admin/system/health` - System metrics

### Weather
- `GET /api/weather/current?location=City`
- `GET /api/weather/forecast?location=City`

## 🧠 ML Models

Models are located in `ml_models/`.
- If pre-trained models are missing, the system will generate dummy models/data automatically on startup.
