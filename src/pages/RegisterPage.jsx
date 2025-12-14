import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

import { useUser } from '../contexts/UserContext'
import GlassCard from '../components/ui/GlassCard'
import SectionHeader from '../components/ui/SectionHeader'

export default function RegisterPage() {
  const { register } = useUser()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const res = await register({ name, email, password })
    setLoading(false)

    if (!res.success) {
      toast.error(res.error)
      return
    }

    toast.success('Account created')
    navigate('/profile')
  }

  return (
    <div className="section-padding max-w-6xl mx-auto">
      <SectionHeader
        eyebrow="Registration"
        title="Create your profile"
        description="Join to unlock personalization, favorites, reviews, and future-ready features like voice search and AR previews."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <GlassCard className="p-8">
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm text-white/70 mb-2">
                Full name
              </label>
              <input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-neonCyan/50"
                required
              />
            </div>

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
              <p className="text-xs text-white/45 mt-2">
                Demo: credentials are stored locally. Production should use secure server authentication + JWT.
              </p>
            </div>

            <button type="submit" className="button-primary w-full" disabled={loading}>
              {loading ? 'Creating…' : 'Create account'}
            </button>

            <p className="text-white/60 text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-white hover:text-neonCyan underline">
                Sign in
              </Link>
            </p>
          </form>
        </GlassCard>

        <GlassCard className="p-8">
          <p className="text-xs tracking-[0.25em] uppercase text-white/50">Onboarding</p>
          <p className="heading-small mt-3">What you get</p>
          <div className="mt-4 space-y-3 text-white/70">
            <p>• Save and favorite malls, stores, and products</p>
            <p>• Personalized dashboard, insights, and history</p>
            <p>• Review system with photos</p>
            <p>• Notification center + deals near you (future-ready)</p>
          </div>
        </GlassCard>
      </div>
    </div>
  )
}
