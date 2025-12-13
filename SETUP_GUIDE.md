# 🌾 Agricultural Project Setup & Integration Guide

This guide will help you install all dependencies and run the complete system (Backend + Frontend).

---

## 1. Prerequisites

Ensure you have the following installed:
*   **Python 3.10+**: [Download Here](https://www.python.org/downloads/)
*   **Node.js (LTS Version)**: [Download Here](https://nodejs.org/)
*   **MySQL Server**: [Download Here](https://dev.mysql.com/downloads/installer/)

---

## 2. Backend Setup (Flask API)

The backend handles the database, authentication, and ML models.

1.  **Navigate to Backend Directory**:
    ```bash
    cd backend
    ```

2.  **Create & Activate Virtual Environment (Optional but Recommended)**:
    ```bash
    python -m venv venv
    # Windows
    .\venv\Scripts\activate
    ```

3.  **Install Dependencies**:
    ```bash
    pip install -r requirements.txt
    ```

4.  **Configure Environment**:
    *   Open `config.py` or create a `.env` file to set your Database URL and Keys.
    *   Default DB URI is: `mysql+mysqlconnector://root:password@localhost/agri_project_db`
    *   **Make sure your MySQL server is running and you have created a database named `agri_project_db`**.

5.  **Initialize Database**:
    *   Run the app once to create tables automatically.
    ```bash
    python app.py
    ```
    *   You should see `Database tables created` in the output.
    *   The server will start at `http://localhost:5000`.

---

## 3. Frontend Setup (React + Tailwind)

1.  **Navigate to Frontend Directory**:
    Open a **new** terminal (keep backend running) and go to:
    ```bash
    cd frontend
    ```

2.  **Install Dependencies**:
    ```bash
    npm install
    ```
    > ⚠️ **Common Error**: If you see `running scripts is disabled` on Windows PowerShell, run this command:
    > `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass`
    > Or switch to using **Command Prompt (cmd)**.

3.  **Start Development Server**:
    ```bash
    npm run dev
    ```
    *   The app will open at `http://localhost:3000`.

---

## 4. Frontend-Backend Integration

We have configured a **Proxy** so the frontend can easily talk to the backend.

*   **Configuration**: In `frontend/vite.config.ts`, requests starting with `/api` are forwarded to `http://localhost:5000`.
*   **API Service**: A helper file `frontend/src/services/api.ts` has been created to handle requests.

### Usage Example (in React Components):
```typescript
import { api } from '@/services/api';

// GET Request
const userData = await api.get('/auth/verify');

// POST Request
const result = await api.post('/predict/yield', formData);
```

---

## 5. Troubleshooting

*   **`npm` not found**: Restart your computer or terminal after installing Node.js.
*   **Database Connection Failed**: Check if MySQL service is running and credentials in `backend/config.py` (or `.env`) match your MySQL setup.
*   **CORS Errors**: Ensure you access the frontend via `localhost:3000`. Direct access to backend (5000) from browser console might show CORS warnings, but the proxy handles it.

---

### ✅ Ready to Go!
1. Start Backend: `python app.py`
2. Start Frontend: `npm run dev`
3. Open `http://localhost:3000` to use the app.
