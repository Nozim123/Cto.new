import { useState } from 'react'
import { useTheme } from '../contexts/ThemeContext'
import { useLanguage } from '../contexts/LanguageContext'

export default function HeroSection() {
  const [searchQuery, setSearchQuery] = useState('')
  const { darkMode, seasonalColors } = useTheme()
  const { t } = useLanguage()

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.hash = 'malls'
    }
  }

  return (
    <section className={`relative w-full h-96 md:h-screen md:min-h-[500px] flex items-center overflow-hidden transition-colors duration-300 ${
      darkMode 
        ? 'bg-slate-900' 
        : 'bg-slate-800'
    }`}>
      {/* Background Image Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30 lazy"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1567521464027-f127ff144326?w=1600&h=900&fit=crop)',
        }}
      />

      {/* Gradient Overlay with Seasonal Color */}
      <div 
        className="absolute inset-0 opacity-20 mix-blend-overlay"
        style={{
          background: `linear-gradient(135deg, ${seasonalColors.primary} 0%, transparent 50%)`
        }}
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 lg:px-8 py-12 md:py-0">
        <div className="text-center">
          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-display font-bold text-white mb-4 md:mb-6 fade-in-up drop-shadow-lg">
            {t('heroTitle')}
          </h1>

          {/* Subheading */}
          <p className="text-base sm:text-lg md:text-xl text-slate-200 mb-8 md:mb-10 max-w-2xl mx-auto fade-in-up-delay-1 drop-shadow-md">
            {t('heroSubtitle')}
          </p>

          {/* Search Bar */}
          <form
            onSubmit={handleSearch}
            className="max-w-md mx-auto flex gap-2 fade-in-up-delay-2"
          >
            <div className="flex-grow relative">
              <input
                type="text"
                placeholder={t('search')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full px-4 py-3 rounded-xl placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-300 shadow-xl ${
                  darkMode 
                    ? 'bg-slate-800/80 text-white backdrop-blur-sm border border-slate-700' 
                    : 'bg-white/90 text-slate-800 backdrop-blur-sm border-0'
                }`}
                aria-label="Search malls"
              />
            </div>
            <button
              type="submit"
              className="button-primary px-6 py-3 rounded-xl button-3d"
              aria-label="Search"
            >
              {t('search')}
            </button>
          </form>

          {/* CTA */}
          <div className="mt-8 md:mt-12 fade-in-up-delay-3">
            <a
              href="#malls"
              className="inline-block px-8 py-3 border-2 border-cyan-400 text-cyan-400 font-bold rounded-xl transition-all duration-300 hover:bg-cyan-400 hover:text-slate-900 hover:scale-105 active:scale-95 shadow-lg shadow-cyan-900/50"
            >
              {t('exploreMalls')} ↓
            </a>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 hidden md:block animate-bounce">
        <svg
          className="w-6 h-6 text-cyan-400"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  )
}
