import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import { storeAPI, mallAPI } from '../../services/api';
import toast from 'react-hot-toast';
import {
  Save,
  ArrowLeft,
  Upload,
  MapPin,
  Clock,
  Phone,
  Building2,
  Instagram,
  Globe,
  Store
} from 'lucide-react';

const StoreFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    mall_id: '',
    name: '',
    logo: '',
    banner: '',
    category: '',
    description_short: '',
    description_full: '',
    work_time: '',
    opened_date: '',
    phone: '',
    social: {
      instagram: '',
      website: ''
    },
    gallery: []
  });

  const [malls, setMalls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const categories = [
    'Kiyim',
    'Ayaq kiyim',
    'Texnika',
    'Ovqat',
    'Bolalar',
    'Sport',
    'Go\'zallik',
    'Uy-joy',
    'Avto',
    'Zargarlik',
    'Kitob',
    'Boshqa'
  ];

  useEffect(() => {
    fetchMalls();
    if (isEdit) {
      fetchStore();
    }
  }, [id]);

  const fetchMalls = async () => {
    try {
      const response = await mallAPI.getAll();
      setMalls(response.data);
    } catch (error) {
      console.error('Failed to fetch malls:', error);
    }
  };

  const fetchStore = async () => {
    try {
      setLoading(true);
      const response = await storeAPI.getById(id);
      const store = response.data;
      
      setFormData({
        mall_id: store.mall_id || '',
        name: store.name || '',
        logo: store.logo || '',
        banner: store.banner || '',
        category: store.category || '',
        description_short: store.description_short || '',
        description_full: store.description_full || '',
        work_time: store.work_time || '',
        opened_date: store.opened_date || '',
        phone: store.phone || '',
        social: store.social || { instagram: '', website: '' },
        gallery: store.gallery || []
      });
    } catch (error) {
      console.error('Failed to fetch store:', error);
      toast.error('Do\'kon ma\'lumotlarini yuklashda xato');
      navigate('/admin/stores');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
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
        await storeAPI.update(id, payload);
        toast.success('Do\'kon muvaffaqiyatli yangilandi');
      } else {
        await storeAPI.create(payload);
        toast.success('Do\'kon muvaffaqiyatli yaratildi');
      }
      
      navigate('/admin/stores');
    } catch (error) {
      console.error('Failed to save store:', error);
      toast.error(isEdit ? 'Do\'konni yangilashda xato' : 'Do\'kon yaratishda xato');
    } finally {
      setSubmitting(false);
    }
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
            to="/admin/stores"
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {isEdit ? 'Do\'konni Tahrirlash' : 'Yangi Do\'kon Qo\'shish'}
            </h1>
            <p className="mt-2 text-gray-600">
              {isEdit ? 'Do\'kon ma\'lumotlarini yangilang' : 'Yangi do\'kon ma\'lumotlarini kiriting'}
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
                  Mall Tanlash *
                </label>
                <select
                  name="mall_id"
                  value={formData.mall_id}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                  required
                >
                  <option value="">Mall tanlang</option>
                  {malls.map(mall => (
                    <option key={mall.id} value={mall.id}>{mall.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Do'kon Nomi *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                  placeholder="Masalan: Nike Store"
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
                  Ish Vaqti
                </label>
                <input
                  type="text"
                  name="work_time"
                  value={formData.work_time}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                  placeholder="09:00 - 21:00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ochilgan Sana
                </label>
                <input
                  type="date"
                  name="opened_date"
                  value={formData.opened_date}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="w-4 h-4 inline mr-2" />
                  Telefon Raqam
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                  placeholder="+998 94 123 45 68"
                />
              </div>

              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Qisqacha Tavsif
                </label>
                <textarea
                  name="description_short"
                  value={formData.description_short}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                  placeholder="Do'kon haqida qisqacha ma'lumot"
                />
              </div>

              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  To'liq Tavsif
                </label>
                <textarea
                  name="description_full"
                  value={formData.description_full}
                  onChange={handleChange}
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                  placeholder="Do'kon haqida to'liq ma'lumot"
                />
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Ijtimoiy Tarmoqlar</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Instagram className="w-4 h-4 inline mr-2" />
                  Instagram
                </label>
                <input
                  type="url"
                  name="social.instagram"
                  value={formData.social.instagram}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                  placeholder="https://instagram.com/nikesamarkand"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Globe className="w-4 h-4 inline mr-2" />
                  Veb-sayt
                </label>
                <input
                  type="url"
                  name="social.website"
                  value={formData.social.website}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                  placeholder="https://nike.com"
                />
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Rasmlar</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Logo (URL)
                </label>
                <input
                  type="url"
                  name="logo"
                  value={formData.logo}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                  placeholder="https://example.com/logo.png"
                />
                {formData.logo && (
                  <div className="mt-3">
                    <img
                      src={formData.logo}
                      alt="Logo preview"
                      className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Banner Rasm (URL)
                </label>
                <input
                  type="url"
                  name="banner"
                  value={formData.banner}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                  placeholder="https://example.com/banner.jpg"
                />
                {formData.banner && (
                  <div className="mt-3">
                    <img
                      src={formData.banner}
                      alt="Banner preview"
                      className="w-full h-48 object-cover rounded-lg border border-gray-200"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>

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
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addGalleryImage}
                  className="text-navy hover:text-gold flex items-center space-x-2"
                >
                  <Upload className="w-4 h-4" />
                  <span>Rasm Qo'shish</span>
                </button>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4">
            <Link
              to="/admin/stores"
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

export default StoreFormPage;