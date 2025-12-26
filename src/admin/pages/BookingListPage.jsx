import React, { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { CheckCircle, Clock, MapPin, RefreshCw, Ticket, XCircle } from 'lucide-react';

import AdminLayout from '../components/AdminLayout';
import { bookingAPI, eventAPI, mallAPI } from '../../services/api';

const BookingListPage = () => {
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [events, setEvents] = useState([]);
  const [malls, setMalls] = useState([]);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [bookRes, eventsRes, mallsRes] = await Promise.all([
        bookingAPI.getAll(),
        eventAPI.getAll(),
        mallAPI.getAll()
      ]);
      setBookings(bookRes.data || []);
      setEvents(eventsRes.data || []);
      setMalls(mallsRes.data || []);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const eventById = useMemo(() => {
    const map = new Map(events.map((e) => [e.id, e]));
    return (id) => map.get(id);
  }, [events]);

  const mallNameById = useMemo(() => {
    const map = new Map(malls.map((m) => [m.id, m.name]));
    return (id) => map.get(id) || 'Unknown';
  }, [malls]);

  const setStatus = async (bookingId, status) => {
    try {
      const res = await bookingAPI.update(bookingId, { status });
      setBookings((prev) => prev.map((b) => (b.id === bookingId ? res.data : b)));
      toast.success('Status updated');
    } catch (error) {
      console.error(error);
      toast.error('Failed to update status');
    }
  };

  const statusBadge = (status) => {
    const s = status || 'pending';
    if (s === 'confirmed') {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
          <CheckCircle className="w-4 h-4" /> Confirmed
        </span>
      );
    }
    if (s === 'cancelled') {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
          <XCircle className="w-4 h-4" /> Cancelled
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
        <Clock className="w-4 h-4" /> Pending
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Bookings</h1>
            <p className="mt-2 text-gray-600">Online booking requests from users</p>
          </div>
          <button
            onClick={fetchAll}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50"
          >
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mall</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bookings.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <Ticket className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No bookings yet</p>
                    </td>
                  </tr>
                ) : (
                  bookings
                    .slice()
                    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
                    .map((b) => {
                      const ev = eventById(b.event_id);
                      return (
                        <tr key={b.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{ev?.title || b.event_id}</div>
                            <div className="text-xs text-gray-500">{b.createdAt ? new Date(b.createdAt).toLocaleString() : ''}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center text-sm text-gray-600">
                              <MapPin className="w-4 h-4 mr-1" />
                              {mallNameById(b.mall_id || ev?.mall_id)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{b.name || '—'}</div>
                            <div className="text-xs text-gray-500">{b.phone || ''}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{b.quantity || 1}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{statusBadge(b.status)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => setStatus(b.id, 'confirmed')}
                                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-green-600 text-white hover:bg-green-700"
                              >
                                Confirm
                              </button>
                              <button
                                onClick={() => setStatus(b.id, 'cancelled')}
                                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-600 text-white hover:bg-red-700"
                              >
                                Cancel
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default BookingListPage;
