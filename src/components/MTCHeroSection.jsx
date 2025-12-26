import { useState, useEffect } from 'react'
import { ChevronRight, Sparkles, Navigation, MapPin, Store } from 'lucide-react'

/**
 * MTC Premium Hero Section
 * 
 * Features:
 * - Cinematic full-width background with parallax
 * - Elegant gradient overlay
 * - Premium typography
 * - Smooth micro-animations
 * - Mobile-optimized
 */

export default function MTCHeroSection() {
  const [scrollY, setScrollY] = useState(0)
  const [imageLoaded, setImageLoaded] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const backgroundImages = [
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1920&h=1080&fit=crop',
    'https://images.unsplash.com/photo-1580136579312-94651dfd596d?w=1920&h=1080&fit=crop',
    'https://images.unsplash.com/photo-1567521464027-f127ff144326?w=1920&h=1080&fit=crop'
  ]

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background Image with Parallax */}
      <div 
        className="absolute inset-0"
        style={{
          transform: `translateY(${scrollY * 0.3}px)`,
          transition: 'transform 0.1s ease-out'
        }}
      >
        {backgroundImages.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`Mall background ${index + 1}`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ 
              opacity: index === 0 ? 1 : 0,
              filter: 'brightness(0.4) contrast(1.1)'
            }}
            onLoad={() => setImageLoaded(true)}
          />
        ))}
      </div>

      {/* Premium Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-[rgba(37,40,54,1)]" />

      {/* MTC Particle Effects Layer */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/5 to-transparent" />

      {/* Hero Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        {/* Premium Badge */}
        <div className="mb-6 animate-mtc-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
            <Sparkles size={16} className="text-yellow-400" />
            <span className="text-sm font-medium text-white/90 tracking-wide">
              Premium Shopping Experience
            </span>
          </div>
        </div>

        {/* Main Headline */}
        <h1 
          className="mtc-heading-xl mb-6 animate-mtc-slide-up"
          style={{ animationDelay: '0.2s' }}
        >
          <span className="mtc-gradient-text">
            Explore Samarkand Malls
          </span>
        </h1>

        {/* Subtitle */}
        <p 
          className="mtc-body-lg max-w-2xl mx-auto mb-10 animate-mtc-slide-up"
          style={{ animationDelay: '0.3s' }}
        >
          Discover the finest shopping destinations in the heart of Uzbekistan. 
          From luxury boutiques to traditional crafts, experience shopping like never before.
        </p>

        {/* CTA Buttons */}
        <div 
          className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-mtc-slide-up"
          style={{ animationDelay: '0.4s' }}
        >
          {/* Primary CTA - Browse Malls */}
          <button className="mtc-button-primary flex items-center gap-2 group">
            <Store size={20} />
            Browse Malls
            <ChevronRight 
              size={18} 
              className="group-hover:translate-x-1 transition-transform"
            />
          </button>

          {/* Secondary CTA - Virtual Tour */}
          <button className="mtc-button-secondary flex items-center gap-2 group">
            <Navigation size={20} />
            Virtual Tour
            <ChevronRight 
              size={18} 
              className="group-hover:translate-x-1 transition-transform"
            />
          </button>

          {/* Tertiary CTA - Map */}
          <button 
            className="mtc-button-ghost flex items-center gap-2"
            onClick={() => window.location.href = '/map'}
          >
            <MapPin size={18} />
            Open Map
          </button>
        </div>

        {/* Stats Row */}
        <div 
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 animate-mtc-slide-up"
          style={{ animationDelay: '0.5s' }}
        >
          <StatItem number="6+" label="Malls" />
          <StatItem number="500+" label="Shops" />
          <StatItem number="10K+" label="Products" />
          <StatItem number="50K+" label="Visitors" />
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2">
          <div className="w-1.5 h-1.5 rounded-full bg-white/50 animate-pulse" />
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[rgba(37,40,54,1)] to-transparent" />
    </section>
  )
}

/**
 * Stat Item Component
 */
function StatItem({ number, label }) {
  return (
    <div className="text-center p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors duration-300">
      <div className="mtc-gradient-text-gold text-3xl md:text-4xl font-bold mb-2">
        {number}
      </div>
      <div className="mtc-caption text-white/60">
        {label}
      </div>
    </div>
  )
}
