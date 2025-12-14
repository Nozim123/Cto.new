import { useEffect, useMemo, useState } from 'react'
import { Bell, Check } from 'lucide-react'
import { useUser } from '../contexts/UserContext'
import GlassCard from './ui/GlassCard'

export default function NotificationCenter() {
  const { user } = useUser()
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    if (!user) {
      setNotifications([])
      return
    }

    try {
      const raw = localStorage.getItem(`sme_notifications:${user.id}`)
      setNotifications(raw ? JSON.parse(raw) : [])
    } catch {
      setNotifications([])
    }
  }, [user, open])

  const unreadCount = useMemo(() => notifications.filter((n) => !n.read).length, [notifications])

  const markAllRead = () => {
    if (!user) return
    const next = notifications.map((n) => ({ ...n, read: true }))
    setNotifications(next)
    localStorage.setItem(`sme_notifications:${user.id}`, JSON.stringify(next))
  }

  if (!user) return null

  return (
    <div className="relative">
      <button
        type="button"
        className="relative button-ghost"
        aria-label="Notifications"
        onClick={() => setOpen((v) => !v)}
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-neonPink text-midnight text-xs font-bold flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <GlassCard className="absolute right-0 mt-3 w-80 max-w-[90vw] overflow-hidden">
          <div className="p-4 flex items-center justify-between border-b border-white/10">
            <p className="font-semibold text-white">Notifications</p>
            <button
              type="button"
              onClick={markAllRead}
              className="text-xs text-white/70 hover:text-white inline-flex items-center gap-1"
            >
              <Check className="w-4 h-4" />
              Mark all read
            </button>
          </div>

          <div className="max-h-96 overflow-auto">
            {notifications.length === 0 ? (
              <p className="p-4 text-sm text-white/60">No notifications yet.</p>
            ) : (
              <ul className="divide-y divide-white/10">
                {notifications.map((n) => (
                  <li key={n.id} className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className={`font-semibold ${n.read ? 'text-white/80' : 'text-white'}`}>{n.title}</p>
                        <p className="text-sm text-white/60 mt-1">{n.message}</p>
                      </div>
                      {!n.read && <span className="w-2 h-2 rounded-full bg-neonCyan mt-2" aria-hidden="true" />}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </GlassCard>
      )}
    </div>
  )
}
