import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useTheme } from '../contexts/ThemeContext'
import { useUserAuth } from '../contexts/UserAuthContext'
import storesData from '../data/stores.json'
import { getUserPreferences, saveUserPreferences } from '../services/preferences'

export default function OnboardingPage() {
  const { darkMode } = useTheme()
  const { user } = useUserAuth()
  const navigate = useNavigate()

  const categories = useMemo(
    () => Array.from(new Set(storesData.map((s) => s.category))).sort(),
    []
  )

  const initial = useMemo(() => getUserPreferences(user?.id), [user?.id])

  const [selected, setSelected] = useState(initial.interests || [])
  const [notificationOptIn, setNotificationOptIn] = useState(
    typeof initial.notificationOptIn === 'boolean' ? initial.notificationOptIn : true
  )

  const toggle = (category) => {
    setSelected((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    )
  }

  const complete = () => {
    const next = {
      ...initial,
      interests: selected,
      notificationOptIn,
      onboardingCompleted: true
    }

    saveUserPreferences(user?.id, next)
    toast.success('Preferences saved')
    navigate('/profile')
  }

  return (
    <div className="min-h-screen px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <div className={`rounded-2xl p-8 md:p-10 card-shadow ${darkMode ? 'bg-gray-800 glass-card-dark' : 'bg-white glass-card'}`}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="font-display text-3xl md:text-4xl font-bold">Onboarding</h1>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mt-2 max-w-2xl`}>
                Pick what you love — we’ll tailor Discover, Top Picks, and recommendations based on your interests.
              </p>
            </div>
            <button type="button" className="button-primary button-3d" onClick={complete}>
              Finish →
            </button>
          </div>

          <div className="mt-10">
            <p className={`text-sm font-semibold mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Interests
            </p>
            <div className="flex flex-wrap gap-3">
              {categories.map((c) => {
                const active = selected.includes(c)
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => toggle(c)}
                    className={`px-4 py-2 rounded-full border transition-all duration-200 button-3d ${
                      active
                        ? 'border-gold bg-gold/15 text-gold'
                        : darkMode
                          ? 'border-gray-700 text-gray-300 hover:border-gray-600'
                          : 'border-gray-200 text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {c}
                  </button>
                )
              })}
            </div>

            <div className={`mt-10 rounded-xl p-6 border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <p className={`font-semibold ${darkMode ? 'text-cream' : 'text-navy'}`}>
                    Personalized notifications
                  </p>
                  <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Opt in to receive alerts when deals match your favorites (demo).
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setNotificationOptIn((v) => !v)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors button-3d ${
                    notificationOptIn
                      ? 'bg-gold text-navy'
                      : darkMode
                        ? 'bg-gray-900/40 text-gray-300'
                        : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {notificationOptIn ? 'Enabled' : 'Disabled'}
                </button>
              </div>
            </div>

            <div className="mt-10 flex items-center justify-between flex-wrap gap-4">
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                You can change preferences anytime from your profile.
              </p>
              <button type="button" className="button-secondary button-3d" onClick={() => navigate('/')}>
                Skip for now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
