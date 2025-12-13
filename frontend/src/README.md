# Agricultural Yield Prediction & Optimization Web Application

A comprehensive agricultural management system built with React and Tailwind CSS featuring AI-powered yield prediction, crop advisory, pest detection, crop price prediction, and real-time market insights.

## 🌟 Features

### User Features
- **User Authentication**: Login, Signup with form validation
- **Dashboard**: Analytics-driven dashboard with yield trends, soil health, weather risk, market prices
- **Farm Management**: Add, edit, delete farm fields with crop and soil details
- **AI Yield Prediction**: Input farm parameters including soil NPK & pH levels to get AI-powered yield predictions with recommendations
- **Crop Advisory**: Expert recommendations for different crops and seasons
- **Pest & Disease Detection**: Upload crop images for AI-based pest identification
- **Crop Price Prediction**: Upload grain images to analyze quality and predict market price based on grain health
- **Market Prices**: Real-time market rates with price trends and historical data
- **Weather Alerts**: Current weather, 5-day forecast, and agricultural advisories
- **Profile Management**: Update personal and farm information

### Admin Features
- **Admin Dashboard**: User statistics, activity charts, system overview
- **System Health & Performance**: Track AI model accuracy for all prediction models (Yield, Pest, Price, etc.)
- **User Management**: View, add, edit, delete user accounts
- **User Activity Tracking**: Monitor login history and user engagement
- **User Connectivity Analytics**:
  - User latency tracker
  - Packet-loss estimation per region
  - Real-time connection quality index (24h monitoring)
  - ISP-level performance analytics
  - Regional connectivity analysis

### UI/UX Features
- **Light/Dark Mode**: Toggle between themes with persistent preference
- **Responsive Design**: Mobile-first design that works on all devices
- **Animated UI**: Smooth transitions and animations
- **Card-based Layouts**: Clean, modern interface design
- **Interactive Charts**: Recharts integration for data visualization
- **Toast Notifications**: User feedback for actions

## 📁 Project Structure

```
/
├── App.tsx                          # Main app with routing
├── styles/
│   └── globals.css                  # Global styles, theme tokens, animations
├── contexts/
│   ├── ThemeContext.tsx            # Light/Dark mode management
│   └── AuthContext.tsx             # Authentication state management
├── utils/
│   └── mockData.ts                 # Mock data for demonstration
├── components/
│   ├── ui/
│   │   ├── Card.tsx                # Reusable card component
│   │   ├── Button.tsx              # Button component with variants
│   │   ├── Input.tsx               # Input field component
│   │   ├── Select.tsx              # Select dropdown component
│   │   └── Label.tsx               # Form label component
│   └── layout/
│       ├── Navbar.tsx              # Top navigation with theme toggle
│       └── Sidebar.tsx             # Side navigation menu
├── pages/
│   ├── auth/
│   │   ├── Login.tsx               # User login page
│   │   ├── Signup.tsx              # User registration page
│   │   └── AdminLogin.tsx          # Admin login page
│   ├── dashboard/
│   │   ├── Dashboard.tsx           # User dashboard
│   │   └── AdminDashboard.tsx      # Admin dashboard with system health
│   ├── admin/
│   │   └── UserManagement.tsx      # User CRUD operations
│   ├── farm/
│   │   └── FarmManagement.tsx      # Farm field management
│   ├── yield/
│   │   ├── YieldPrediction.tsx     # Yield prediction form with soil params
│   │   └── YieldResults.tsx        # Prediction results & recommendations
│   ├── advisory/
│   │   └── CropAdvisory.tsx        # Crop recommendations
│   ├── pest/
│   │   └── PestDetection.tsx       # Image upload & pest detection
│   ├── crop/
│   │   └── CropPricePrediction.tsx # Grain image analysis & price prediction
│   ├── market/
│   │   └── MarketPrices.tsx        # Market rates & trends
│   ├── weather/
│   │   └── WeatherAlerts.tsx       # Weather forecast & alerts
│   └── profile/
│       └── Profile.tsx             # User profile management
└── README.md                        # This file
```

