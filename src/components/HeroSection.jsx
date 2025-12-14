import { useState } from 'react'

export default function HeroSection() {
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.hash = 'malls'
    }
  }

  return (
    <section className="relative w-full h-96 md:h-screen md:min-h-[500px] flex items-center bg-gradient-to-br from-navy to-navy/90 overflow-hidden">
      {/* Background Image Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20 lazy"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1567521464027-f127ff144326?w=1600&h=900&fit=crop)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 lg:px-8 py-12 md:py-0">
        <div className="text-center">
          {/* Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-display font-bold text-cream mb-4 md:mb-6">
            Explore Shopping Malls
            <br className="hidden sm:block" />
            <span className="text-gold">in Samarkand</span>
          </h1>

          {/* Subheading */}
          <p className="text-base sm:text-lg md:text-xl text-cream text-opacity-90 mb-8 md:mb-10 max-w-2xl mx-auto">
            Discover the finest shopping destinations with premium brands, entertainment, and dining experiences
          </p>

          {/* Search Bar */}
          <form
            onSubmit={handleSearch}
            className="max-w-md mx-auto flex gap-2"
          >
            <div className="flex-grow relative">
              <input
                type="text"
                placeholder="Search malls..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 rounded-lg text-navy placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold"
                aria-label="Search malls"
              />
            </div>
            <button
              type="submit"
              className="button-primary px-6 py-3 rounded-lg"
              aria-label="Search"
            >
              Search
            </button>
          </form>

          {/* CTA */}
          <div className="mt-8 md:mt-12">
            <a
              href="#malls"
              className="inline-block button-secondary"
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
