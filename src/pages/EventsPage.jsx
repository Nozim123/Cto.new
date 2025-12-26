import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useTheme } from '../contexts/ThemeContext'
import mallsData from '../data/malls.json'
import fallbackEvents from '../data/events.json'
import Button3D from '../components/Button3D'

const TYPE_LABELS = {
  all: 'All',
  movie: 'Movies',
  concert: 'Concerts',
  event: 'Events',
  attraction: 'Attractions',
  playground: 'Playgrounds'
}

function formatDateTime(value) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
}

function formatPrice(price, currency) {
  if (price === 0) return 'Free'
  if (!price && price !== 0) return ''
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: currency || 'UZS',
      maximumFractionDigits: 0
    }).format(price)
  } catch {
    return `${price} ${currency || 'UZS'}`
  }
}

export default function EventsPage() {
  const { darkMode } = useTheme()

  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  const [selectedMall, setSelectedMall] = useState('all')
  const [selectedType, setSelectedType] = useState('all')

  useEffect(() => {
    let cancelled = false

    async function fetchEvents() {
      setLoading(true)
      try {
        const response = await fetch('http://localhost:5000/api/events')
        if (!response.ok) throw new Error('Failed to fetch events')
        const data = await response.json()
        if (!cancelled) setEvents(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error('Failed to fetch events:', error)
        if (!cancelled) setEvents(fallbackEvents)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchEvents()
    return () => {
      cancelled = true
    }
  }, [])

  const mallOptions = useMemo(() => {
    return [{ id: 'all', name: 'All malls' }, ...mallsData.map((m) => ({ id: m.id, name: m.name }))]
  }, [])

  const types = useMemo(() => {
    const unique = new Set(events.map((e) => e.type).filter(Boolean))
    return ['all', ...Array.from(unique)]
  }, [events])

  const filtered = useMemo(() => {
    return events
      .filter((e) => (selectedMall === 'all' ? true : e.mall_id === selectedMall))
      .filter((e) => (selectedType === 'all' ? true : e.type === selectedType))
      .filter((e) => e.isActive !== false)
      .sort((a, b) => {
        const aDate = a.startDateTime ? new Date(a.startDateTime).getTime() : 0
        const bDate = b.startDateTime ? new Date(b.startDateTime).getTime() : 0
        return aDate - bDate
      })
  }, [events, selectedMall, selectedType])

  const mallNameById = (id) => mallsData.find((m) => m.id === id)?.name || 'Mall'

  const bookQuick = async (event) => {
    try {
      const response = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_id: event.id,
          mall_id: event.mall_id,
          name: 'Guest',
          phone: 'N/A',
          quantity: 1
        })
      })

      if (!response.ok) throw new Error('Booking failed')
      toast.success('Booking request created (guest)')
    } catch (error) {
      toast.error(error.message || 'Booking failed')
    }
  }

  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
        <div className="flex items-end justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-display font-bold dark:text-white">Events & Tickets</h1>
            <p className="text-gray-400 mt-2">Browse movies, attractions and upcoming concerts across all malls.</p>
          </div>

          <Link to="/map">
            <Button3D variant="outline" size="sm">Open Map</Button3D>
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <label className="block">
            <span className="text-sm text-gray-600 dark:text-gray-300">Mall</span>
            <select
              value={selectedMall}
              onChange={(e) => setSelectedMall(e.target.value)}
              className={`mt-1 w-full px-3 py-2 rounded-xl border ${
                darkMode
                  ? 'bg-white/5 border-white/10 text-white'
                  : 'bg-white border-gray-200 text-gray-900'
              }`}
            >
              {mallOptions.map((m) => (
                <option key={m.id} value={m.id} className="text-gray-900">
                  {m.name}
                </option>
              ))}
            </select>
          </label>

          <div className="md:col-span-2">
            <div className="text-sm text-gray-600 dark:text-gray-300">Type</div>
            <div className="mt-1 flex gap-2 flex-wrap">
              {types.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setSelectedType(type)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
                    selectedType === type
                      ? 'bg-gradient-to-r from-purple-500 to-purple-700 text-white border-purple-500/30'
                      : darkMode
                        ? 'bg-white/5 border-white/10 text-gray-200 hover:bg-white/10'
                        : 'bg-white border-gray-200 text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  {TYPE_LABELS[type] || type}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10">
          {loading ? (
            <div className="text-center text-gray-400 py-16">Loading...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-3xl mb-2">📅</div>
              <div className="text-xl font-semibold dark:text-white">No events found</div>
              <div className="text-gray-400 mt-2">Try changing filters.</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((event) => (
                <div
                  key={event.id}
                  className={`rounded-2xl overflow-hidden border transition-all hover:-translate-y-0.5 ${
                    darkMode
                      ? 'bg-white/5 border-white/10 hover:bg-white/10'
                      : 'bg-white border-gray-200 hover:shadow-lg'
                  }`}
                >
                  <div className="relative h-44">
                    <img
                      src={event.image || 'https://images.unsplash.com/photo-1520466809213-7b9a56adcd45?w=1200'}
                      alt={event.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-xs font-semibold px-2 py-1 rounded-lg bg-black/40 text-white border border-white/10">
                          {TYPE_LABELS[event.type] || event.type}
                        </span>
                        <span className="text-xs font-semibold px-2 py-1 rounded-lg bg-black/40 text-white border border-white/10">
                          {formatPrice(event.price, event.currency)}
                        </span>
                      </div>
                      <div className="mt-2 text-white font-semibold text-lg line-clamp-1">{event.title}</div>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                      <div>
                        <span className="text-gold">🏬</span>{' '}
                        <Link className="hover:underline" to={`/mall/${event.mall_id}`}>
                          {mallNameById(event.mall_id)}
                        </Link>
                      </div>
                      {event.startDateTime ? (
                        <div>
                          <span className="text-gold">🕒</span> {formatDateTime(event.startDateTime)}
                        </div>
                      ) : null}
                      {event.location ? (
                        <div>
                          <span className="text-gold">📍</span> {event.location}
                        </div>
                      ) : null}
                    </div>

                    <div className="mt-4 flex items-center gap-3">
                      {event.isBookable ? (
                        <Link to={`/mall/${event.mall_id}`} className="flex-1">
                          <Button3D variant="primary" size="sm" className="w-full">Book</Button3D>
                        </Link>
                      ) : (
                        <div className="flex-1 text-center text-sm font-semibold py-2 rounded-xl border border-dashed border-gray-300 dark:border-white/10 text-gray-500 dark:text-gray-300">
                          Walk-in
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={() => bookQuick(event)}
                        className="px-4 py-2 rounded-xl text-sm font-semibold border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/10 transition-all"
                      >
                        Quick
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
