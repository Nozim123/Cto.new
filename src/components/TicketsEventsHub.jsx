import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { useTheme } from '../contexts/ThemeContext'
import fallbackEvents from '../data/events.json'

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

export default function TicketsEventsHub({ mallId, mallName }) {
  const { darkMode } = useTheme()

  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeType, setActiveType] = useState('all')

  const [selectedEvent, setSelectedEvent] = useState(null)
  const [booking, setBooking] = useState({ name: '', phone: '', email: '', quantity: 1 })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function fetchEvents() {
      setLoading(true)
      try {
        const response = await fetch(`http://localhost:5000/api/events?mall_id=${mallId}`)
        if (!response.ok) throw new Error('Failed to fetch events')
        const data = await response.json()
        if (!cancelled) setEvents(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error('Failed to fetch events:', error)
        const local = fallbackEvents.filter((e) => e.mall_id === mallId && e.isActive)
        if (!cancelled) setEvents(local)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    if (mallId) fetchEvents()

    return () => {
      cancelled = true
    }
  }, [mallId])

  const types = useMemo(() => {
    const unique = new Set(events.map((e) => e.type).filter(Boolean))
    const allTypes = ['all', ...Array.from(unique)]
    return allTypes
  }, [events])

  const filtered = useMemo(() => {
    const list = activeType === 'all' ? events : events.filter((e) => e.type === activeType)

    return [...list].sort((a, b) => {
      const aDate = a.startDateTime ? new Date(a.startDateTime).getTime() : 0
      const bDate = b.startDateTime ? new Date(b.startDateTime).getTime() : 0
      return aDate - bDate
    })
  }, [activeType, events])

  const closeModal = () => {
    setSelectedEvent(null)
    setBooking({ name: '', phone: '', email: '', quantity: 1 })
  }

  const submitBooking = async (e) => {
    e.preventDefault()

    if (!selectedEvent) return
    if (!booking.name.trim() || !booking.phone.trim()) {
      toast.error('Please enter your name and phone number')
      return
    }

    setSubmitting(true)
    try {
      const payload = {
        event_id: selectedEvent.id,
        mall_id: mallId,
        name: booking.name.trim(),
        phone: booking.phone.trim(),
        email: booking.email.trim() || undefined,
        quantity: Number(booking.quantity || 1)
      }

      const response = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        const err = await response.json().catch(() => null)
        throw new Error(err?.message || 'Booking failed')
      }

      toast.success('Booking request sent!')
      closeModal()
    } catch (error) {
      console.error(error)
      toast.error(error.message || 'Booking failed')
    } finally {
      setSubmitting(false)
    }
  }

  const panelClass = darkMode
    ? 'bg-white/5 border-white/10'
    : 'bg-white border-gray-200'

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-3xl font-display font-bold dark:text-white">Tickets & Events</h2>
          <p className="text-gray-400 mt-2">
            Movies, attractions, playgrounds and concerts{mallName ? ` in ${mallName}` : ''}.
          </p>
        </div>

        <div className="flex gap-2 flex-wrap">
          {types.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setActiveType(type)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
                activeType === type
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

      <div className={`rounded-2xl border overflow-hidden ${panelClass}`}>
        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-2xl mb-2">🎟️</div>
            <div className="text-lg font-semibold dark:text-white">No items yet</div>
            <div className="text-gray-400 mt-1">Check back soon for new events and attractions.</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {filtered.map((item) => (
              <div
                key={item.id}
                className={`rounded-2xl overflow-hidden border transition-all hover:-translate-y-0.5 ${
                  darkMode
                    ? 'bg-white/5 border-white/10 hover:bg-white/10'
                    : 'bg-white border-gray-200 hover:shadow-lg'
                }`}
              >
                <div className="relative h-40">
                  <img
                    src={item.image || 'https://images.unsplash.com/photo-1520466809213-7b9a56adcd45?w=1200'}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs font-semibold px-2 py-1 rounded-lg bg-black/40 text-white border border-white/10">
                        {TYPE_LABELS[item.type] || item.type}
                      </span>
                      <span className="text-xs font-semibold px-2 py-1 rounded-lg bg-black/40 text-white border border-white/10">
                        {formatPrice(item.price, item.currency)}
                      </span>
                    </div>
                    <div className="mt-2 text-white font-semibold text-lg line-clamp-1">{item.title}</div>
                  </div>
                </div>

                <div className="p-4">
                  <div className="text-sm text-gray-500 dark:text-gray-300 space-y-1">
                    {item.startDateTime ? (
                      <div>
                        <span className="text-gold">🕒</span> {formatDateTime(item.startDateTime)}
                      </div>
                    ) : null}
                    {item.location ? (
                      <div>
                        <span className="text-gold">📍</span> {item.location}
                      </div>
                    ) : null}
                  </div>

                  {item.description ? (
                    <p className="mt-3 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                      {item.description}
                    </p>
                  ) : null}

                  <div className="mt-4 flex items-center justify-between gap-3">
                    {item.isBookable ? (
                      <button
                        type="button"
                        onClick={() => setSelectedEvent(item)}
                        className="flex-1 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-purple-700 text-white text-sm font-semibold hover:from-purple-400 hover:to-purple-600 transition-all"
                      >
                        Book Online
                      </button>
                    ) : (
                      <div className="flex-1 px-4 py-2 rounded-xl text-sm font-semibold text-center border border-dashed border-gray-300 dark:border-white/10 text-gray-500 dark:text-gray-300">
                        Walk-in
                      </div>
                    )}

                    {item.bookingUrl ? (
                      <a
                        href={item.bookingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 rounded-xl text-sm font-semibold border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/10 transition-all"
                      >
                        Details
                      </a>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedEvent ? (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={closeModal} />

          <div
            className={`relative w-full max-w-lg rounded-2xl border shadow-2xl ${
              darkMode ? 'bg-gray-900 border-white/10' : 'bg-white border-gray-200'
            }`}
          >
            <div className="p-6 border-b border-gray-200/70 dark:border-white/10">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Booking</div>
                  <div className="text-xl font-bold dark:text-white">{selectedEvent.title}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-300 mt-1">
                    {formatPrice(selectedEvent.price, selectedEvent.currency)}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={closeModal}
                  className="w-10 h-10 rounded-xl border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/10"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>
            </div>

            <form onSubmit={submitBooking} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="text-sm">
                  <span className="block mb-1 text-gray-600 dark:text-gray-300">Name *</span>
                  <input
                    value={booking.name}
                    onChange={(e) => setBooking((b) => ({ ...b, name: e.target.value }))}
                    className={`w-full px-3 py-2 rounded-xl border outline-none ${
                      darkMode
                        ? 'bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-purple-500/60'
                        : 'bg-white border-gray-200 text-gray-900 focus:border-purple-500'
                    }`}
                    placeholder="Your name"
                  />
                </label>

                <label className="text-sm">
                  <span className="block mb-1 text-gray-600 dark:text-gray-300">Phone *</span>
                  <input
                    value={booking.phone}
                    onChange={(e) => setBooking((b) => ({ ...b, phone: e.target.value }))}
                    className={`w-full px-3 py-2 rounded-xl border outline-none ${
                      darkMode
                        ? 'bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-purple-500/60'
                        : 'bg-white border-gray-200 text-gray-900 focus:border-purple-500'
                    }`}
                    placeholder="+998..."
                  />
                </label>
              </div>

              <label className="text-sm block">
                <span className="block mb-1 text-gray-600 dark:text-gray-300">Email</span>
                <input
                  value={booking.email}
                  onChange={(e) => setBooking((b) => ({ ...b, email: e.target.value }))}
                  className={`w-full px-3 py-2 rounded-xl border outline-none ${
                    darkMode
                      ? 'bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-purple-500/60'
                      : 'bg-white border-gray-200 text-gray-900 focus:border-purple-500'
                  }`}
                  placeholder="you@example.com"
                />
              </label>

              <label className="text-sm block">
                <span className="block mb-1 text-gray-600 dark:text-gray-300">Tickets / People</span>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={booking.quantity}
                  onChange={(e) => setBooking((b) => ({ ...b, quantity: e.target.value }))}
                  className={`w-full px-3 py-2 rounded-xl border outline-none ${
                    darkMode
                      ? 'bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-purple-500/60'
                      : 'bg-white border-gray-200 text-gray-900 focus:border-purple-500'
                  }`}
                />
              </label>

              <button
                type="submit"
                disabled={submitting}
                className={`w-full py-3 rounded-xl text-white font-semibold transition-all ${
                  submitting
                    ? 'bg-purple-500/50 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-400 hover:to-purple-600'
                }`}
              >
                {submitting ? 'Sending...' : 'Submit booking'}
              </button>

              <div className="text-xs text-gray-500 dark:text-gray-400">
                We’ll contact you to confirm availability and finalize payment.
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  )
}
