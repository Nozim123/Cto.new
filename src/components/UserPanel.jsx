import { useMemo, useState } from 'react'
import { useTheme } from '../contexts/ThemeContext'
import { useLanguage } from '../contexts/LanguageContext'
import { useUser } from '../contexts/UserContext'

export default function UserPanel() {
  const { darkMode, toggleDarkMode } = useTheme()
  const { t, language, setLanguage } = useLanguage()
  const { user, setUser, prefs, setPrefs } = useUser()

  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState('profile')

  const [draft, setDraft] = useState(user)

  const baseCard = useMemo(
    () => (darkMode ? 'bg-gray-900/95 text-cream' : 'bg-white/95 text-navy'),
    [darkMode]
  )

  const save = () => {
    setUser(draft)
  }

  return (
    <>
      <button
        type="button"
        className={`fixed left-3 top-1/2 -translate-y-1/2 z-50 rounded-2xl px-3 py-3 shadow-xl backdrop-blur border transition-all duration-300 card-3d ${
          darkMode ? 'bg-gray-900/70 border-gray-700 text-cream' : 'bg-white/70 border-gray-200 text-navy'
        }`}
        onClick={() => setOpen(true)}
        aria-label={t('profile.title')}
      >
        <div className="flex flex-col items-center gap-1">
          <span className="text-xl">👤</span>
          <span className="text-[10px] font-semibold">{t('profile.title')}</span>
        </div>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/50"
          onClick={() => setOpen(false)}
          role="presentation"
        >
          <div
            className={`absolute left-0 top-0 h-full w-full max-w-md shadow-2xl border-r backdrop-blur ${baseCard} ${
              darkMode ? 'border-gray-700' : 'border-gray-200'
            }`}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="p-5 flex items-center justify-between">
              <div>
                <p className="text-sm opacity-80">{t('profile.title')}</p>
                <p className="font-display text-2xl font-bold">{draft.name || '—'}</p>
              </div>
              <button
                type="button"
                className="text-2xl leading-none hover:opacity-70 transition-opacity"
                onClick={() => setOpen(false)}
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div className="px-5">
              <div className={`grid grid-cols-2 rounded-xl overflow-hidden border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <button
                  type="button"
                  onClick={() => setTab('profile')}
                  className={`px-4 py-3 text-sm font-semibold transition-colors ${
                    tab === 'profile'
                      ? 'bg-gold text-navy'
                      : darkMode
                        ? 'bg-gray-800 hover:bg-gray-700'
                        : 'bg-white hover:bg-gray-50'
                  }`}
                >
                  {t('profile.title')}
                </button>
                <button
                  type="button"
                  onClick={() => setTab('settings')}
                  className={`px-4 py-3 text-sm font-semibold transition-colors ${
                    tab === 'settings'
                      ? 'bg-gold text-navy'
                      : darkMode
                        ? 'bg-gray-800 hover:bg-gray-700'
                        : 'bg-white hover:bg-gray-50'
                  }`}
                >
                  {t('profile.settings')}
                </button>
              </div>
            </div>

            {tab === 'profile' ? (
              <div className="p-5 space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">{t('profile.name')}</label>
                  <input
                    value={draft.name}
                    onChange={(e) => setDraft((p) => ({ ...p, name: e.target.value }))}
                    className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-gold ${
                      darkMode
                        ? 'bg-gray-800 border-gray-700 text-cream'
                        : 'bg-white border-gray-200 text-navy'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">{t('profile.email')}</label>
                  <input
                    value={draft.email}
                    onChange={(e) => setDraft((p) => ({ ...p, email: e.target.value }))}
                    className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-gold ${
                      darkMode
                        ? 'bg-gray-800 border-gray-700 text-cream'
                        : 'bg-white border-gray-200 text-navy'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">{t('profile.phone')}</label>
                  <input
                    value={draft.phone}
                    onChange={(e) => setDraft((p) => ({ ...p, phone: e.target.value }))}
                    className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-gold ${
                      darkMode
                        ? 'bg-gray-800 border-gray-700 text-cream'
                        : 'bg-white border-gray-200 text-navy'
                    }`}
                  />
                </div>

                <button type="button" className="button-primary button-3d w-full" onClick={save}>
                  {t('profile.save')}
                </button>
              </div>
            ) : (
              <div className="p-5 space-y-5">
                <div>
                  <p className="text-sm font-semibold mb-2">{t('profile.preferences')}</p>

                  <div className={`rounded-2xl border p-4 space-y-3 ${darkMode ? 'border-gray-700 bg-gray-800/40' : 'border-gray-200 bg-cream/40'}`}>
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-sm font-semibold">{t('profile.darkMode')}</span>
                      <button type="button" className="button-secondary button-3d px-4 py-2" onClick={toggleDarkMode}>
                        {darkMode ? 'ON' : 'OFF'}
                      </button>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                      <span className="text-sm font-semibold">Language</span>
                      <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className={`text-sm font-semibold rounded-lg px-3 py-2 border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gold ${
                          darkMode
                            ? 'bg-gray-800 border-gray-700 text-cream'
                            : 'bg-white border-gray-200 text-navy'
                        }`}
                        aria-label="Language"
                      >
                        <option value="uz">UZ</option>
                        <option value="ru">RU</option>
                        <option value="en">EN</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                      <span className="text-sm font-semibold">{t('profile.animations')}</span>
                      <button
                        type="button"
                        className="button-secondary button-3d px-4 py-2"
                        onClick={() => setPrefs((p) => ({ ...p, animations: !p.animations }))}
                      >
                        {prefs.animations ? 'ON' : 'OFF'}
                      </button>
                    </div>
                  </div>
                </div>

                <div className={`rounded-2xl p-4 ${darkMode ? 'bg-gray-800/40' : 'bg-cream/40'}`}>
                  <p className="text-xs opacity-80">
                    {prefs.animations
                      ? 'Animations are enabled for a more modern 3D experience.'
                      : 'Animations are reduced for better performance.'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
