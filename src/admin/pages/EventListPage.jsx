import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, Plus, Pencil, Trash2, MapPin, Ticket } from 'lucide-react';
import toast from 'react-hot-toast';

import AdminLayout from '../components/AdminLayout';
import { eventAPI, mallAPI } from '../../services/api';

const typeLabel = (type) => {
  const map = {
    movie: '🎬 Movie',
    concert: '🎤 Concert',
    event: '📅 Event',
    attraction: '🎡 Attraction',
    playground: '🧸 Playground'
  };
  return map[type] || type || '—';
};

const EventListPage = () => {
  const [events, setEvents] = useState([]);
  const [malls, setMalls] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [eventsRes, mallsRes] = await Promise.all([eventAPI.getAll(), mallAPI.getAll()]);
      setEvents(eventsRes.data || []);
      setMalls(mallsRes.data || []);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const mallNameById = useMemo(() => {
    const map = new Map(malls.map((m) => [m.id, m.name]));
    return (id) => map.get(id) || 'Unknown';
  }, [malls]);

  const handleDelete = async (id) => {
    if (!confirm('Delete this event?')) return;

    try {
      await eventAPI.delete(id);
      setEvents((prev) => prev.filter((e) => e.id !== id));
      toast.success('Event deleted');
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete');
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Events & Tickets</h1>
            <p className="mt-2 text-gray-600">Manage movie tickets, concerts and attractions</p>
          </div>
          <Link
            to="/admin/events/new"
            className="flex items-center space-x-2 bg-navy text-white px-6 py-3 rounded-lg hover:bg-navy/90 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>New Event</span>
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mall</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {events.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <Ticket className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No events yet</p>
                      <Link to="/admin/events/new" className="inline-block mt-4 text-navy hover:text-navy/80">
                        Create the first event
                      </Link>
                    </td>
                  </tr>
                ) : (
                  events.map((ev) => (
                    <tr key={ev.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{ev.title}</div>
                        <div className="text-xs text-gray-500 line-clamp-1">{ev.location || '—'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="w-4 h-4 mr-1" />
                          {mallNameById(ev.mall_id)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                          {typeLabel(ev.type)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-600">
                          <CalendarDays className="w-4 h-4 mr-1" />
                          {ev.startDateTime ? new Date(ev.startDateTime).toLocaleString() : '—'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            ev.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {ev.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <Link to={`/admin/events/${ev.id}/edit`} className="text-blue-600 hover:text-blue-900">
                            <Pencil className="w-5 h-5" />
                          </Link>
                          <button onClick={() => handleDelete(ev.id)} className="text-red-600 hover:text-red-900">
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

export default EventListPage;
