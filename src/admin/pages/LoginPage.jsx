import React, { useState } from 'react'
import { LogIn, Eye, EyeOff, Shield } from 'lucide-react'

import { useAuth } from '../hooks/useAuth'

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: 'admin@samarkand.com',
    password: 'admin123',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    const result = await login(formData)
    if (result.success) {
      window.location.href = '/admin/dashboard'
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-midnight flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-hero-gradient opacity-80" aria-hidden="true" />

      <div className="relative w-full max-w-md">
        <div className="glass-strong rounded-3xl overflow-hidden border border-white/10 shadow-glass">
          <div className="p-8 border-b border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs tracking-[0.25em] uppercase text-white/60">Admin</p>
                <h1 className="text-3xl font-semibold text-white mt-3">Samarkand Mall Explorer</h1>
                <p className="text-white/60 mt-2">Secure login for content management</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center">
                <Shield className="w-6 h-6 text-neonCyan" />
              </div>
            </div>
          </div>

          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-white/70 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-neonCyan/50"
                  placeholder="admin@samarkand.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-white/70 mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 pr-12 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-neonCyan/50"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full button-primary inline-flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {isLoading ? 'Signing in…' : (
                  <>
                    <LogIn className="w-5 h-5" />
                    Sign in
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 rounded-2xl bg-white/5 border border-white/10 p-4">
              <p className="text-sm text-white/70 font-semibold">Demo credentials</p>
              <p className="text-xs text-white/60 mt-2">Email: admin@samarkand.com</p>
              <p className="text-xs text-white/60">Password: admin123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
