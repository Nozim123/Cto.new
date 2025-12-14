import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import { productAPI, storeAPI, mallAPI } from '../../services/api';
import toast from 'react-hot-toast';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Package,
  Filter,
  Grid,
  List,
  Store,
  Tag
} from 'lucide-react';

const ProductListPage = () => {
  const [products, setProducts] = useState([]);
  const [stores, setStores] = useState([]);
  const [malls, setMalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStore, setFilterStore] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStock, setFilterStock] = useState('all');
  const [viewMode, setViewMode] = useState('grid');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsResponse, storesResponse, mallsResponse] = await Promise.all([
        productAPI.getAll(),
        storeAPI.getAll(),
        mallAPI.getAll()
      ]);
      setProducts(productsResponse.data);
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
    if (!window.confirm(`${name} mahsulotini o'chirishni tasdiqlaysizmi?`)) {
      return;
    }

    try {
      await productAPI.delete(id);
      setProducts(products.filter(product => product.id !== id));
      toast.success('Mahsulot muvaffaqiyatli o\'chirildi');
    } catch (error) {
      console.error('Failed to delete product:', error);
      toast.error('Mahsulotni o\'chirishda xato');
    }
  };

  const filteredProducts = products.filter((product) => {
    const term = searchTerm.toLowerCase();
    const productName = String(product?.name || '');
    const category = String(product?.category || '');

    const store = stores.find((s) => String(s.id) === String(product.store_id));
    const mall = store ? malls.find((m) => String(m.id) === String(store.mall_id)) : null;
    const storeName = String(store?.name || '');
    const mallName = String(mall?.name || '');

    const matchesSearch =
      productName.toLowerCase().includes(term) ||
      storeName.toLowerCase().includes(term) ||
      mallName.toLowerCase().includes(term) ||
      category.toLowerCase().includes(term);

    const matchesStoreFilter = filterStore === 'all' || String(product.store_id) === filterStore;
    const matchesCategoryFilter = filterCategory === 'all' || category === filterCategory;
    const matchesStockFilter = filterStock === 'all' || String(product.stock || '') === filterStock;

    return matchesSearch && matchesStoreFilter && matchesCategoryFilter && matchesStockFilter;
  });

  const getStoreName = (storeId) => {
    const store = stores.find((s) => String(s.id) === String(storeId));
    return store ? store.name : 'Noma\'lum do\'kon';
  };

  const getMallName = (storeId) => {
    const store = stores.find((s) => String(s.id) === String(storeId));
    if (!store) return 'Noma\'lum mall';

    const mall = malls.find((m) => String(m.id) === String(store.mall_id));
    return mall ? mall.name : 'Noma\'lum mall';
  };

  const categories = [...new Set(products.map(product => product.category).filter(Boolean))];

  const getStockBadge = (stock) => {
    const stockConfig = {
      available: { color: 'bg-green-100 text-green-800', label: 'Mavjud' },
      out_of_stock: { color: 'bg-red-100 text-red-800', label: 'Tugagan' },
      limited: { color: 'bg-yellow-100 text-yellow-800', label: 'Cheklangan' }
    };

    const config = stockConfig[stock] || stockConfig.available;
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
            <h1 className="text-3xl font-bold text-gray-900">Mahsulot Boshqaruvi</h1>
            <p className="mt-2 text-gray-600">Barcha mahsulotlarni boshqarish</p>
          </div>
          <Link
            to="/admin/products/new"
            className="bg-navy text-white px-4 py-2 rounded-lg hover:bg-navy/90 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Yangi Mahsulot</span>
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
                  placeholder="Mahsulot nomi, do'kon yoki kategoriya bo'yicha qidirish..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Store className="w-5 h-5 text-gray-400" />
                <select
                  value={filterStore}
                  onChange={(e) => setFilterStore(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-gold focus:border-transparent"
                >
                  <option value="all">Barcha do'konlar</option>
                  {stores.map(store => (
                    <option key={store.id} value={store.id}>{store.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <Tag className="w-5 h-5 text-gray-400" />
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

              <div className="flex items-center space-x-2">
                <Filter className="w-5 h-5 text-gray-400" />
                <select
                  value={filterStock}
                  onChange={(e) => setFilterStock(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-gold focus:border-transparent"
                >
                  <option value="all">Barcha stok</option>
                  <option value="available">Mavjud</option>
                  <option value="out_of_stock">Tugagan</option>
                  <option value="limited">Cheklangan</option>
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

        {/* Products Grid/List */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Mahsulot topilmadi</h3>
            <p className="text-gray-600 mb-6">Qidiruv shartlaringizga mos mahsulot mavjud emas.</p>
            <Link
              to="/admin/products/new"
              className="bg-navy text-white px-6 py-3 rounded-lg hover:bg-navy/90 transition-colors inline-flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Yangi Mahsulot Qo'shish</span>
            </Link>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                <div className="relative">
                  <img
                    src={product.gallery?.[0] || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400'}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400';
                    }}
                  />
                  <div className="absolute top-4 right-4">
                    {getStockBadge(product.stock)}
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">{product.name}</h3>
                  <p className="text-sm text-gold font-medium mb-2">{getMallName(product.store_id)} • {getStoreName(product.store_id)}</p>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    {product.price && (
                      <span className="text-lg font-bold text-navy">{product.price} so'm</span>
                    )}
                    <span className="text-xs text-gray-500">{product.category}</span>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <Link
                      to={`/admin/products/${product.id}/edit`}
                      className="text-navy hover:text-gold transition-colors flex items-center space-x-1"
                    >
                      <Edit className="w-4 h-4" />
                      <span>Tahrirlash</span>
                    </Link>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleDelete(product.id, product.name)}
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
                      Mahsulot
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Do'kon
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kategoriya
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Narx
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stok
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amallar
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <img
                            src={product.gallery?.[0] || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100'}
                            alt={product.name}
                            className="w-12 h-12 rounded-lg object-cover mr-4"
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100';
                            }}
                          />
                          <div>
                            <div className="text-sm font-medium text-gray-900">{product.name}</div>
                            <div className="text-sm text-gray-500">{product.description}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{getStoreName(product.store_id)}</div>
                        <div className="text-sm text-gray-500">{getMallName(product.store_id)}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {product.price ? `${product.price} so'm` : 'Narx belgilash'}
                      </td>
                      <td className="px-6 py-4">{getStockBadge(product.stock)}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <Link
                            to={`/admin/products/${product.id}/edit`}
                            className="text-navy hover:text-gold transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(product.id, product.name)}
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
          Jami {filteredProducts.length} ta mahsulot ko'rsatildi
        </div>
      </div>
    </AdminLayout>
  );
};

export default ProductListPage;