## 🔐 Authentication

### Demo Credentials

**User Login:**
- Email: demo@farmer.com
- Password: password123 (any 6+ character password works)

**Admin Login:**
- Email: admin@agri.com
- Password: admin123

## 🎨 Design System

### Color Scheme
- **Primary**: Green (#10b981) - Agricultural theme
- **Background**: White (light) / Dark gray (dark)
- **Accent**: Blue, Yellow, Red for different alert levels

### Typography
- System fonts with fallback to sans-serif
- Responsive font sizes
- Custom heading styles (h1-h4)

### Components
All components are reusable and follow consistent patterns:
- Card-based layouts
- Hover effects and transitions
- Accessible form controls
- Responsive grid systems

## 🚀 Key Functionalities

### 1. User Dashboard
**File**: `/pages/dashboard/Dashboard.tsx`
- Expected yield with trend
- Soil health score (0-100)
- Weather risk level
- Market price snapshot
- Crop health indicator
- Recent alerts feed
- Yield trend chart (Recharts)
- Quick action shortcuts

### 2. Yield Prediction Module (Enhanced)
**Files**: 
- `/pages/yield/YieldPrediction.tsx` - Input form
- `/pages/yield/YieldResults.tsx` - Results page

**Features:**
- Crop selection
- Soil type and land size input
- **NEW: Soil Nutrient Inputs (NPK - Nitrogen, Phosphorus, Potassium)**
- **NEW: pH Level Input**
- Fertilizer usage tracking
- Previous yield history
- Location-based predictions
- Irrigation type selection
- Rainfall and temperature inputs
- AI-powered yield calculation
- Risk analysis
- Fertilizer recommendations
- Improvement plan
- PDF report download (placeholder)

### 3. Crop Price Prediction Module (NEW)
**File**: `/pages/crop/CropPricePrediction.tsx`

**Features:**
- Crop type selection (Wheat, Corn, Rice, Cotton, etc.)
- Grain image upload (drag & drop or file picker)
- AI-powered grain quality analysis:
  - Moisture content detection
  - Impurity percentage
  - Grain size assessment
  - Color quality analysis
- Quality score (0-100)
- **Predicted price based on grain quality**
- **Market price comparison**
- **Price difference calculation** (premium over market rate)
- Quality parameters visualization
- Selling recommendations
- Best time to sell advice
- Storage recommendations
- Downloadable analysis report

### 4. Farm Management
**File**: `/pages/farm/FarmManagement.tsx`

**Features:**
- Add new farm fields
- Edit farm details
- Delete farms
- Track crop type
- Soil type information
- Irrigation system tracking
- Active/Fallow status

### 5. Pest Detection
**File**: `/pages/pest/PestDetection.tsx`

**Features:**
- Image upload (drag & drop or file picker)
- AI-powered pest identification
- Severity level (Low/Medium/High)
- Confidence score
- Treatment recommendations
- Preventive measures

### 6. Market Prices
**File**: `/pages/market/MarketPrices.tsx`

**Features:**
- Real-time price display
- Price trend indicators (up/down)
- Historical price charts
- Top gainers section
- Market news feed
- Search functionality

### 7. Admin Panel (Enhanced)
**Files**:
- `/pages/dashboard/AdminDashboard.tsx` - Enhanced overview
- `/pages/admin/UserManagement.tsx` - User CRUD

**Features:**
- Total users count
- Active/Inactive user tracking
- User activity charts (Bar & Pie charts)
- Add new users
- Edit user details
- Delete users
- Search users
- Login history tracking
- **NEW: System Health & Performance Section**:
  - AI Model Accuracy tracking (Yield Prediction, Pest Detection, Crop Price Pred, Soil Analysis)
  - Request count per model
  - System health metrics (CPU, Memory, API Response Time, Database Load)
  - Real-time performance monitoring
- **NEW: User Connectivity & Network Performance Section**:
  - **Regional Analysis**: Compare prices across different regions (Punjab, Sindh, KPK, Balochistan).
  - Average latency per region
  - Packet loss estimation
  - Active users by region
  - Connection quality ratings (Excellent/Good/Fair/Poor)
  - 24-hour connection quality index chart
  - ISP-level performance analytics (Jio, Airtel, Vi, BSNL)
  - ISP reliability scores
  - Real-time network quality monitoring

## 📊 Data Visualization

Uses **Recharts** library for:
- Area charts (yield trends)
- Bar charts (user activity, model accuracy)
- Pie charts (user distribution)
- Line charts (price history, connection quality)

## 🎯 Backend Integration Points

The application is designed for easy backend integration:

### API Endpoints Needed:

```javascript
// Authentication
POST /api/auth/login
POST /api/auth/signup
POST /api/auth/logout

// User Management
GET /api/users
POST /api/users
PUT /api/users/:id
DELETE /api/users/:id

// Farm Management
GET /api/farms
POST /api/farms
PUT /api/farms/:id
DELETE /api/farms/:id

// Yield Prediction (Enhanced with soil params)
POST /api/predict/yield
GET /api/predict/history

// Crop Price Prediction (NEW)
POST /api/crop/predict-price (multipart/form-data)
POST /api/crop/analyze-quality

// Pest Detection
POST /api/detect/pest (multipart/form-data)

// Market Data
GET /api/market/prices
GET /api/market/history/:crop

// Weather
GET /api/weather/current
GET /api/weather/forecast
GET /api/weather/alerts

// Admin Analytics (NEW)
GET /api/admin/system-health
GET /api/admin/model-accuracy
GET /api/admin/connectivity-stats
GET /api/admin/isp-performance
```

### Data Models:

All data structures are defined in `/utils/mockData.ts` and contexts. Simply replace mock data with API calls.

## 🛠️ Technologies Used

- **React** - UI framework
- **TypeScript** - Type safety
- **React Router** - Navigation
- **Tailwind CSS v4** - Styling
- **Recharts** - Data visualization
- **Lucide React** - Icons
- **LocalStorage** - Client-side persistence

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

All components use responsive grid systems and mobile-first design.

## ✨ Animations

Custom CSS animations in `/styles/globals.css`:
- `fadeIn` - Smooth page transitions
- `slideIn` - Sidebar animations
- `pulse-slow` - Attention grabbers

## 🔒 Security Notes

**Current Implementation:**
- Client-side validation only
- Mock authentication
- LocalStorage for state (not secure for production)

**For Production:**
- Implement JWT authentication
- Use HTTP-only cookies
- Add CSRF protection
- Implement rate limiting
- Use secure API calls (HTTPS)
- Validate all inputs server-side
- Encrypt sensitive data

## 🎨 Customization

### Change Primary Color:
Edit `/styles/globals.css`:
```css
--primary: 142 76% 36%; /* Current green */
```

### Add New Module:
1. Create new page in `/pages/[module-name]/`
2. Add route in `/App.tsx`
3. Add menu item in `/components/layout/Sidebar.tsx`
4. Add icon import from lucide-react

## 📄 License

This is a demonstration project. Use freely for educational purposes.

## 🤝 Contributing

This is a complete standalone application ready for:
- Backend API integration
- Database connection
- Cloud deployment
- Feature enhancements

## 🆕 Recent Updates

### Version 2.0 Changes:
1. **Replaced Soil Analysis with Crop Price Prediction**:
   - Upload grain images for quality analysis
   - AI-powered grain health detection
   - Price prediction based on quality
   - Market price comparison

2. **Enhanced Yield Prediction**:
   - Added soil nutrient inputs (N, P, K)
   - Added pH level input
   - More comprehensive soil analysis

3. **Enhanced Admin Dashboard**:
   - System Health & Performance section
   - AI Model Accuracy tracking
   - User Connectivity analytics
   - Regional network performance
   - ISP-level analytics
   - Real-time connection quality monitoring

## 📞 Support

For backend integration support or feature requests, refer to the API endpoints section above.

---

**Built with ❤️ for farmers and agricultural professionals**
