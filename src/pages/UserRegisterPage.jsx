import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTheme } from '../contexts/ThemeContext'
import { useUserAuth } from '../contexts/UserAuthContext'

export default function UserRegisterPage() {
  const { darkMode } = useTheme()
  const { register } = useUserAuth()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const passwordError = useMemo(() => {
    if (!password && !confirm) return null
    if (password.length > 0 && password.length < 6) return 'Password must be at least 6 characters'
    if (confirm && password !== confirm) return 'Passwords do not match'
    return null
  }, [password, confirm])

  const onSubmit = async (e) => {
    e.preventDefault()
    if (passwordError) return

    setSubmitting(true)
    const result = await register({ name, email, password })
    setSubmitting(false)

    if (result.success) {
      navigate('/onboarding')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16">
      <div className={`w-full max-w-lg rounded-2xl p-8 card-shadow ${darkMode ? 'bg-gray-800 glass-card-dark' : 'bg-white glass-card'}`}>
        <h1 className="font-display text-3xl font-bold mb-2">Create your profile</h1>
        <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-8`}>
          Unlock favorites, personalized discovery, and a premium dashboard experience.
        </p>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Name
            </label>
            <input
              type="text"
              autoComplete="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-lg text-navy focus:outline-none focus:ring-2 focus:ring-gold"
              placeholder="Your name"
            />
          </div>

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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Password
              </label>
              <input
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg text-navy focus:outline-none focus:ring-2 focus:ring-gold"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Confirm
              </label>
              <input
                type="password"
                autoComplete="new-password"
                required
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="w-full px-4 py-3 rounded-lg text-navy focus:outline-none focus:ring-2 focus:ring-gold"
                placeholder="••••••••"
              />
            </div>
          </div>

          {passwordError ? <p className="text-sm text-red-400">{passwordError}</p> : null}

          <button type="submit" className="button-primary button-3d w-full" disabled={submitting || !!passwordError}>
            {submitting ? 'Creating…' : 'Create account'}
          </button>
        </form>

        <div className="mt-6 flex items-center justify-between text-sm">
          <Link to="/login" className="text-gold font-semibold hover:text-gold/80">
            Already have an account?
          </Link>
          <Link to="/" className={`${darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-800'}`}>
            Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}
