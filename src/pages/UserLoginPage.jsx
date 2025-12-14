import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

import { useUser } from '../contexts/UserContext'
import GlassCard from '../components/ui/GlassCard'
import SectionHeader from '../components/ui/SectionHeader'

export default function UserLoginPage() {
  const { login } = useUser()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const res = await login({ email, password })
    setLoading(false)

    if (!res.success) {
      toast.error(res.error)
      return
    }

    toast.success('Welcome back')
    navigate('/profile')
  }

  return (
    <div className="section-padding max-w-6xl mx-auto">
      <SectionHeader
        eyebrow="Sign in"
        title="Welcome back"
        description="Sign in to save favorites, post reviews, and unlock smarter recommendations."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <GlassCard className="p-8">
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm text-white/70 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-neonCyan/50"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm text-white/70 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-neonCyan/50"
                required
              />
            </div>

            <button type="submit" className="button-primary w-full" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign in'}
            </button>

            <p className="text-white/60 text-sm">
              No account?{' '}
              <Link to="/register" className="text-white hover:text-neonCyan underline">
                Create one
              </Link>
            </p>
          </form>
        </GlassCard>

        <GlassCard className="p-8">
          <p className="text-xs tracking-[0.25em] uppercase text-white/50">Why sign in</p>
          <p className="heading-small mt-3">Unlock next-gen UX</p>
          <ul className="mt-4 space-y-3 text-white/70">
            <li>• Save and favorite malls, stores, and products</li>
            <li>• Personalized dashboard & activity history</li>
            <li>• Notification center & deals near you (future-ready)</li>
            <li>• Reviews and community highlights</li>
          </ul>
        </GlassCard>
      </div>
    </div>
  )
}
