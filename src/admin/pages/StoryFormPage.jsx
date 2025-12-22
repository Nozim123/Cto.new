import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import { ArrowLeft, Save, Image, Video } from 'lucide-react';

const StoryFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [malls, setMalls] = useState([]);
  const [formData, setFormData] = useState({
    mall_id: '',
    title: '',
    thumbnail: '',
    media: '',
    type: 'image',
    content: {
      title: '',
      description: '',
      discount: '',
      cta: ''
    },
    isPromoted: false,
    hasNew: true,
    timestamp: 'Just now',
    isActive: true,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchMalls();
    if (id) {
      fetchStory();
    }
  }, [id]);

  const fetchMalls = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:5000/api/malls', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setMalls(data);
      }
    } catch (error) {
      console.error('Failed to fetch malls:', error);
    }
  };

  const fetchStory = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`http://localhost:5000/api/stories/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setFormData(data);
      }
    } catch (error) {
      console.error('Failed to fetch story:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleContentChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      content: {
        ...formData.content,
        [name]: value
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('adminToken');
      const url = id 
        ? `http://localhost:5000/api/stories/${id}`
        : 'http://localhost:5000/api/stories';
      
      const response = await fetch(url, {
        method: id ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert(id ? 'Hikoya yangilandi!' : 'Hikoya yaratildi!');
        navigate('/admin/stories');
      } else {
        throw new Error('Failed to save story');
      }
    } catch (error) {
      console.error('Failed to save story:', error);
      alert('Xatolik yuz berdi!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/admin/stories')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {id ? 'Hikoyani Tahrirlash' : 'Yangi Hikoya'}
            </h1>
            <p className="mt-2 text-gray-600">
              {id ? 'Mavjud hikoyani tahrirlang' : 'Instagram style hikoya yarating'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Info */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Asosiy Ma'lumotlar</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mall *
                    </label>
                    <select
                      name="mall_id"
                      value={formData.mall_id}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                      required
                    >
                      <option value="">Tanlang</option>
                      {malls.map(mall => (
                        <option key={mall.id} value={mall.id}>{mall.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sarlavha *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                      placeholder="Nike Store"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Turi *
                    </label>
                    <div className="flex gap-4">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="type"
                          value="image"
                          checked={formData.type === 'image'}
                          onChange={handleChange}
                          className="text-navy focus:ring-gold"
                        />
                        <Image className="w-4 h-4" />
                        <span>Rasm</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="type"
                          value="video"
                          checked={formData.type === 'video'}
                          onChange={handleChange}
                          className="text-navy focus:ring-gold"
                        />
                        <Video className="w-4 h-4" />
                        <span>Video</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Thumbnail URL *
                    </label>
                    <input
                      type="url"
                      name="thumbnail"
                      value={formData.thumbnail}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                      placeholder="https://example.com/thumbnail.jpg"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Media URL * ({formData.type === 'video' ? 'Video' : 'Rasm'})
                    </label>
                    <input
                      type="url"
                      name="media"
                      value={formData.media}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                      placeholder={`https://example.com/${formData.type === 'video' ? 'video.mp4' : 'image.jpg'}`}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Timestamp
                    </label>
                    <input
                      type="text"
                      name="timestamp"
                      value={formData.timestamp}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                      placeholder="2h ago"
                    />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Story Content</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Content Sarlavha
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.content.title}
                      onChange={handleContentChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                      placeholder="New Collection"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tavsif
                    </label>
                    <textarea
                      name="description"
                      value={formData.content.description}
                      onChange={handleContentChange}
                      rows="3"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                      placeholder="Check out our latest arrivals!"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Chegirma
                    </label>
                    <input
                      type="text"
                      name="discount"
                      value={formData.content.discount}
                      onChange={handleContentChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                      placeholder="30% OFF"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Call to Action
                    </label>
                    <input
                      type="text"
                      name="cta"
                      value={formData.content.cta}
                      onChange={handleContentChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                      placeholder="Shop Now"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Preview */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Preview</h2>
                <div className="aspect-[9/16] bg-gray-100 rounded-lg overflow-hidden relative">
                  {formData.thumbnail && (
                    <img
                      src={formData.thumbnail}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute top-2 left-2 w-12 h-12 rounded-full border-2 border-white overflow-hidden">
                    {formData.thumbnail && (
                      <img src={formData.thumbnail} alt="Thumb" className="w-full h-full object-cover" />
                    )}
                  </div>
                </div>
              </div>

              {/* Settings */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Sozlamalar</h2>
                
                <div className="space-y-4">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleChange}
                      className="w-5 h-5 text-navy rounded focus:ring-gold"
                    />
                    <span className="text-sm font-medium text-gray-700">Aktiv</span>
                  </label>

                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="isPromoted"
                      checked={formData.isPromoted}
                      onChange={handleChange}
                      className="w-5 h-5 text-navy rounded focus:ring-gold"
                    />
                    <span className="text-sm font-medium text-gray-700">Aksiya (⚡)</span>
                  </label>

                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="hasNew"
                      checked={formData.hasNew}
                      onChange={handleChange}
                      className="w-5 h-5 text-navy rounded focus:ring-gold"
                    />
                    <span className="text-sm font-medium text-gray-700">Yangi (🆕)</span>
                  </label>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Boshlanish Sanasi
                    </label>
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tugash Sanasi
                    </label>
                    <input
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center space-x-2 bg-navy text-white px-6 py-3 rounded-lg hover:bg-navy/90 transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    <span>{id ? 'Yangilash' : 'Yaratish'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default StoryFormPage;
