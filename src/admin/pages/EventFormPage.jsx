import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ArrowLeft, Save, Ticket } from 'lucide-react';

import AdminLayout from '../components/AdminLayout';
import { eventAPI, mallAPI } from '../../services/api';

const toDateTimeLocal = (iso) => {
  if (!iso) return '';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  return date.toISOString().slice(0, 16);
};

const toISOStringOrEmpty = (value) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toISOString();
};

const EventFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [loading, setLoading] = useState(true);
  const [malls, setMalls] = useState([]);

  const [formData, setFormData] = useState({
    mall_id: '',
    type: 'event',
    title: '',
    description: '',
    image: '',
    location: '',
    startDateTime: '',
    endDateTime: '',
    price: 0,
    currency: 'UZS',
    isBookable: true,
    isActive: true
  });

  useEffect(() => {
    load();
  }, [id]);

  const load = async () => {
    setLoading(true);
    try {
      const mallsRes = await mallAPI.getAll();
      setMalls(mallsRes.data || []);

      if (isEdit) {
        const evRes = await eventAPI.getById(id);
        const ev = evRes.data;
        setFormData({
          mall_id: ev.mall_id || '',
          type: ev.type || 'event',
          title: ev.title || '',
          description: ev.description || '',
          image: ev.image || '',
          location: ev.location || '',
          startDateTime: toDateTimeLocal(ev.startDateTime),
          endDateTime: toDateTimeLocal(ev.endDateTime),
          price: typeof ev.price === 'number' ? ev.price : Number(ev.price || 0),
          currency: ev.currency || 'UZS',
          isBookable: !!ev.isBookable,
          isActive: ev.isActive !== false
        });
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to load form');
    } finally {
      setLoading(false);
    }
  };

  const mallOptions = useMemo(() => {
    return malls.map((m) => ({ id: m.id, name: m.name }));
  }, [malls]);

  const onChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.mall_id || !formData.title.trim()) {
      toast.error('Mall and title are required');
      return;
    }

    const payload = {
      ...formData,
      title: formData.title.trim(),
      description: formData.description.trim(),
      image: formData.image.trim(),
      location: formData.location.trim(),
      startDateTime: toISOStringOrEmpty(formData.startDateTime) || undefined,
      endDateTime: toISOStringOrEmpty(formData.endDateTime) || undefined,
      price: Number(formData.price || 0)
    };

    try {
      if (isEdit) {
        await eventAPI.update(id, payload);
        toast.success('Event updated');
      } else {
        await eventAPI.create(payload);
        toast.success('Event created');
      }
      navigate('/admin/events');
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || 'Failed to save');
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
      <div className="max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Ticket className="w-8 h-8 text-navy" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{isEdit ? 'Edit Event' : 'New Event'}</h1>
              <p className="mt-1 text-gray-600">Tickets, attractions and concerts</p>
            </div>
          </div>

          <Link
            to="/admin/events"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <label className="block">
              <span className="text-sm font-medium text-gray-700">Mall *</span>
              <select
                value={formData.mall_id}
                onChange={(e) => onChange('mall_id', e.target.value)}
                className="mt-1 w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-navy focus:border-transparent"
              >
                <option value="">Select mall</option>
                {mallOptions.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-700">Type</span>
              <select
                value={formData.type}
                onChange={(e) => onChange('type', e.target.value)}
                className="mt-1 w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-navy focus:border-transparent"
              >
                <option value="event">Event</option>
                <option value="concert">Concert</option>
                <option value="movie">Movie</option>
                <option value="attraction">Attraction</option>
                <option value="playground">Playground</option>
              </select>
            </label>
          </div>

          <label className="block">
            <span className="text-sm font-medium text-gray-700">Title *</span>
            <input
              value={formData.title}
              onChange={(e) => onChange('title', e.target.value)}
              className="mt-1 w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-navy focus:border-transparent"
              placeholder="e.g. New Year Concert"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-700">Description</span>
            <textarea
              value={formData.description}
              onChange={(e) => onChange('description', e.target.value)}
              rows={4}
              className="mt-1 w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-navy focus:border-transparent"
              placeholder="Short description"
            />
          </label>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <label className="block">
              <span className="text-sm font-medium text-gray-700">Image URL</span>
              <input
                value={formData.image}
                onChange={(e) => onChange('image', e.target.value)}
                className="mt-1 w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-navy focus:border-transparent"
                placeholder="https://..."
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-700">Location</span>
              <input
                value={formData.location}
                onChange={(e) => onChange('location', e.target.value)}
                className="mt-1 w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-navy focus:border-transparent"
                placeholder="e.g. Main Stage (2F)"
              />
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <label className="block">
              <span className="text-sm font-medium text-gray-700">Start Date/Time</span>
              <input
                type="datetime-local"
                value={formData.startDateTime}
                onChange={(e) => onChange('startDateTime', e.target.value)}
                className="mt-1 w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-navy focus:border-transparent"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-700">End Date/Time</span>
              <input
                type="datetime-local"
                value={formData.endDateTime}
                onChange={(e) => onChange('endDateTime', e.target.value)}
                className="mt-1 w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-navy focus:border-transparent"
              />
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <label className="block">
              <span className="text-sm font-medium text-gray-700">Price</span>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => onChange('price', e.target.value)}
                className="mt-1 w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-navy focus:border-transparent"
                min={0}
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-700">Currency</span>
              <input
                value={formData.currency}
                onChange={(e) => onChange('currency', e.target.value)}
                className="mt-1 w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-navy focus:border-transparent"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-700">Bookable</span>
              <select
                value={formData.isBookable ? 'yes' : 'no'}
                onChange={(e) => onChange('isBookable', e.target.value === 'yes')}
                className="mt-1 w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-navy focus:border-transparent"
              >
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </label>
          </div>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={!!formData.isActive}
              onChange={(e) => onChange('isActive', e.target.checked)}
              className="w-5 h-5 rounded border-gray-300"
            />
            <span className="text-sm font-medium text-gray-700">Active</span>
          </label>

          <div className="flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 bg-navy text-white px-6 py-3 rounded-lg hover:bg-navy/90 transition-colors"
            >
              <Save className="w-5 h-5" />
              <span>Save</span>
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default EventFormPage;
