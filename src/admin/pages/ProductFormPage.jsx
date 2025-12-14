import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import { productAPI, storeAPI, mallAPI } from '../../../services/api';
import toast from 'react-hot-toast';
import {
  Save,
  ArrowLeft,
  Upload,
  Package,
  Store,
  Tag,
  DollarSign,
  Upload as UploadIcon
} from 'lucide-react';

const ProductFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    store_id: '',
    name: '',
    description: '',
    category: '',
    price: '',
    gallery: [],
    stock: 'available'
  });

  const [stores, setStores] = useState([]);
  const [malls, setMalls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const categories = [
    'Kiyim',
    'Ayaq kiyim', 
    'Texnika',
    'Gadgets',
    'Uy-joy',
    'Bolalar',
    'Sport',
    'Go\'zallik',
    'Kitob',
    'Oziq-ovqat',
    'Ichimlik',
    'Avto',
    'Zargarlik',
    'Boshqa'
  ];

  const stockOptions = [
    { value: 'available', label: 'Mavjud' },
    { value: 'limited', label: 'Cheklangan' },
    { value: 'out_of_stock', label: 'Tugagan' }
  ];

  useEffect(() => {
    fetchData();
    if (isEdit) {
      fetchProduct();
    }
  }, [id]);

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
    }
  };

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getById(id);
      const product = response.data;
      
      setFormData({
        store_id: product.store_id || '',
        name: product.name || '',
        description: product.description || '',
        category: product.category || '',
        price: product.price || '',
        gallery: product.gallery || [],
        stock: product.stock || 'available'
      });
    } catch (error) {
      console.error('Failed to fetch product:', error);
      toast.error('Mahsulot ma\'lumotlarini yuklashda xato');
      navigate('/admin/products');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGalleryChange = (index, value) => {
    const newGallery = [...formData.gallery];
    newGallery[index] = value;
    setFormData(prev => ({
      ...prev,
      gallery: newGallery
    }));
  };

  const addGalleryImage = () => {
    setFormData(prev => ({
      ...prev,
      gallery: [...prev.gallery, '']
    }));
  };

  const removeGalleryImage = (index) => {
    setFormData(prev => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        ...formData,
        gallery: formData.gallery.filter(url => url.trim() !== '')
      };

      if (isEdit) {
        await productAPI.update(id, payload);
        toast.success('Mahsulot muvaffaqiyatli yangilandi');
      } else {
        await productAPI.create(payload);
        toast.success('Mahsulot muvaffaqiyatli yaratildi');
      }
      
      navigate('/admin/products');
    } catch (error) {
      console.error('Failed to save product:', error);
      toast.error(isEdit ? 'Mahsulotni yangilashda xato' : 'Mahsulot yaratishda xato');
    } finally {
      setSubmitting(false);
    }
  };

  const getMallName = (storeId) => {
    const store = stores.find(s => s.id === storeId);
    if (!store) return '';
    const mall = malls.find(m => m.id === store.mall_id);
    return mall ? mall.name : '';
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
        <div className="flex items-center space-x-4">
          <Link
            to="/admin/products"
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {isEdit ? 'Mahsulotni Tahrirlash' : 'Yangi Mahsulot Qo\'shish'}
            </h1>
            <p className="mt-2 text-gray-600">
              {isEdit ? 'Mahsulot ma\'lumotlarini yangilang' : 'Yangi mahsulot ma\'lumotlarini kiriting'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Asosiy Ma\'lumotlar</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Do'kon Tanlash *
                </label>
                <select
                  name="store_id"
                  value={formData.store_id}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                  required
                >
                  <option value="">Do'kon tanlang</option>
                  {stores.map(store => (
                    <option key={store.id} value={store.id}>
                      {store.name} {getMallName(store.id) && `- ${getMallName(store.id)}`}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mahsulot Nomi *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                  placeholder="Masalan: Air Jordan 1 Retro"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kategoriya *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                  required
                >
                  <option value="">Kategoriya tanlang</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <DollarSign className="w-4 h-4 inline mr-2" />
                  Narx (so'm)
                </label>
                <input
                  type="text"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                  placeholder="450,000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stok Holati
                </label>
                <select
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                >
                  {stockOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>

              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tavsif
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                  placeholder="Mahsulot haqida batafsil ma'lumot"
                />
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Rasmlar</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Galereya Rasmlari
              </label>
              {formData.gallery.map((image, index) => (
                <div key={index} className="flex items-center space-x-3 mb-3">
                  <input
                    type="url"
                    value={image}
                    onChange={(e) => handleGalleryChange(index, e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                    placeholder={`Rasm URL ${index + 1}`}
                  />
                  <button
                    type="button"
                    onClick={() => removeGalleryImage(index)}
                    className="text-red-500 hover:text-red-700 px-3 py-2"
                  >
                    O'chirish
                  </button>
                  {image && (
                    <img
                      src={image}
                      alt={`Preview ${index + 1}`}
                      className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addGalleryImage}
                className="text-navy hover:text-gold flex items-center space-x-2"
              >
                <UploadIcon className="w-4 h-4" />
                <span>Rasm Qo'shish</span>
              </button>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4">
            <Link
              to="/admin/products"
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Bekor qilish
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-3 bg-navy text-white rounded-lg hover:bg-navy/90 transition-colors disabled:opacity-50 flex items-center space-x-2"
            >
              {submitting ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <Save className="w-5 h-5" />
              )}
              <span>{isEdit ? 'Yangilash' : 'Saqlash'}</span>
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default ProductFormPage;