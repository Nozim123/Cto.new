import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Bell, History, Shield, Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'

import { useUser } from '../contexts/UserContext'
import useFavorites from '../hooks/useFavorites'
import useTrending from '../hooks/useTrending'

import GlassCard from '../components/ui/GlassCard'
import SectionHeader from '../components/ui/SectionHeader'
import AnimatedCounter from '../components/ui/AnimatedCounter'

export default function ProfilePage() {
  const { user, isAuthenticated, updateProfile, logout } = useUser()
  const { counts } = useFavorites()
  const { getTop } = useTrending()

  const [name, setName] = useState(user?.name || '')
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '')

  useEffect(() => {
    setName(user?.name || '')
    setAvatarUrl(user?.avatarUrl || '')
  }, [user])

  const activity = useMemo(() => {
    if (!user) return []
    try {
      return JSON.parse(localStorage.getItem(`sme_activity:${user.id}`) || '[]')
    } catch {
      return []
    }
  }, [user])

  const analytics = useMemo(() => {
    return {
      malls: getTop('malls', 1)[0]?.score || 0,
      stores: getTop('stores', 1)[0]?.score || 0,
      products: getTop('products', 1)[0]?.score || 0,
    }
  }, [getTop])

  const save = (e) => {
    e.preventDefault()
    updateProfile({ name: name.trim(), avatarUrl: avatarUrl.trim() })
    toast.success('Profile updated')
  }

  if (!isAuthenticated) {
    return (
      <div className="section-padding max-w-6xl mx-auto">
        <SectionHeader
          eyebrow="Profile"
          title="Your dashboard"
          description="Sign in to save favorites, unlock personalization, and track your activity history."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <GlassCard className="p-8">
            <p className="font-semibold text-white">New here?</p>
            <p className="text-white/60 mt-2">Create an account in seconds.</p>
            <Link to="/register" className="button-primary mt-6 inline-block">
              Register
            </Link>
          </GlassCard>
          <GlassCard className="p-8">
            <p className="font-semibold text-white">Already have an account?</p>
            <p className="text-white/60 mt-2">Sign in to continue.</p>
            <Link to="/login" className="button-secondary mt-6 inline-block">
              Sign in
            </Link>
          </GlassCard>
        </div>
      </div>
    )
  }

  return (
    <div className="section-padding max-w-6xl mx-auto">
      <SectionHeader
        eyebrow="Profile"
        title={`Welcome, ${user?.name}`}
        description="Your personalized dashboard: favorites, activity history, and notifications."
        right={
          <button type="button" onClick={logout} className="button-ghost">
            Sign out
          </button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassCard className="p-6 lg:col-span-1">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-white/60 text-sm">Account</p>
              <p className="text-white font-semibold mt-1">{user.email}</p>
              <p className="text-white/50 text-sm mt-1">Role: {user.role}</p>
            </div>
            <div className="w-12 h-12 rounded-2xl overflow-hidden bg-white/10 border border-white/10 flex items-center justify-center">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-white font-semibold">{user.name?.charAt(0) || 'U'}</span>
              )}
            </div>
          </div>

          <form onSubmit={save} className="mt-6 space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm text-white/70 mb-2">
                Display name
              </label>
              <input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-neonCyan/50"
              />
            </div>
            <div>
              <label htmlFor="avatar" className="block text-sm text-white/70 mb-2">
                Avatar URL
              </label>
              <input
                id="avatar"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://…"
                className="w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-neonCyan/50"
              />
            </div>
            <button type="submit" className="button-primary w-full">
              Save changes
            </button>
          </form>

          <div className="mt-6 rounded-2xl bg-white/5 border border-white/10 p-4">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-neonCyan" />
              <p className="text-white/80 font-semibold">Security</p>
            </div>
            <p className="text-white/60 text-sm mt-2">
              This demo stores user profiles locally. The architecture is ready for JWT-backed authentication and role-based permissions.
            </p>
          </div>
        </GlassCard>

        <GlassCard className="p-6 lg:col-span-2">
          <p className="text-xs tracking-[0.25em] uppercase text-neonPink/80">Dashboard</p>
          <h2 className="heading-small mt-3">Your activity</h2>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
              <p className="text-white/60 text-sm">Saved malls</p>
              <p className="text-white text-3xl font-semibold mt-2">
                <AnimatedCounter value={counts.malls} />
              </p>
            </div>
            <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
              <p className="text-white/60 text-sm">Saved stores</p>
              <p className="text-white text-3xl font-semibold mt-2">
                <AnimatedCounter value={counts.stores} />
              </p>
            </div>
            <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
              <p className="text-white/60 text-sm">Saved products</p>
              <p className="text-white text-3xl font-semibold mt-2">
                <AnimatedCounter value={counts.products} />
              </p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
              <p className="text-white/60 text-sm">Top mall interactions</p>
              <p className="text-white text-3xl font-semibold mt-2">
                <AnimatedCounter value={analytics.malls} />
              </p>
            </div>
            <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
              <p className="text-white/60 text-sm">Top store interactions</p>
              <p className="text-white text-3xl font-semibold mt-2">
                <AnimatedCounter value={analytics.stores} />
              </p>
            </div>
            <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
              <p className="text-white/60 text-sm">Top product interactions</p>
              <p className="text-white text-3xl font-semibold mt-2">
                <AnimatedCounter value={analytics.products} />
              </p>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-3xl bg-white/5 border border-white/10 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-neonCyan" />
                  <p className="font-semibold text-white">Notification center</p>
                </div>
                <Link to="/" className="text-white/60 hover:text-white text-sm">
                  Explore
                </Link>
              </div>
              <p className="text-white/60 text-sm mt-2">Reminders, deals, and personalized updates appear here.</p>
              <p className="text-white/50 text-xs mt-2">Use the bell icon in the top navigation.</p>
            </div>

            <div className="rounded-3xl bg-white/5 border border-white/10 p-6">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-neonPink" />
                <p className="font-semibold text-white">Onboarding</p>
              </div>
              <p className="text-white/60 text-sm mt-2">Your actions power smarter recommendations across Discover.</p>
              <Link to="/discover" className="button-secondary mt-4 inline-flex">
                Open Discover
              </Link>
            </div>
          </div>

          <div className="mt-8">
            <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-white/60" />
              <p className="font-semibold text-white">Activity history</p>
            </div>

            <div className="mt-4 space-y-3">
              {activity.length === 0 ? (
                <p className="text-white/60 text-sm">No activity yet. Explore a mall or store to generate history.</p>
              ) : (
                activity.slice(0, 10).map((a) => (
                  <div key={a.id} className="rounded-2xl bg-white/5 border border-white/10 px-4 py-3">
                    <p className="text-white/80 text-sm font-semibold">{a.title || a.type}</p>
                    <p className="text-white/50 text-xs mt-1">{new Date(a.createdAt).toLocaleString()}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </GlassCard>
      </div>

      <div className="mt-10 flex flex-wrap gap-2">
        <Link to="/favorites" className="button-secondary">
          View favorites
        </Link>
        <Link to="/discover" className="button-primary">
          Discover
        </Link>
        <a href="/admin/login" className="button-ghost">
          Admin panel
        </a>
      </div>
    </div>
  )
}
