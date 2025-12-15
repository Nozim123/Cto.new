import { useTheme } from '../contexts/ThemeContext'
import SmartSearch from './SmartSearch'

export default function HeroSection() {
  const { darkMode, seasonalColors } = useTheme()

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
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-display font-bold text-cream mb-4 md:mb-6 fade-in-up">
            Explore Shopping Malls
            <br className="hidden sm:block" />
            <span className="text-gold">in Samarkand</span>
          </h1>

          {/* Subheading */}
          <p className="text-base sm:text-lg md:text-xl text-cream text-opacity-90 mb-8 md:mb-10 max-w-2xl mx-auto fade-in-up-delay-1">
            Discover the finest shopping destinations with premium brands, entertainment, and dining experiences
          </p>

          {/* Smart Search */}
          <div className="max-w-md mx-auto fade-in-up-delay-2">
            <SmartSearch />
          </div>

          {/* CTA */}
          <div className="mt-8 md:mt-12 fade-in-up-delay-3">
            <a
              href="#malls"
              className={`inline-block px-8 py-3 border-2 font-semibold rounded-lg transition-all duration-300 hover:scale-105 active:scale-95 ${
                darkMode
                  ? 'border-cream text-cream hover:bg-cream hover:text-navy'
                  : 'border-cream text-cream hover:bg-cream hover:text-navy'
              }`}
            >
              Browse Malls ↓
            </a>
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
