import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import { Image, Plus, Pencil, Trash2, Eye, Clock, MapPin } from 'lucide-react';

const StoryListPage = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [malls, setMalls] = useState([]);

  useEffect(() => {
    fetchStories();
    fetchMalls();
  }, []);

  const fetchStories = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:5000/api/stories', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setStories(data);
      }
    } catch (error) {
      console.error('Failed to fetch stories:', error);
    } finally {
      setLoading(false);
    }
  };

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

  const handleDelete = async (id) => {
    if (!confirm('Bu hikoyani o\'chirmoqchimisiz?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`http://localhost:5000/api/stories/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setStories(stories.filter(s => s.id !== id));
        alert('Hikoya muvaffaqiyatli o\'chirildi!');
      }
    } catch (error) {
      console.error('Failed to delete story:', error);
      alert('Xatolik yuz berdi!');
    }
  };

  const getMallName = (mallId) => {
    const mall = malls.find(m => m.id === mallId);
    return mall ? mall.name : 'Noma\'lum';
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Instagram Stories</h1>
            <p className="mt-2 text-gray-600">Barcha hikoyalarni boshqaring</p>
          </div>
          <Link
            to="/admin/stories/new"
            className="flex items-center space-x-2 bg-navy text-white px-6 py-3 rounded-lg hover:bg-navy/90 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Yangi Hikoya</span>
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thumbnail
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sarlavha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mall
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Holati
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Turi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Badges
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amallar
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stories.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center">
                      <Image className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">Hech qanday hikoya topilmadi</p>
                      <Link
                        to="/admin/stories/new"
                        className="inline-block mt-4 text-navy hover:text-navy/80"
                      >
                        Birinchi hikoyani yarating
                      </Link>
                    </td>
                  </tr>
                ) : (
                  stories.map((story) => (
                    <tr key={story.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <img
                          src={story.thumbnail}
                          alt={story.title}
                          className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{story.title}</div>
                        <div className="text-xs text-gray-500">{story.timestamp || 'Yangi'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="w-4 h-4 mr-1" />
                          {getMallName(story.mall_id)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          story.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {story.isActive ? 'Aktiv' : 'Nofaol'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                          {story.type === 'video' ? '🎥 Video' : '📷 Rasm'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex gap-2">
                          {story.isPromoted && (
                            <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded">
                              ⚡ Aksiya
                            </span>
                          )}
                          {story.hasNew && (
                            <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded">
                              🆕 Yangi
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <Link
                            to={`/admin/stories/${story.id}/edit`}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Pencil className="w-5 h-5" />
                          </Link>
                          <button
                            onClick={() => handleDelete(story.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default StoryListPage;
