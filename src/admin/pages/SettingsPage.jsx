import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { settingsAPI } from '../../../services/api';
import toast from 'react-hot-toast';
import {
  Save,
  Palette,
  Globe,
  Phone,
  Mail,
  MapPin,
  Building2,
  Image as ImageIcon,
  RefreshCw,
  Eye,
  EyeOff
} from 'lucide-react';

const SettingsPage = () => {
  const [formData, setFormData] = useState({
    theme: 'light',
    primaryColor: '#D4AF37',
    darkColor: 'rgba(37, 40, 54, 1)',
    lightTextColor: '#ffffff',
    companyName: 'Samarkand Mall Explorer',
    aboutText: '',
    contactEmail: '',
    contactPhone: '',
    address: '',
    socialMedia: {
      instagram: '',
      telegram: '',
      facebook: '',
      youtube: ''
    },
    seo: {
      title: '',
      description: '',
      keywords: '',
      ogImage: ''
    }
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await settingsAPI.get();
      const settings = response.data;
      
      setFormData({
        theme: settings.theme || 'light',
        primaryColor: settings.primaryColor || '#D4AF37',
        darkColor: settings.darkColor || 'rgba(37, 40, 54, 1)',
        lightTextColor: settings.lightTextColor || '#ffffff',
        companyName: settings.companyName || 'Samarkand Mall Explorer',
        aboutText: settings.aboutText || '',
        contactEmail: settings.contactEmail || '',
        contactPhone: settings.contactPhone || '',
        address: settings.address || '',
        socialMedia: settings.socialMedia || {
          instagram: '',
          telegram: '',
          facebook: '',
          youtube: ''
        },
        seo: settings.seo || {
          title: '',
          description: '',
          keywords: '',
          ogImage: ''
        }
      });
    } catch (error) {
      console.error('Failed to fetch settings:', error);
      toast.error('Sozlamalarni yuklashda xato');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await settingsAPI.update(formData);
      toast.success('Sozlamalar muvaffaqiyatli saqlandi');
    } catch (error) {
      console.error('Failed to save settings:', error);
      toast.error('Sozlamalarni saqlashda xato');
    } finally {
      setSubmitting(false);
    }
  };

  const resetToDefaults = () => {
    if (window.confirm('Barcha sozlamalarni dastlabki holatga qaytarishni xohlaysizmi?')) {
      fetchSettings();
      toast.success('Sozlamalar dastlabki holatga qaytarildi');
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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Sozlamalar</h1>
            <p className="mt-2 text-gray-600">Sayt umumiy sozlamalarini boshqarish</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
            >
              {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              <span>{showPreview ? 'Yashirish' : 'Ko\'rsatish'}</span>
            </button>
            <button
              onClick={resetToDefaults}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Qayta Yuklash</span>
            </button>
          </div>
        </div>

        {/* Preview */}
        {showPreview && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Sayt Ko'rinishi</h2>
            <div 
              className="border-2 border-gray-200 rounded-lg p-6"
              style={{ backgroundColor: formData.primaryColor }}
            >
              <div className="bg-white rounded-lg p-6 shadow-lg">
                <h3 className="text-2xl font-bold mb-2" style={{ color: formData.darkColor }}>
                  {formData.companyName}
                </h3>
                <p className="text-gray-600 mb-4">{formData.aboutText || 'Haqida matn hali kiritilmagan...'}</p>
                <button 
                  className="px-6 py-2 rounded-lg text-white font-semibold"
                  style={{ backgroundColor: formData.primaryColor }}
                >
                  Asosiy tugma
                </button>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* General Settings */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Umumiy Sozlamalar</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Building2 className="w-4 h-4 inline mr-2" />
                  Kompaniya Nomi
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                  placeholder="Samarkand Mall Explorer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Palette className="w-4 h-4 inline mr-2" />
                  Tema
                </label>
                <select
                  name="theme"
                  value={formData.theme}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                >
                  <option value="light">Yorug' tema</option>
                  <option value="dark">Qora tema</option>
                  <option value="auto">Avtomatik</option>
                </select>
              </div>

              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Haqida Matni
                </label>
                <textarea
                  name="aboutText"
                  value={formData.aboutText}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                  placeholder="Kompaniya haqida ma'lumot..."
                />
              </div>
            </div>
          </div>

          {/* Color Settings */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Ranglar</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Asosiy Rang
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    name="primaryColor"
                    value={formData.primaryColor}
                    onChange={handleChange}
                    className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.primaryColor}
                    onChange={handleChange}
                    name="primaryColor"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                    placeholder="#D4AF37"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Qora Rang (RGBA)
                </label>
                <input
                  type="text"
                  name="darkColor"
                  value={formData.darkColor}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                  placeholder="rgba(37, 40, 54, 1)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Oq Matn Rengi
                </label>
                <input
                  type="text"
                  name="lightTextColor"
                  value={formData.lightTextColor}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                  placeholder="#ffffff"
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Bog'lanish Ma'lumotlari</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="w-4 h-4 inline mr-2" />
                  Email Manzil
                </label>
                <input
                  type="email"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                  placeholder="info@samarkand.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="w-4 h-4 inline mr-2" />
                  Telefon Raqam
                </label>
                <input
                  type="tel"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                  placeholder="+998 94 123 45 67"
                />
              </div>

              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  Manzil
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                  placeholder="Samarkand shahri"
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
                  Instagram
                </label>
                <input
                  type="url"
                  name="socialMedia.instagram"
                  value={formData.socialMedia.instagram}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                  placeholder="https://instagram.com/samarkand"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Telegram
                </label>
                <input
                  type="url"
                  name="socialMedia.telegram"
                  value={formData.socialMedia.telegram}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                  placeholder="https://t.me/samarkand"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Facebook
                </label>
                <input
                  type="url"
                  name="socialMedia.facebook"
                  value={formData.socialMedia.facebook}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                  placeholder="https://facebook.com/samarkand"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  YouTube
                </label>
                <input
                  type="url"
                  name="socialMedia.youtube"
                  value={formData.socialMedia.youtube}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                  placeholder="https://youtube.com/samarkand"
                />
              </div>
            </div>
          </div>

          {/* SEO Settings */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">SEO Sozlamalar</h2>
            
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title Tag
                </label>
                <input
                  type="text"
                  name="seo.title"
                  value={formData.seo.title}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                  placeholder="Samarkand Mall Explorer - Mall va Do'konlar"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meta Description
                </label>
                <textarea
                  name="seo.description"
                  value={formData.seo.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                  placeholder="Samarkand shahridagi barcha mall va do'konlar haqida ma'lumot..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Keywords
                </label>
                <input
                  type="text"
                  name="seo.keywords"
                  value={formData.seo.keywords}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                  placeholder="samarkand, mall, do'kon, savdo"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <ImageIcon className="w-4 h-4 inline mr-2" />
                  OG Image URL
                </label>
                <input
                  type="url"
                  name="seo.ogImage"
                  value={formData.seo.ogImage}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                  placeholder="https://example.com/og-image.jpg"
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={fetchSettings}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Bekor qilish
            </button>
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
              <span>Saqlash</span>
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default SettingsPage;