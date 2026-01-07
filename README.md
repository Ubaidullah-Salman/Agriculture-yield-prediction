# 🌾 AgriPredict: Advanced Agricultural Yield Prediction & Optimization

AgriPredict is a state-of-the-art, professional-grade agricultural management system. It combines **Machine Learning**, **Advanced Data Structures & Algorithms (DSA)**, and **Real-time Networking** to empower farmers and administrators with data-driven insights.

---

## 🚀 Key Modules

### **1. AI-Powered Predictions**
*   **Yield Prediction**: Predicts crop yields based on soil nutrients (N, P, K), pH levels, and environmental factors using a trained Random Forest model.
*   **Pest Detection**: Upload crop images to identify pests and diseases with high confidence levels and severity ratings.
*   **Crop Price Optimization**: Analyzes grain health and quality parameters from images to predict the best market price.

### **2. Admin Control & System Health**
*   **Live Metrics**: Monitor CPU, Memory, and API response times in real-time.
*   **Model Accuracy Tracker**: Visualize the performance and request load of all integrated AI models.
*   **User Management**: Full CRUD operations for managing system users and their farm data.

### **3. Smart Networking & Diagnostics**
*   **Regional Reachability**: Automatic detection of isolated regions using **Graph BFS** analysis.
*   **ISP Performance Analytics**: Real-time benchmarks for different Internet Service Providers (Jio, PTCL, Zong, etc.).
*   **Global Connection Monitor**: A live latency ping in the navbar that provides instant feedback on connection quality.

---

## 🧠 Data Structures & Algorithms (DSA) Integration

This project is not just a CRUD application; it leverages advanced computer science concepts for optimization:

| Concept | Application in AgriPredict |
| :--- | :--- |
| **Graph Theory (BFS)** | Used to calculate regional reachability and find path connectivity from the central hub. |
| **Hash Tables** | Implemented as a custom `HashTable` class for blazing-fast system statistics caching. |
| **Stack (Undo/Redo)** | A `CircularStack` manages admin actions, allowing one-click **reversion of accidental deletions** or updates. |
| **Merging & Sorting** | Uses **MergeSort** (Stable) for organizing system logs and user data by flexible keys. |
| **Binary Search** | Enabling sub-millisecond searching for specific user records and optimized log filtering. |
| **KMP Search** | Implementing string-matching for live terminal log filtering on the System Logs page. |

---

## 🛠️ Tech Stack & Architecture

### **Frontend (Vite + React)**
*   **Styling**: Vanilla CSS with modern tokens (Glassmorphism, Dark/Light modes).
*   **State Management**: React Context API for Global Auth & Theme settings.
*   **Visuals**: Lucide React (Icons) and **Recharts (SVG Graphics)** for professional data viz.

### **Backend (Flask + SQLAlchemy)**
*   **Consolidated models.py**: 5 models (User, Farm, Prediction, Notification, NetworkMetric) optimized into a single file for professional maintainability.
*   **Unified dsa.py**: A robust utility library containing all custom-built data structures used across the blueprints.
*   **Restful APIs**: modular architecture with clean separation of concerns.

### **Data Science**
*   **Models**: Scikit-Learn models (RandomForest, Joblib) and TensorFlow/Keras integrations for image analysis.
*   **Database**: MySQL/SQLite (SQLAlchemy ORM) for persistent data storage.

---

## 📂 Project Structure (Simplified)

```text
/
├── backend/
│   ├── app.py                # Main Flask Entry Point
│   ├── models.py             # Consolidated Database Models
│   ├── routes/               # Modular API Blueprints (Auth, Admin, etc.)
│   ├── services/             # Core Logic (Network Monitor, Predictors)
│   └── utils/
│       └── dsa.py            # Custom DSA Utility Library
└── frontend/
    ├── src/
    │   ├── pages/            # Main UI Components (Flattened for clarity)
    │   ├── components/       # Layouts, UI, and Networking widgets
    │   ├── App.tsx           # Global Routing
    │   └── services/api.ts   # Centralized API Service
```

---

## 🏁 How to Run

### **1. Backend Setup**
```bash
cd backend
pip install -r requirements.txt
python app.py
```
*Server runs on: http://localhost:5000*

### **2. Frontend Setup**
```bash
cd frontend
npm install
npm run dev
```
*Dashboard runs on: http://localhost:3000*

---

**Built with ❤️ for Modern Sustainable Agriculture**