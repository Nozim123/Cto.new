import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import { mallAPI } from '../../services/api';
import toast from 'react-hot-toast';
import {
  Save,
  ArrowLeft,
  Upload,
  MapPin,
  Clock,
  Phone,
  Calendar,
  Globe,
  Instagram,
  MessageSquare,
  Building2
} from 'lucide-react';

const MallFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    name: '',
    description_short: '',
    description_full: '',
    address: '',
    work_time: '',
    opened_date: '',
    location: { lat: '', lng: '' },
    banner: '',
    gallery: [],
    categories: [],
    featured: false,
    phone: '',
    social: {
      instagram: '',
      telegram: '',
      website: ''
    },
    status: 'coming_soon'
  });

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isEdit) {
      fetchMall();
    }
  }, [id]);

  const fetchMall = async () => {
    try {
      setLoading(true);
      const response = await mallAPI.getById(id);
      const mall = response.data;
      
      setFormData({
        name: mall.name || '',
        description_short: mall.description_short || '',
        description_full: mall.description_full || '',
        address: mall.address || '',
        work_time: mall.work_time || '',
        opened_date: mall.opened_date || '',
        location: mall.location || { lat: '', lng: '' },
        banner: mall.banner || '',
        gallery: mall.gallery || [],
        categories: mall.categories || [],
        featured: Boolean(mall.featured),
        phone: mall.phone || '',
        social: mall.social || { instagram: '', telegram: '', website: '' },
        status: mall.status || 'coming_soon'
      });
    } catch (error) {
      console.error('Failed to fetch mall:', error);
      toast.error('Mall ma\'lumotlarini yuklashda xato');
      navigate('/admin/malls');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    const nextValue = type === 'checkbox' ? checked : value;

    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: nextValue
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: nextValue
      }));
    }
  };

  const handleLocationChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      location: {
        ...prev.location,
        [field]: value
      }
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
        location: {
          lat: parseFloat(formData.location.lat) || 0,
          lng: parseFloat(formData.location.lng) || 0
        },
        gallery: formData.gallery.filter(url => url.trim() !== ''),
        categories: (formData.categories || []).map((c) => String(c).trim()).filter(Boolean),
        featured: Boolean(formData.featured)
      };

      if (isEdit) {
        await mallAPI.update(id, payload);
        toast.success('Mall muvaffaqiyatli yangilandi');
      } else {
        await mallAPI.create(payload);
        toast.success('Mall muvaffaqiyatli yaratildi');
      }
      
      navigate('/admin/malls');
    } catch (error) {
      console.error('Failed to save mall:', error);
      toast.error(isEdit ? 'Mallni yangilashda xato' : 'Mall yaratishda xato');
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
            to="/admin/malls"
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {isEdit ? 'Mallni Tahrirlash' : 'Yangi Mall Qo\'shish'}
            </h1>
            <p className="mt-2 text-gray-600">
              {isEdit ? 'Mall ma\'lumotlarini yangilang' : 'Yangi mall ma\'lumotlarini kiriting'}
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
                  Mall Nomi *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                  placeholder="Masalan: Family Park"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Holat
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                >
                  <option value="coming_soon">Tez orada</option>
                  <option value="open">Ochiq</option>
                  <option value="closed">Yopiq</option>
                </select>
              </div>

              <div className="lg:col-span-2">
                <label className="flex items-center gap-3 text-sm font-medium text-gray-700 mb-2">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-gray-300 text-gold focus:ring-gold"
                  />
                  <span>Featured (asosiy mall)</span>
                </label>
                <p className="text-xs text-gray-500">Frontendda birinchi bo'lib ko'rsatiladi</p>
              </div>

              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kategoriyalar (vergul bilan)
                </label>
                <input
                  type="text"
                  value={(formData.categories || []).join(', ')}
                  onChange={(e) => {
                    const parts = e.target.value.split(',').map((x) => x.trim()).filter(Boolean)
                    setFormData((prev) => ({ ...prev, categories: parts }))
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                  placeholder="fashion, electronics, food, entertainment"
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
                  placeholder="Mall haqida qisqacha ma\'lumot"
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
                  placeholder="Mall haqida to'liq ma'lumot"
                />
              </div>
            </div>
          </div>

          {/* Location & Contact */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Manzil va Bog'lanish</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  Manzil *
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                  placeholder="To'liq manzil"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Clock className="w-4 h-4 inline mr-2" />
                  Ish Vaqti
                </label>
                <input
                  type="text"
                  name="work_time"
                  value={formData.work_time}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                  placeholder="09:00 - 22:00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-2" />
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
                  Kenglik (Latitude)
                </label>
                <input
                  type="number"
                  step="any"
                  value={formData.location.lat}
                  onChange={(e) => handleLocationChange('lat', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                  placeholder="39.6270"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Uzunlik (Longitude)
                </label>
                <input
                  type="number"
                  step="any"
                  value={formData.location.lng}
                  onChange={(e) => handleLocationChange('lng', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                  placeholder="66.9750"
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
                  placeholder="+998 94 123 45 67"
                />
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Ijtimoiy Tarmoqlar</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                  placeholder="https://instagram.com/familypark"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MessageSquare className="w-4 h-4 inline mr-2" />
                  Telegram
                </label>
                <input
                  type="url"
                  name="social.telegram"
                  value={formData.social.telegram}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                  placeholder="https://t.me/familypark"
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
                  placeholder="https://familypark.uz"
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
              to="/admin/malls"
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

export default MallFormPage;