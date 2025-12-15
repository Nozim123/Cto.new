import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { dashboardAPI } from '../../services/api';
import {
  Building2,
  Store,
  Package,
  Image,
  TrendingUp,
  Calendar,
  Eye,
  Clock,
  Activity
} from 'lucide-react';

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    // Real-time polling
    const interval = setInterval(fetchStats, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchStats = async () => {
    try {
      const response = await dashboardAPI.getStats();
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('uz-UZ', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'mall':
        return <Building2 className="w-5 h-5 text-cyan-500" />;
      case 'store':
        return <Store className="w-5 h-5 text-green-500" />;
      case 'product':
        return <Package className="w-5 h-5 text-purple-500" />;
      default:
        return <Clock className="w-5 h-5 text-slate-500" />;
    }
  };

  const getActivityTitle = (item, type) => {
    switch (type) {
      case 'mall':
        return `Mall: ${item.name}`;
      case 'store':
        return `Do'kon: ${item.name}`;
      case 'product':
        return `Mahsulot: ${item.name}`;
      default:
        return 'Noma\'lum faoliyat';
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
            <p className="mt-2 text-slate-600 dark:text-slate-400">Samarkand Mall Explorer admin paneli</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold animate-pulse">
            <Activity className="w-4 h-4" />
            Live System
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-slate-100 dark:border-slate-700 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Jami Mall</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats?.totalMalls || 0}</p>
              </div>
              <div className="w-12 h-12 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-green-600 dark:text-green-400">+2 bu oy</span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-slate-100 dark:border-slate-700 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Jami Do'kon</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats?.totalStores || 0}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <Store className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-green-600 dark:text-green-400">+5 bu oy</span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-slate-100 dark:border-slate-700 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Jami Mahsulot</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats?.totalProducts || 0}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-green-600 dark:text-green-400">+15 bu oy</span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-slate-100 dark:border-slate-700 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Banner</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats?.totalBanners || 0}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                <Image className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-slate-500 dark:text-slate-400">{stats?.activeBanners || 0} aktiv</span>
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
            <div className="p-6 border-b border-slate-100 dark:border-slate-700">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">So'ngi Faoliyatlar</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Oxirgi o'zgarishlar va qo'shimchalar</p>
            </div>
            <div className="p-6">
              {stats?.recentActivities && stats.recentActivities.length > 0 ? (
                <div className="space-y-4">
                  {stats.recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 dark:text-white">
                          {getActivityTitle(activity.item, activity.type)}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {formatDate(activity.date)}
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <Eye className="w-4 h-4 text-slate-400" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Clock className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500">Hali faoliyat yo'q</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
            <div className="p-6 border-b border-slate-100 dark:border-slate-700">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Tezkor Harakatlar</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Keng tarqalgan vazifalar</p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <a
                  href="/admin/malls/new"
                  className="flex flex-col items-center p-4 border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors group"
                >
                  <Building2 className="w-8 h-8 text-cyan-500 mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium text-slate-900 dark:text-white">Mall Qo'shish</span>
                </a>
                
                <a
                  href="/admin/stores/new"
                  className="flex flex-col items-center p-4 border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors group"
                >
                  <Store className="w-8 h-8 text-green-500 mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium text-slate-900 dark:text-white">Do'kon Qo'shish</span>
                </a>
                
                <a
                  href="/admin/products/new"
                  className="flex flex-col items-center p-4 border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors group"
                >
                  <Package className="w-8 h-8 text-purple-500 mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium text-slate-900 dark:text-white">Mahsulot Qo'shish</span>
                </a>
                
                <a
                  href="/admin/banners"
                  className="flex flex-col items-center p-4 border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors group"
                >
                  <Image className="w-8 h-8 text-orange-500 mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium text-slate-900 dark:text-white">Banner Qo'shish</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Tizim Holati</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                <div className="w-8 h-8 bg-green-500 rounded-full animate-pulse"></div>
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white">Server</h3>
              <p className="text-sm text-green-600 dark:text-green-400">Ishlaydi</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                <div className="w-8 h-8 bg-green-500 rounded-full animate-pulse"></div>
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white">Ma'lumotlar Bazasi</h3>
              <p className="text-sm text-green-600 dark:text-green-400">Aloqada</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                <div className="w-8 h-8 bg-green-500 rounded-full animate-pulse"></div>
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white">Saqlash</h3>
              <p className="text-sm text-green-600 dark:text-green-400">Tayyor</p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default DashboardPage;
