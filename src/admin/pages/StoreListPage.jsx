import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import { storeAPI, mallAPI } from '../../services/api';
import toast from 'react-hot-toast';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Clock,
  Phone,
  Store as StoreIcon,
  Filter,
  Grid,
  List,
  Building2
} from 'lucide-react';

const StoreListPage = () => {
  const [stores, setStores] = useState([]);
  const [malls, setMalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMall, setFilterMall] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [storesResponse, mallsResponse] = await Promise.all([
        storeAPI.getAll(),
        mallAPI.getAll()
      ]);
      setStores(storesResponse.data);
      setMalls(mallsResponse.data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      toast.error('Ma\'lumotlarni yuklashda xato');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`${name} do'konini o'chirishni tasdiqlaysizmi?`)) {
      return;
    }

    try {
      await storeAPI.delete(id);
      setStores(stores.filter(store => store.id !== id));
      toast.success('Do\'kon muvaffaqiyatli o\'chirildi');
    } catch (error) {
      console.error('Failed to delete store:', error);
      toast.error('Do\'konni o\'chirishda xato');
    }
  };

  const filteredStores = stores.filter((store) => {
    const term = searchTerm.toLowerCase();
    const storeName = String(store?.name || '');
    const category = String(store?.category || '');
    const mall = malls.find((m) => String(m.id) === String(store.mall_id));
    const mallName = String(mall?.name || '');

    const matchesSearch =
      storeName.toLowerCase().includes(term) ||
      mallName.toLowerCase().includes(term) ||
      category.toLowerCase().includes(term);

    const matchesMallFilter = filterMall === 'all' || String(store.mall_id) === filterMall;
    const matchesCategoryFilter = filterCategory === 'all' || category === filterCategory;

    return matchesSearch && matchesMallFilter && matchesCategoryFilter;
  });

  const getMallName = (mallId) => {
    const mall = malls.find((m) => String(m.id) === String(mallId));
    return mall ? mall.name : 'Noma\'lum mall';
  };

  const categories = [...new Set(stores.map((store) => store.category).filter(Boolean))];

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
            <h1 className="text-3xl font-bold text-gray-900">Do'kon Boshqaruvi</h1>
            <p className="mt-2 text-gray-600">Barcha do'konlarni boshqarish</p>
          </div>
          <Link
            to="/admin/stores/new"
            className="bg-navy text-white px-4 py-2 rounded-lg hover:bg-navy/90 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Yangi Do'kon</span>
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
                  placeholder="Do'kon nomi, mall yoki kategoriya bo'yicha qidirish..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Building2 className="w-5 h-5 text-gray-400" />
                <select
                  value={filterMall}
                  onChange={(e) => setFilterMall(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-gold focus:border-transparent"
                >
                  <option value="all">Barcha mallar</option>
                  {malls.map(mall => (
                    <option key={mall.id} value={mall.id}>{mall.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <Filter className="w-5 h-5 text-gray-400" />
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-gold focus:border-transparent"
                >
                  <option value="all">Barcha kategoriyalar</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
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

        {/* Stores Grid/List */}
        {filteredStores.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <StoreIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Do'kon topilmadi</h3>
            <p className="text-gray-600 mb-6">Qidiruv shartlaringizga mos do'kon mavjud emas.</p>
            <Link
              to="/admin/stores/new"
              className="bg-navy text-white px-6 py-3 rounded-lg hover:bg-navy/90 transition-colors inline-flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Yangi Do'kon Qo'shish</span>
            </Link>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStores.map((store) => (
              <div key={store.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                <div className="relative">
                  <img
                    src={store.banner}
                    alt={store.name}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400';
                    }}
                  />
                  <div className="absolute top-4 right-4">
                    <span className="bg-black/75 text-white px-2 py-1 rounded text-xs font-medium">
                      {store.category}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">{store.name}</h3>
                  <p className="text-sm text-gold font-medium mb-2">{getMallName(store.mall_id)}</p>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{store.description_short}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span>{store.work_time}</span>
                    </div>
                    {store.phone && (
                      <div className="flex items-center text-sm text-gray-500">
                        <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
                        <span>{store.phone}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <Link
                      to={`/admin/stores/${store.id}/edit`}
                      className="text-navy hover:text-gold transition-colors flex items-center space-x-1"
                    >
                      <Edit className="w-4 h-4" />
                      <span>Tahrirlash</span>
                    </Link>
                    
                    <div className="flex items-center space-x-2">
                      <Link
                        to={`/admin/stores/${store.id}/preview`}
                        className="text-gray-400 hover:text-navy transition-colors"
                        title="Ko'rish"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(store.id, store.name)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                        title="O'chirish"
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
                      Do'kon
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mall
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kategoriya
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ish vaqti
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Telefon
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amallar
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredStores.map((store) => (
                    <tr key={store.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <img
                            src={store.banner}
                            alt={store.name}
                            className="w-12 h-12 rounded-lg object-cover mr-4"
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=100';
                            }}
                          />
                          <div>
                            <div className="text-sm font-medium text-gray-900">{store.name}</div>
                            <div className="text-sm text-gray-500">{store.description_short}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{getMallName(store.mall_id)}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {store.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{store.work_time}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{store.phone}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <Link
                            to={`/admin/stores/${store.id}/edit`}
                            className="text-navy hover:text-gold transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <Link
                            to={`/admin/stores/${store.id}/preview`}
                            className="text-gray-400 hover:text-navy transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(store.id, store.name)}
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
          Jami {filteredStores.length} ta do'kon ko'rsatildi
        </div>
      </div>
    </AdminLayout>
  );
};

export default StoreListPage;