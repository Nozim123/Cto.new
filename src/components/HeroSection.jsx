import { useState } from 'react'
import { useTheme } from '../contexts/ThemeContext'

export default function HeroSection() {
  const [searchQuery, setSearchQuery] = useState('')
  const { darkMode, seasonalColors } = useTheme()

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.hash = 'malls'
    }
  }

  return (
    <section className={`relative w-full h-96 md:h-screen md:min-h-[500px] flex items-center overflow-hidden transition-colors duration-300 ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 to-gray-800' 
        : 'bg-gradient-to-br from-navy to-navy/90'
    }`}>
      {/* Background Image Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20 lazy"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1567521464027-f127ff144326?w=1600&h=900&fit=crop)',
        }}
      />

      {/* Gradient Overlay with Seasonal Color */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          background: `linear-gradient(135deg, ${seasonalColors.primary} 0%, transparent 50%)`
        }}
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 lg:px-8 py-12 md:py-0">
        <div className="text-center">
          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-display font-bold text-cream mb-4 md:mb-6">
            <span className="text-purple-300">
              Mega Travel Center
            </span>
            <br className="hidden sm:block" />
            <span className="text-gold">Premium Digital Experience</span>
          </h1>

          {/* Subheading */}
          <p className="text-base sm:text-lg md:text-xl text-cream text-opacity-90 mb-8 md:mb-10 max-w-2xl mx-auto">
            Discover the finest shopping destinations in historic Samarkand
          </p>

          {/* Search Bar */}
          <form
            onSubmit={handleSearch}
            className="max-w-md mx-auto flex gap-2 fade-in-up-delay-2"
          >
            <div className="flex-grow relative">
              <input
                type="text"
                placeholder="Search malls..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full px-4 py-3 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold transition-all duration-300 ${
                  darkMode 
                    ? 'bg-gray-800/70 text-cream backdrop-blur-sm' 
                    : 'bg-white text-navy'
                }`}
                aria-label="Search malls"
              />
            </div>
            <button 
              type="submit"
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold"
            >
              Search
            </button>
          </form>

          {/* CTA */}
          <div className="mt-8 md:mt-12">
            <button 
              onClick={() => window.location.hash = 'malls'} 
              className="px-8 py-4 border-2 border-cream text-cream rounded-lg hover:bg-cream hover:text-navy transition-colors font-semibold text-lg"
            >
              <span>Browse Malls</span>
              <span className="ml-2">↓</span>
            </button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 hidden md:block animate-bounce">
        <svg
          className="w-6 h-6 text-gold"
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
