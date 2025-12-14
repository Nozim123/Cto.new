import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Bell, CalendarClock } from 'lucide-react'
import toast from 'react-hot-toast'

import events from '../data/events.json'
import malls from '../data/malls.json'

import { useUser } from '../contexts/UserContext'
import SectionHeader from '../components/ui/SectionHeader'
import GlassCard from '../components/ui/GlassCard'

const countdown = (iso) => {
  const ms = new Date(iso).getTime() - Date.now()
  if (Number.isNaN(ms) || ms <= 0) return 'Live'
  const days = Math.floor(ms / (1000 * 60 * 60 * 24))
  const hrs = Math.floor((ms / (1000 * 60 * 60)) % 24)
  const mins = Math.floor((ms / (1000 * 60)) % 60)
  return `${days}d ${hrs}h ${mins}m`
}

export default function EventsPage() {
  const { user, createNotification } = useUser()

  const sorted = useMemo(() => {
    return [...events].sort((a, b) => new Date(a.endsAt) - new Date(b.endsAt))
  }, [])

  const remind = (ev) => {
    if (!user) {
      toast.error('Sign in to receive reminders.')
      return
    }

    createNotification(user.id, {
      title: `Reminder set: ${ev.title}`,
      message: `We’ll notify you before it ends. (Demo — stored locally)`
    })

    toast.success('Reminder saved')
  }

  return (
    <div className="section-padding max-w-6xl mx-auto">
      <SectionHeader
        eyebrow="Events & Promotions"
        title="What’s happening now"
        description="Upcoming events, seasonal discounts, and limited-time offers — with countdown timers."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {sorted.map((ev) => {
          const mall = malls.find((m) => m.id === ev.mallId)
          return (
            <GlassCard key={ev.id} className="overflow-hidden">
              <img src={ev.image} alt={ev.title} className="h-44 w-full object-cover" loading="lazy" />
              <div className="p-6">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold text-white">{ev.title}</p>
                  <span className="text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/70">
                    {ev.type}
                  </span>
                </div>

                <p className="text-white/60 text-sm mt-2">{ev.description}</p>

                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-2xl bg-white/5 border border-white/10 px-4 py-3">
                    <p className="text-white/50">Ends in</p>
                    <p className="text-white font-semibold">{countdown(ev.endsAt)}</p>
                  </div>
                  <div className="rounded-2xl bg-white/5 border border-white/10 px-4 py-3">
                    <p className="text-white/50">Mall</p>
                    <p className="text-white font-semibold truncate">{mall?.name || '—'}</p>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  {mall && (
                    <Link to={`/mall/${mall.id}`} className="button-secondary inline-flex items-center gap-2">
                      <CalendarClock className="w-4 h-4" />
                      View mall
                    </Link>
                  )}
                  <button type="button" onClick={() => remind(ev)} className="button-primary inline-flex items-center gap-2">
                    <Bell className="w-4 h-4" />
                    Remind me
                  </button>
                </div>
              </div>
            </GlassCard>
          )
        })}
      </div>

      <div className="mt-12 glass rounded-3xl p-8">
        <p className="font-semibold text-white">Seasonal campaigns</p>
        <p className="text-white/60 mt-2">
          This section is ready for richer storytelling: banners, featured store carousels, and real-time countdowns.
        </p>
      </div>
    </div>
  )
}
