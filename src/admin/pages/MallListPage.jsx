import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import { mallAPI } from '../../services/api';
import toast from 'react-hot-toast';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  MapPin,
  Clock,
  Calendar,
  Filter,
  Grid,
  List,
  Building2
} from 'lucide-react';

const MallListPage = () => {
  const [malls, setMalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [viewMode, setViewMode] = useState('grid');

  useEffect(() => {
    fetchMalls();
  }, []);

  const fetchMalls = async () => {
    try {
      const response = await mallAPI.getAll();
      setMalls(response.data);
    } catch (error) {
      console.error('Failed to fetch malls:', error);
      toast.error('Mallarni yuklashda xato');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`${name} mallini o'chirishni tasdiqlaysizmi?`)) {
      return;
    }

    try {
      await mallAPI.delete(id);
      setMalls(malls.filter(mall => mall.id !== id));
      toast.success('Mall muvaffaqiyatli o\'chirildi');
    } catch (error) {
      console.error('Failed to delete mall:', error);
      toast.error('Mallni o\'chirishda xato');
    }
  };

  const filteredMalls = malls.filter((mall) => {
    const term = searchTerm.toLowerCase();
    const name = String(mall?.name || '');
    const address = String(mall?.address || '');

    const matchesSearch = name.toLowerCase().includes(term) || address.toLowerCase().includes(term);
    const matchesFilter = filterStatus === 'all' || mall.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  const formatDate = (dateString) => {
    if (!dateString) return '—';

    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return '—';

    return date.toLocaleDateString('uz-UZ');
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      open: { color: 'bg-green-100 text-green-800', label: 'Ochiq' },
      coming_soon: { color: 'bg-yellow-100 text-yellow-800', label: 'Tez orada' },
      closed: { color: 'bg-red-100 text-red-800', label: 'Yopiq' }
    };

    const config = statusConfig[status] || statusConfig.coming_soon;
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
            <h1 className="text-3xl font-bold text-gray-900">Mall Boshqaruvi</h1>
            <p className="mt-2 text-gray-600">Barcha mallarni boshqarish</p>
          </div>
          <Link
            to="/admin/malls/new"
            className="bg-navy text-white px-4 py-2 rounded-lg hover:bg-navy/90 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Yangi Mall</span>
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
                  placeholder="Mall nomi yoki manzil bo'yicha qidirish..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="w-5 h-5 text-gray-400" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-gold focus:border-transparent"
                >
                  <option value="all">Barchasi</option>
                  <option value="open">Ochiq</option>
                  <option value="coming_soon">Tez orada</option>
                  <option value="closed">Yopiq</option>
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

        {/* Malls Grid/List */}
        {filteredMalls.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Mall topilmadi</h3>
            <p className="text-gray-600 mb-6">Qidiruv shartlaringizga mos mall mavjud emas.</p>
            <Link
              to="/admin/malls/new"
              className="bg-navy text-white px-6 py-3 rounded-lg hover:bg-navy/90 transition-colors inline-flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Yangi Mall Qo'shish</span>
            </Link>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMalls.map((mall) => (
              <div key={mall.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                <div className="relative">
                  <img
                    src={mall.banner}
                    alt={mall.name}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400';
                    }}
                  />
                  <div className="absolute top-4 right-4">
                    {getStatusBadge(mall.status)}
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{mall.name}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{mall.description_short}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span className="truncate">{mall.address}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span>{mall.work_time}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span>Ochilgan: {formatDate(mall.opened_date)}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <Link
                      to={`/admin/malls/${mall.id}/edit`}
                      className="text-navy hover:text-gold transition-colors flex items-center space-x-1"
                    >
                      <Edit className="w-4 h-4" />
                      <span>Tahrirlash</span>
                    </Link>
                    
                    <div className="flex items-center space-x-2">
                      <Link
                        to={`/admin/malls/${mall.id}/preview`}
                        className="text-gray-400 hover:text-navy transition-colors"
                        title="Ko'rish"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(mall.id, mall.name)}
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
                      Mall
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Manzil
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ish vaqti
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Holat
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ochilgan sana
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amallar
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredMalls.map((mall) => (
                    <tr key={mall.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <img
                            src={mall.banner}
                            alt={mall.name}
                            className="w-12 h-12 rounded-lg object-cover mr-4"
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=100';
                            }}
                          />
                          <div>
                            <div className="text-sm font-medium text-gray-900">{mall.name}</div>
                            <div className="text-sm text-gray-500">{mall.description_short}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{mall.address}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{mall.work_time}</td>
                      <td className="px-6 py-4">{getStatusBadge(mall.status)}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{formatDate(mall.opened_date)}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <Link
                            to={`/admin/malls/${mall.id}/edit`}
                            className="text-navy hover:text-gold transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <Link
                            to={`/admin/malls/${mall.id}/preview`}
                            className="text-gray-400 hover:text-navy transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(mall.id, mall.name)}
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
          Jami {filteredMalls.length} ta mall ko'rsatildi
        </div>
      </div>
    </AdminLayout>
  );
};

export default MallListPage;