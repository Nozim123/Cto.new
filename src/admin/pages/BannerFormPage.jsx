import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import { bannerAPI } from '../../services/api';
import toast from 'react-hot-toast';
import {
  Save,
  ArrowLeft,
  Image,
  Calendar,
  Link as LinkIcon,
  Eye,
  EyeOff
} from 'lucide-react';

const BannerFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    link: '',
    position: 'top',
    isActive: true,
    startDate: '',
    endDate: ''
  });

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const positions = [
    { value: 'top', label: 'Yuqori qism' },
    { value: 'middle', label: 'O\'rta qism' },
    { value: 'bottom', label: 'Pastki qism' }
  ];

  useEffect(() => {
    if (isEdit) {
      fetchBanner();
    } else {
      // Set default dates
      const today = new Date();
      const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());
      
      setFormData(prev => ({
        ...prev,
        startDate: today.toISOString().split('T')[0],
        endDate: nextMonth.toISOString().split('T')[0]
      }));
    }
  }, [id]);

  const fetchBanner = async () => {
    try {
      setLoading(true);
      const response = await bannerAPI.getById(id);
      const banner = response.data;
      
      setFormData({
        title: banner.title || '',
        description: banner.description || '',
        image: banner.image || '',
        link: banner.link || '',
        position: banner.position || 'top',
        isActive: banner.isActive || false,
        startDate: banner.startDate || '',
        endDate: banner.endDate || ''
      });
    } catch (error) {
      console.error('Failed to fetch banner:', error);
      toast.error('Banner ma\'lumotlarini yuklashda xato');
      navigate('/admin/banners');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        ...formData,
        startDate: formData.startDate || new Date().toISOString().split('T')[0],
        endDate: formData.endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      };

      if (isEdit) {
        await bannerAPI.update(id, payload);
        toast.success('Banner muvaffaqiyatli yangilandi');
      } else {
        await bannerAPI.create(payload);
        toast.success('Banner muvaffaqiyatli yaratildi');
      }
      
      navigate('/admin/banners');
    } catch (error) {
      console.error('Failed to save banner:', error);
      toast.error(isEdit ? 'Bannerni yangilashda xato' : 'Banner yaratishda xato');
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
            to="/admin/banners"
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {isEdit ? 'Bannerni Tahrirlash' : 'Yangi Banner Qo\'shish'}
            </h1>
            <p className="mt-2 text-gray-600">
              {isEdit ? 'Banner ma\'lumotlarini yangilang' : 'Yeni banner ma\'lumotlarini kiriting'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Banner Ma\'lumotlari</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Banner Sarlavhasi *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                  placeholder="Masalan: Xush kelibsiz!"
                  required
                />
              </div>

              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tavsif
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                  placeholder="Banner haqida qisqacha ma'lumot"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pozitsiya *
                </label>
                <select
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                  required
                >
                  {positions.map(position => (
                    <option key={position.value} value={position.value}>
                      {position.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                    className="w-4 h-4 text-navy bg-gray-100 border-gray-300 rounded focus:ring-navy focus:ring-2"
                  />
                  <span className="text-sm font-medium text-gray-700">Aktiv holatda</span>
                </label>
                <p className="text-xs text-gray-500 mt-1">Aktiv banner saytda ko'rsatiladi</p>
              </div>
            </div>
          </div>

          {/* Image and Link */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Rasm va Havola</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Image className="w-4 h-4 inline mr-2" />
                  Banner Rasm URL *
                </label>
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                  placeholder="https://example.com/banner.jpg"
                  required
                />
                {formData.image && (
                  <div className="mt-3">
                    <img
                      src={formData.image}
                      alt="Banner preview"
                      className="w-full h-64 object-cover rounded-lg border border-gray-200"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <LinkIcon className="w-4 h-4 inline mr-2" />
                  Havola (ixtiyoriy)
                </label>
                <input
                  type="url"
                  name="link"
                  value={formData.link}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                  placeholder="https://example.com/page"
                />
                <p className="text-xs text-gray-500 mt-1">Banner bosilganda o'tish kerak bo'lgan sahifa URL</p>
              </div>
            </div>
          </div>

          {/* Date Range */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Vaqt Oralig'i</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Boshlanish sanasi
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Tugash sanasi
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Banner faqat belgilangan vaqt oralig'ida ko'rsatiladi
            </p>
          </div>

          {/* Preview */}
          {formData.image && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Banner Ko'rinishi</h2>
              
              <div className="bg-gray-100 rounded-lg p-6 text-center">
                <div className="relative inline-block">
                  <img
                    src={formData.image}
                    alt={formData.title}
                    className="max-w-full h-auto rounded-lg shadow-lg"
                    style={{ maxHeight: '300px' }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-30 rounded-lg flex items-center justify-center">
                    <div className="text-white text-center">
                      <h3 className="text-xl font-bold mb-2">{formData.title || 'Banner sarlavhasi'}</h3>
                      <p className="text-sm opacity-90">{formData.description || 'Banner tavsifi'}</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 flex justify-center space-x-4 text-sm text-gray-600">
                  <span>Pozitsiya: <strong>{positions.find(p => p.value === formData.position)?.label}</strong></span>
                  <span>Holat: <strong className={formData.isActive ? 'text-green-600' : 'text-red-600'}>
                    {formData.isActive ? 'Aktiv' : 'Noaktiv'}
                  </strong></span>
                </div>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex justify-end space-x-4">
            <Link
              to="/admin/banners"
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

export default BannerFormPage;