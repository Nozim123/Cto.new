import React from 'react';
import { Navigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

export const useAuth = () => {
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await authAPI.getProfile();
      setUser(response.data);
    } catch (error) {
      localStorage.removeItem('adminToken');
      console.error('Auth check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      const { token, user } = response.data;
      
      localStorage.setItem('adminToken', token);
      setUser(user);
      toast.success('Muvaffaqiyatli kirdingiz!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Login xatosi';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    setUser(null);
    toast.success('Chiqib ketdingiz!');
  };

  return {
    user,
    loading,
    login,
    logout,
    checkAuth,
    isAuthenticated: !!user
  };
};

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-midnight flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-4">
          <div className="skeleton h-12" />
          <div className="skeleton h-40" />
          <div className="skeleton h-40" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};