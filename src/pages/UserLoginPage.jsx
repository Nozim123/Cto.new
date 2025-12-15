import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTheme } from '../contexts/ThemeContext'
import { useUserAuth } from '../contexts/UserAuthContext'

export default function UserLoginPage() {
  const { darkMode } = useTheme()
  const { login } = useUserAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    const result = await login({ email, password })
    setSubmitting(false)

    if (result.success) {
      navigate('/profile')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16">
      <div className={`w-full max-w-md rounded-2xl p-8 card-shadow ${darkMode ? 'bg-gray-800 glass-card-dark' : 'bg-white glass-card'}`}>
        <h1 className="font-display text-3xl font-bold mb-2">Welcome back</h1>
        <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-8`}>
          Sign in to save favorites, get personalized recommendations, and access your dashboard.
        </p>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Email
            </label>
            <input
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg text-navy focus:outline-none focus:ring-2 focus:ring-gold"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Password
            </label>
            <input
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg text-navy focus:outline-none focus:ring-2 focus:ring-gold"
              placeholder="••••••••"
            />
          </div>

          <button type="submit" className="button-primary button-3d w-full" disabled={submitting}>
            {submitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <div className="mt-6 flex items-center justify-between text-sm">
          <Link to="/register" className="text-gold font-semibold hover:text-gold/80">
            Create an account
          </Link>
          <Link to="/" className={`${darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-800'}`}>
            Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}
