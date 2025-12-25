import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';

// Auth Pages
import { Login } from './pages/auth/Login';
import { Signup } from './pages/auth/Signup';
import { AdminLogin } from './pages/auth/AdminLogin';

// User Dashboard & Pages
import { Dashboard } from './pages/dashboard/Dashboard';
import { FarmManagement } from './pages/farm/FarmManagement';
import { YieldPrediction } from './pages/yield/YieldPrediction';
import { YieldResults } from './pages/yield/YieldResults';
import { CropAdvisory } from './pages/advisory/CropAdvisory';
import { PestDetection } from './pages/pest/PestDetection';
import { CropRecommendation } from './pages/crop/CropRecommendation';
import { MarketPrices } from './pages/market/MarketPrices';
import { WeatherAlerts } from './pages/weather/WeatherAlerts';
import { Profile } from './pages/profile/Profile';

// Admin Pages
import { AdminDashboard } from './pages/dashboard/AdminDashboard';
import { UserManagement } from './pages/admin/UserManagement';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuth();
  return isAuthenticated && user?.role === 'admin' ? <>{children}</> : <Navigate to="/login" />;
}

function AppLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />}
      />
      <Route
        path="/signup"
        element={isAuthenticated ? <Navigate to="/dashboard" /> : <Signup />}
      />
      <Route
        path="/admin/login"
        element={isAuthenticated ? <Navigate to="/admin/dashboard" /> : <AdminLogin />}
      />

      {/* Protected User Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Dashboard />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/farm"
        element={
          <ProtectedRoute>
            <AppLayout>
              <FarmManagement />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/yield"
        element={
          <ProtectedRoute>
            <AppLayout>
              <YieldPrediction />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/yield/results"
        element={
          <ProtectedRoute>
            <AppLayout>
              <YieldResults />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/advisory"
        element={
          <ProtectedRoute>
            <AppLayout>
              <CropAdvisory />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/pest"
        element={
          <ProtectedRoute>
            <AppLayout>
              <PestDetection />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/crop/recommendation"
        element={
          <ProtectedRoute>
            <AppLayout>
              <CropRecommendation />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/market"
        element={
          <ProtectedRoute>
            <AppLayout>
              <MarketPrices />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/weather"
        element={
          <ProtectedRoute>
            <AppLayout>
              <WeatherAlerts />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Profile />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      {/* Protected Admin Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <AdminRoute>
            <AppLayout>
              <AdminDashboard />
            </AppLayout>
          </AdminRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <AdminRoute>
            <AppLayout>
              <UserManagement />
            </AppLayout>
          </AdminRoute>
        }
      />

      {/* Default Route */}
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}