import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
  LayoutDashboard,
  Building2,
  Store,
  Package,
  Image,
  Settings,
  LogOut,
  Menu,
  X,
  ShoppingBag
} from 'lucide-react';

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Mall Boshqaruvi', href: '/admin/malls', icon: Building2 },
    { name: 'Do\'kon Boshqaruvi', href: '/admin/stores', icon: Store },
    { name: 'Mahsulot Boshqaruvi', href: '/admin/products', icon: Package },
    { name: 'Banner Boshqaruvi', href: '/admin/banners', icon: Image },
    { name: 'Sozlamalar', href: '/admin/settings', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const isActive = (path) => {
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-50 w-64 bg-navy shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-between h-16 px-6 bg-navy/95">
          <div className="flex items-center space-x-3">
            <ShoppingBag className="w-8 h-8 text-gold" />
            <div>
              <h1 className="text-white font-bold text-lg">Admin Panel</h1>
              <p className="text-gold text-xs">Mall Explorer</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white hover:text-gold"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <nav className="mt-8 px-4">
          <div className="space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`${isActive(item.href)
                    ? 'bg-gold text-navy'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    } group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200`}
                >
                  <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </nav>
        
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="bg-gray-700/50 rounded-lg p-4 mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gold rounded-full flex items-center justify-center">
                <span className="text-navy font-bold text-sm">
                  {user?.name?.charAt(0) || 'A'}
                </span>
              </div>
              <div>
                <p className="text-white text-sm font-medium">{user?.name}</p>
                <p className="text-gray-400 text-xs">{user?.role}</p>
              </div>
            </div>
          </div>
          
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-2 text-sm font-medium text-gray-300 rounded-lg hover:bg-red-600 hover:text-white transition-all duration-200"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Chiqish
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-6">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-500 hover:text-gray-600"
            >
              <Menu className="w-6 h-6" />
            </button>
            
            <div className="flex items-center space-x-4">
              <h2 className="text-2xl font-bold text-gray-900">
                {navigation.find(item => isActive(item.href))?.name || 'Admin Panel'}
              </h2>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                Xush kelibsiz, {user?.name}
              </span>
              <Link
                to="/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-navy hover:text-gold font-medium"
              >
                Saytni ko'rish →
              </Link>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          {children}
        </main>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminLayout;