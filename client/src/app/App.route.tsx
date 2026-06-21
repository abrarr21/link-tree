import { createBrowserRouter, Navigate } from 'react-router';
import { Home } from '../features/home/pages/Home';
import { Login } from '../features/auth/pages/Login';
import { Register } from '../features/auth/pages/Register';
import { Dashboard } from '../features/home/pages/Dashboard';
import { Analytics } from '../features/home/pages/Analytics';
import { AdminLayout } from './AdminLayout';
import { useAuth } from '../features/auth/context/AuthContext';
import React from 'react';

// Protected Route Guard
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return null;
  return isAuthenticated ? <AdminLayout>{children}</AdminLayout> : <Navigate to="/login" replace />;
};

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return null;
  // If logged in, send them away from login/register to dashboard
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <>{children}</>;
};

const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    ), // Wrapped in Guest Guard
  },
  {
    path: '/register',
    element: (
      <PublicRoute>
        <Register />
      </PublicRoute>
    ), // Wrapped in Guest Guard
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: '/analytics',
    element: (
      <ProtectedRoute>
        <Analytics />
      </ProtectedRoute>
    ),
  },
  {
    path: '/:username',
    element: <Home />,
  },
  {
    path: '*',
    element: <Navigate to="/login" replace />,
  },
]);

export default router;
