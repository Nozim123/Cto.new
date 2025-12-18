import { useEffect, useRef, useState } from 'react'
import { useTheme } from '../contexts/ThemeContext'
import { useLanguage } from '../contexts/LanguageContext'
import { useUser } from '../contexts/UserContext'

export default function AuthModal({ isOpen, onClose }) {
  const { darkMode } = useTheme()
  const { t } = useLanguage()
  const { login } = useUser()

  const modalRef = useRef(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) onClose()
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div
        ref={modalRef}
        className={`w-full max-w-md rounded-3xl border shadow-2xl overflow-hidden ${
          darkMode ? 'bg-gray-900 border-white/10 text-white' : 'bg-white border-gray-200 text-gray-900'
        }`}
      >
        <div className={`px-6 py-5 border-b ${darkMode ? 'border-white/10' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
              {t('auth.title') || 'Sign in'}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                darkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-50 hover:bg-gray-100'
              } transition-colors`}
              aria-label={t('common.close') || 'Close'}
            >
              ✕
            </button>
          </div>
          <p className={`${darkMode ? 'text-white/70' : 'text-gray-600'} text-sm mt-2`}>
            {t('auth.subtitle') || 'Create a profile to sync favorites and get personalized deals.'}
          </p>
        </div>

        <form
          className="p-6 space-y-4"
          onSubmit={(e) => {
            e.preventDefault()
            const finalName = name.trim() || 'User'
            const finalEmail = email.trim() || `user${Date.now()}@example.com`

            login(
              {
                id: `user-${Date.now()}`,
                name: finalName,
                email: finalEmail,
                role: 'user'
              },
              `user_token_${Date.now()}`
            )

            onClose()
          }}
        >
          <div>
            <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-white/80' : 'text-gray-700'}`}>
              {t('auth.name') || 'Name'}
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full px-4 py-3 rounded-2xl border outline-none focus:ring-2 focus:ring-purple-500/40 ${
                darkMode
                  ? 'bg-white/5 border-white/10 text-white placeholder:text-white/50'
                  : 'bg-white border-gray-200 text-gray-900 placeholder:text-gray-400'
              }`}
              placeholder={t('auth.namePlaceholder') || 'Your name'}
            />
          </div>

          <div>
            <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-white/80' : 'text-gray-700'}`}>
              {t('auth.email') || 'Email'}
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full px-4 py-3 rounded-2xl border outline-none focus:ring-2 focus:ring-purple-500/40 ${
                darkMode
                  ? 'bg-white/5 border-white/10 text-white placeholder:text-white/50'
                  : 'bg-white border-gray-200 text-gray-900 placeholder:text-gray-400'
              }`}
              placeholder={t('auth.emailPlaceholder') || 'you@example.com'}
              type="email"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-purple-700 text-white font-semibold shadow-lg hover:from-purple-400 hover:to-purple-600 transition-all"
          >
            {t('auth.continue') || 'Continue'}
          </button>

          <button
            type="button"
            onClick={onClose}
            className={`w-full py-3 rounded-2xl border font-semibold transition-colors ${
              darkMode
                ? 'border-white/10 bg-white/5 hover:bg-white/10 text-white'
                : 'border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-900'
            }`}
          >
            {t('auth.notNow') || 'Not now'}
          </button>
        </form>
      </div>
    </div>
  )
}
