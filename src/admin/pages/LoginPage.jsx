import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { LogIn, ShoppingBag, Eye, EyeOff } from 'lucide-react';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: 'admin@samarkand.com',
    password: 'admin123'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    const result = await login(formData);
    if (result.success) {
      window.location.href = '/admin/dashboard';
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy to-gray-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="bg-gradient-to-r from-gold to-yellow-500 p-8 text-center">
          <div className="flex justify-center mb-4">
            <ShoppingBag className="w-12 h-12 text-navy" />
          </div>
          <h1 className="text-3xl font-bold text-navy">Admin Panel</h1>
          <p className="text-navy/80 mt-2">Samarkand Mall Explorer</p>
        </div>
        
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email manzil
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent transition-all"
                placeholder="admin@samarkand.com"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Parol
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent transition-all"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-navy to-gray-700 text-white py-3 px-4 rounded-lg font-semibold hover:from-navy/90 hover:to-gray-700/90 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  <span>Kiring</span>
                </>
              )}
            </button>
          </form>
          
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-2 font-medium">Demo ma'lumotlar:</p>
            <p className="text-xs text-gray-500">Email: admin@samarkand.com</p>
            <p className="text-xs text-gray-500">Parol: admin123</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;