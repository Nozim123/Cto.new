import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import { bannerAPI } from '../../services/api';
import toast from 'react-hot-toast';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Image,
  Calendar,
  Link as LinkIcon,
  Filter,
  Grid,
  List,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';

const BannerListPage = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [viewMode, setViewMode] = useState('grid');

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const response = await bannerAPI.getAll();
      setBanners(response.data);
    } catch (error) {
      console.error('Failed to fetch banners:', error);
      toast.error('Bannerlarni yuklashda xato');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`${title} bannerini o'chirishni tasdiqlaysizmi?`)) {
      return;
    }

    try {
      await bannerAPI.delete(id);
      setBanners(banners.filter(banner => banner.id !== id));
      toast.success('Banner muvaffaqiyatli o\'chirildi');
    } catch (error) {
      console.error('Failed to delete banner:', error);
      toast.error('Bannerni o\'chirishda xato');
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const newStatus = !currentStatus;
      await bannerAPI.update(id, { isActive: newStatus });
      
      setBanners(banners.map(banner => 
        banner.id === id ? { ...banner, isActive: newStatus } : banner
      ));
      
      toast.success(`Banner ${newStatus ? 'aktivlashtirildi' : 'noaktiv qilindi'}`);
    } catch (error) {
      console.error('Failed to toggle banner status:', error);
      toast.error('Banner holatini o\'zgartirishda xato');
    }
  };

  const filteredBanners = banners.filter(banner => {
    const matchesSearch = banner.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         banner.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'active' && banner.isActive) ||
                         (filterStatus === 'inactive' && !banner.isActive);
    return matchesSearch && matchesFilter;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('uz-UZ');
  };

  const getPositionBadge = (position) => {
    const positionConfig = {
      top: { color: 'bg-blue-100 text-blue-800', label: 'Yuqori' },
      middle: { color: 'bg-green-100 text-green-800', label: 'O\'rta' },
      bottom: { color: 'bg-purple-100 text-purple-800', label: 'Pastki' }
    };

    const config = positionConfig[position] || positionConfig.top;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Banner Boshqaruvi</h1>
            <p className="mt-2 text-gray-600">Barcha bannerlarni boshqarish</p>
          </div>
          <Link
            to="/admin/banners/new"
            className="bg-navy text-white px-4 py-2 rounded-lg hover:bg-navy/90 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Yangi Banner</span>
          </Link>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Banner nomi yoki tavsif bo'yicha qidirish..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="w-5 h-5 text-gray-400" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-gold focus:border-transparent"
                >
                  <option value="all">Barchasi</option>
                  <option value="active">Aktiv</option>
                  <option value="inactive">Noaktiv</option>
                </select>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-gold text-white' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-gold text-white' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Banners Grid/List */}
        {filteredBanners.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <Image className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Banner topilmadi</h3>
            <p className="text-gray-600 mb-6">Qidiruv shartlaringizga mos banner mavjud emas.</p>
            <Link
              to="/admin/banners/new"
              className="bg-navy text-white px-6 py-3 rounded-lg hover:bg-navy/90 transition-colors inline-flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Yangi Banner Qo'shish</span>
            </Link>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBanners.map((banner) => (
              <div key={banner.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                <div className="relative">
                  <img
                    src={banner.image}
                    alt={banner.title}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=400';
                    }}
                  />
                  <div className="absolute top-4 right-4 flex space-x-2">
                    {banner.isActive ? (
                      <CheckCircle className="w-6 h-6 text-green-500 bg-white rounded-full" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-500 bg-white rounded-full" />
                    )}
                  </div>
                  <div className="absolute top-4 left-4">
                    {getPositionBadge(banner.position)}
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{banner.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{banner.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span>
                        {formatDate(banner.startDate)} - {formatDate(banner.endDate)}
                      </span>
                    </div>
                    {banner.link && (
                      <div className="flex items-center text-sm text-gray-500">
                        <LinkIcon className="w-4 h-4 mr-2 flex-shrink-0" />
                        <span className="truncate">{banner.link}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <button
                      onClick={() => handleToggleStatus(banner.id, banner.isActive)}
                      className={`text-sm px-3 py-1 rounded-full ${
                        banner.isActive 
                          ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      } transition-colors`}
                    >
                      {banner.isActive ? 'Aktiv' : 'Noaktiv'}
                    </button>
                    
                    <div className="flex items-center space-x-2">
                      <Link
                        to={`/admin/banners/${banner.id}/edit`}
                        className="text-navy hover:text-gold transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(banner.id, banner.title)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Banner
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Pozitsiya
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vaqt oralig'i
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Holat
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amallar
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredBanners.map((banner) => (
                    <tr key={banner.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <img
                            src={banner.image}
                            alt={banner.title}
                            className="w-12 h-12 rounded-lg object-cover mr-4"
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=100';
                            }}
                          />
                          <div>
                            <div className="text-sm font-medium text-gray-900">{banner.title}</div>
                            <div className="text-sm text-gray-500">{banner.description}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">{getPositionBadge(banner.position)}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {formatDate(banner.startDate)} - {formatDate(banner.endDate)}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleToggleStatus(banner.id, banner.isActive)}
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            banner.isActive 
                              ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                          } transition-colors cursor-pointer`}
                        >
                          {banner.isActive ? (
                            <>
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Aktiv
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3 h-3 mr-1" />
                              Noaktiv
                            </>
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <Link
                            to={`/admin/banners/${banner.id}/edit`}
                            className="text-navy hover:text-gold transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(banner.id, banner.title)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Results Summary */}
        <div className="text-sm text-gray-600">
          Jami {filteredBanners.length} ta banner ko'rsatildi
        </div>
      </div>
    </AdminLayout>
  );
};

export default BannerListPage;