import { useEffect, useMemo, useRef, useState } from 'react'
import { useLanguage } from '../contexts/LanguageContext'

export default function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage()
  const [open, setOpen] = useState(false)

  const buttonRef = useRef(null)
  const dropdownRef = useRef(null)

  const languages = useMemo(
    () => [
      { code: 'uz', name: "O'zbek", flag: '🇺🇿' },
      { code: 'ru', name: 'Русский', flag: '🇷🇺' },
      { code: 'en', name: 'English', flag: '🇺🇸' },
      { code: 'tr', name: 'Türkçe', flag: '🇹🇷' }
    ],
    []
  )

  const current = languages.find((lang) => lang.code === language) || languages[0]

  useEffect(() => {
    if (!open) return

    const onKeyDown = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }

    const isDesktop = window.matchMedia('(min-width: 640px)').matches

    const onPointerDown = (e) => {
      const btn = buttonRef.current
      const dropdown = dropdownRef.current
      if (!btn || !dropdown) return
      if (btn.contains(e.target) || dropdown.contains(e.target)) return
      setOpen(false)
    }

    window.addEventListener('keydown', onKeyDown)
    if (isDesktop) window.addEventListener('pointerdown', onPointerDown)

    return () => {
      window.removeEventListener('keydown', onKeyDown)
      if (isDesktop) window.removeEventListener('pointerdown', onPointerDown)
    }
  }, [open])

  const selectLang = (code) => {
    setLanguage(code)
    setOpen(false)
  }

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="dialog"
        aria-expanded={open}
        className="flex items-center gap-2 px-2.5 sm:px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/20 backdrop-blur-md border border-gray-200 dark:border-white/20 transition-all duration-300"
      >
        <span className="text-lg" aria-hidden="true">
          {current.flag}
        </span>
        <span className="hidden sm:inline text-sm font-medium">{current.name}</span>
        <svg
          className={`w-4 h-4 ml-0.5 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Desktop dropdown */}
      {open ? (
        <div
          ref={dropdownRef}
          className="hidden sm:block absolute top-full left-0 mt-2 w-48 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg rounded-xl shadow-2xl border border-gray-200 dark:border-white/20 z-50"
          role="dialog"
          aria-label={t('settings.language')}
        >
          <div className="p-2">
            {languages.map((lang) => (
              <button
                key={lang.code}
                type="button"
                onClick={() => selectLang(lang.code)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-gradient-to-r hover:from-gold/20 hover:to-gold/10 ${
                  language === lang.code ? 'bg-gradient-to-r from-gold/30 to-gold/20 shadow-lg' : ''
                }`}
              >
                <span className="text-lg" aria-hidden="true">
                  {lang.flag}
                </span>
                <span className="font-medium">{lang.name}</span>
                {language === lang.code ? <span className="ml-auto w-2 h-2 bg-gold rounded-full" /> : null}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {/* Mobile bottom sheet */}
      {open ? (
        <div
          className="sm:hidden fixed inset-0 z-[70]"
          role="dialog"
          aria-modal="true"
          aria-label={t('settings.language')}
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/60"
            onClick={() => setOpen(false)}
            aria-label={t('common.close')}
          />

          <div className="absolute inset-x-0 bottom-0 rounded-t-2xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-t border-gray-200 dark:border-white/10 p-4 pb-6">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">{t('settings.language')}</p>
                <p className="text-base font-semibold text-gray-900 dark:text-white">
                  {current.flag} {current.name}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="px-3 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-200 bg-gray-100/80 dark:bg-gray-800/80"
              >
                {t('common.close')}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => selectLang(lang.code)}
                  className={`flex items-center gap-2 px-3 py-3 rounded-xl border transition-all ${
                    language === lang.code
                      ? 'border-gold/50 bg-gold/10'
                      : 'border-gray-200 bg-gray-50 dark:border-white/10 dark:bg-white/5'
                  }`}
                >
                  <span className="text-lg" aria-hidden="true">
                    {lang.flag}
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{lang.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
