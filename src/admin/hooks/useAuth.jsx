import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';
import toast from 'react-hot-toast';

export const useAuth = () => {
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const { login: userLogin, logout: userLogout } = useUser();

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

      // Verify admin token and user
      const savedUser = localStorage.getItem('user');
      const isAdmin = localStorage.getItem('isAdmin');
      
      if (!savedUser || !isAdmin) {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('user');
        localStorage.removeItem('isAdmin');
        setLoading(false);
        return;
      }

      const userData = JSON.parse(savedUser);
      
      // Only allow specific admin email
      const adminEmails = ['admin@samarkand.com', 'admin@samarkandmall.uz', 'nozim.roziyev@gmail.com'];
      if (!adminEmails.includes(userData.email)) {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('user');
        localStorage.removeItem('isAdmin');
        toast.error('Invalid admin access');
        setLoading(false);
        return;
      }

      setUser(userData);
    } catch (error) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('user');
      localStorage.removeItem('isAdmin');
      console.error('Auth check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      // Simulate authentication - in real app, this would call your API
      if (
        (credentials.email === 'admin@samarkand.com' || credentials.email === 'admin@samarkandmall.uz') &&
        credentials.password === 'admin123'
      ) {
        const adminUser = {
          id: 'admin-1',
          name: 'Admin User',
          email: credentials.email,
          role: 'admin'
        };
        
        const adminToken = 'admin_jwt_token_' + Date.now();
        localStorage.setItem('adminToken', adminToken);
        localStorage.setItem('user', JSON.stringify(adminUser));
        localStorage.setItem('isAdmin', 'true');
        
        setUser(adminUser);
        
        // Also update user context for admin access
        userLogin(adminUser, adminToken);
        
        toast.success('Admin panel ga muvaffaqiyatli kirdingiz!');
        return { success: true };
      } else if (credentials.email === 'nozim.roziyev@gmail.com' && credentials.password === 'admin123') {
        const ownerUser = {
          id: 'owner-1',
          name: 'Nozim Roziyev',
          email: 'nozim.roziyev@gmail.com',
          role: 'owner'
        };
        
        const adminToken = 'owner_jwt_token_' + Date.now();
        localStorage.setItem('adminToken', adminToken);
        localStorage.setItem('user', JSON.stringify(ownerUser));
        localStorage.setItem('isAdmin', 'true');
        
        setUser(ownerUser);
        
        // Also update user context for admin access
        userLogin(ownerUser, adminToken);
        
        toast.success('Owner panel ga muvaffaqiyatli kirdingiz!');
        return { success: true };
      } else {
        toast.error('Noto\'g\'ri login yoki parol');
        return { success: false, error: 'Invalid credentials' };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Login xatosi yuz berdi';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    setUser(null);
    userLogout();
    toast.success('Admin panel dan chiqib ketdingiz!');
  };

  return {
    user,
    loading,
    login,
    logout,
    checkAuth,
    isAuthenticated: !!user && user.role === 'admin'
  };
};

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};