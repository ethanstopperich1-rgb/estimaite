import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import PricingMatrix from './pages/PricingMatrix';
import Products from './pages/Products';
import EstimateBuilder from './pages/EstimateBuilder';
import { Loader2 } from 'lucide-react';
import { AppShell } from './components/layout';

// Protected Route wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-navy-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-accent animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <AppShell>{children}</AppShell>;
}

// Placeholder pages - will be implemented in later phases
function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">{title}</h1>
      <div className="bg-navy-900 border border-navy-700 rounded-lg p-8 text-center">
        <p className="text-gray-400">This page is coming soon...</p>
      </div>
    </div>
  );
}

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-navy-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-accent animate-spin" />
      </div>
    );
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route
        path="/login"
        element={user ? <Navigate to="/" replace /> : <Login />}
      />

      {/* Protected routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/projects"
        element={
          <ProtectedRoute>
            <PlaceholderPage title="Projects" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/projects/new"
        element={<EstimateBuilder />}
      />
      <Route
        path="/estimate"
        element={<EstimateBuilder />}
      />
      {/* Demo route - no auth required */}
      <Route
        path="/demo"
        element={<EstimateBuilder />}
      />
      <Route
        path="/projects/:id"
        element={
          <ProtectedRoute>
            <PlaceholderPage title="Project Details" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/customers"
        element={
          <ProtectedRoute>
            <PlaceholderPage title="Customers" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/pricing"
        element={<PricingMatrix />}
      />
      <Route
        path="/products"
        element={<Products />}
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <PlaceholderPage title="Settings" />
          </ProtectedRoute>
        }
      />

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
