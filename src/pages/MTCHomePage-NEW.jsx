import { useState, useEffect } from 'react'
import { ChevronRight, Sparkles, TrendingUp, Tag, Clock, MapPin, Store, Calendar, Navigation, Star, Users, ShoppingBag, Zap } from 'lucide-react'
import MTCMallCard from '../components/MTCMallCard'
import { MTCMallCardSkeleton } from '../components/MTCMallCard'
import MTCHeroSection from '../components/MTCHeroSection'
import mallsData from '../data/malls.json'

/**
 * MTC Premium Homepage
 * 
 * Ultra-premium landing page featuring:
 * - Cinematic hero with parallax
 * - Featured malls grid with 3D cards
 * - Current promotions carousel
 * - Popular shops section
 * - Events & attractions
 * - Interactive map preview
 * - Newsletter signup
 */

export default function MTCHomePage() {
  const [malls, setMalls] = useState([])
  const [featuredMalls, setFeaturedMalls] = useState([])
  const [loading, setLoading] = useState(true)
  const [activePromo, setActivePromo] = useState(0)

  useEffect(() => {
    const timer1 = setTimeout(() => {
      const allMalls = mallsData.filter(mall => mall.status === 'open')
      setMalls(allMalls)

      const timer2 = setTimeout(() => {
        setFeaturedMalls(allMalls.slice(0, 6))
        setLoading(false)
      }, 400)

      return () => clearTimeout(timer2)
    }, 600)

    return () => clearTimeout(timer1)
  }, [])

  const promotions = [
    {
      id: 1,
      title: 'Flash Sale: Up to 50% Off',
      subtitle: 'Selected items across all malls',
      expiry: '2h 30m',
      badge: '-50%',
      image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&h=400&fit=crop',
      mall: 'Makon Mall'
    },
    {
      id: 2,
      title: 'Festival Season Special',
      subtitle: 'Free delivery on orders over 500,000 UZS',
      expiry: '3 days',
      badge: 'FREE',
      image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&h=400&fit=crop',
      mall: 'Festival Mall'
    },
    {
      id: 3,
      title: 'VIP Member Exclusive',
      subtitle: 'Double points on all purchases',
      expiry: 'Limited time',
      badge: '2X',
      image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=600&h=400&fit=crop',
      mall: 'All Malls'
    }
  ]

  const popularShops = [
    {
      id: 1,
      name: 'ZARA',
      logo: 'https://logo.clearbit.com/zara.com',
      category: 'Fashion',
      mall: 'Makon Mall',
      rating: 4.7
    },
    {
      id: 2,
      name: 'Samsung',
      logo: 'https://logo.clearbit.com/samsung.com',
      category: 'Electronics',
      mall: 'Family Park',
      rating: 4.6
    },
    {
      id: 3,
      name: 'Nike',
      logo: 'https://logo.clearbit.com/nike.com',
      category: 'Sports',
      mall: 'Festival Mall',
      rating: 4.8
    },
    {
      id: 4,
      name: 'Apple Store',
      logo: 'https://logo.clearbit.com/apple.com',
      category: 'Electronics',
      mall: 'Makon Mall',
      rating: 4.9
    }
  ]

  const events = [
    {
      id: 1,
      title: 'Summer Music Festival',
      date: 'Dec 28, 2024',
      image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&h=300&fit=crop',
      mall: 'Festival Mall',
      category: 'Concert'
    },
    {
      id: 2,
      title: 'Kids Magic Show',
      date: 'Dec 30, 2024',
      image: 'https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?w=400&h=300&fit=crop',
      mall: 'Family Park',
      category: 'Entertainment'
    },
    {
      id: 3,
      title: 'Fashion Week',
      date: 'Jan 5, 2025',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
      mall: 'Makon Mall',
      category: 'Fashion'
    }
  ]

  const nextPromo = () => {
    setActivePromo((prev) => (prev + 1) % promotions.length)
  }

  const prevPromo = () => {
    setActivePromo((prev) => (prev - 1 + promotions.length) % promotions.length)
  }

  return (
    <div className="min-h-screen pb-24 md:pb-0">
      {/* Hero Section */}
      <MTCHeroSection />

      {/* Quick Actions - Mobile */}
      <section className="mtc-container mtc-section md:hidden">
        <div className="grid grid-cols-2 gap-3">
          <QuickActionButton
            icon={<MapPin size={20} />}
            label="Find Mall"
            onClick={() => window.location.href = '/map'}
          />
          <QuickActionButton
            icon={<TrendingUp size={20} />}
            label="Trending"
            onClick={() => window.location.href = '/promotions'}
          />
        </div>
      </section>

      {/* Current Promotions Carousel */}
      <section className="mtc-container mtc-section">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="mtc-heading-lg mb-2">Current Promotions</h2>
            <p className="mtc-body text-white/60">Limited time offers you don't want to miss</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="mtc-glass p-2 rounded-lg hover:bg-white/10 transition-colors" onClick={prevPromo}>
              <ChevronRight size={18} className="rotate-180" />
            </button>
            <button className="mtc-glass p-2 rounded-lg hover:bg-white/10 transition-colors" onClick={nextPromo}>
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Promo Carousel */}
        <div className="relative overflow-hidden rounded-3xl">
          <div 
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${activePromo * 100}%)` }}
          >
            {promotions.map((promo) => (
              <div key={promo.id} className="w-full flex-shrink-0">
                <div className="relative aspect-[21/9] md:aspect-[16/5] overflow-hidden rounded-3xl mtc-card group">
                  <img
                    src={promo.image}
                    alt={promo.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
                  
                  <div className="absolute inset-0 p-6 md:p-10 flex flex-col justify-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/20 backdrop-blur-md border border-blue-400/30 w-fit mb-4 animate-mtc-float">
                      <Tag size={14} className="text-blue-400" />
                      <span className="text-sm font-medium text-blue-300">{promo.badge}</span>
                    </div>
                    
                    <h3 className="mtc-heading-lg mb-2 max-w-lg">{promo.title}</h3>
                    <p className="mtc-body text-white/80 mb-4 max-w-md">{promo.subtitle}</p>
                    
                    <div className="flex items-center gap-4 text-white/60">
                      <div className="flex items-center gap-2">
                        <Clock size={14} />
                        <span className="mtc-caption">Ends in {promo.expiry}</span>
                      </div>
                      <span className="mtc-caption">at {promo.mall}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Carousel Dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {promotions.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === activePromo ? 'bg-blue-400 w-6' : 'bg-white/30 hover:bg-white/50'
                }`}
                onClick={() => setActivePromo(index)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Malls Grid */}
      <section className="mtc-container mtc-section">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="mtc-heading-lg mb-2">Featured Malls</h2>
            <p className="mtc-body text-white/60">Discover premium shopping destinations</p>
          </div>
          <button 
            className="mtc-button-secondary hidden md:flex items-center gap-2"
            onClick={() => window.location.href = '/stores'}
          >
            View All Malls
            <ChevronRight size={18} />
          </button>
        </div>

        <div className="mtc-grid mtc-grid-2 md:mtc-grid-3 lg:mtc-grid-3">
          {loading
            ? Array.from({ length: 6 }).map((_, index) => (
                <MTCMallCardSkeleton key={index} />
              ))
            : featuredMalls.map((mall, index) => (
                <MTCMallCard
                  key={mall.id}
                  mall={mall}
                  index={index}
                  delay={index * 0.1}
                />
              ))
          }
        </div>
      </section>

      {/* Stats Section */}
      <section className="mtc-container mtc-section">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatItem 
            icon={<Store size={24} />}
            number="6+" 
            label="Premium Malls"
            delay={0}
          />
          <StatItem 
            icon={<ShoppingBag size={24} />}
            number="500+" 
            label="Exclusive Shops"
            delay={0.1}
          />
          <StatItem 
            icon={<Users size={24} />}
            number="50K+" 
            label="Monthly Visitors"
            delay={0.2}
          />
          <StatItem 
            icon={<Star size={24} />}
            number="4.8" 
            label="Average Rating"
            delay={0.3}
          />
        </div>
      </section>

      {/* Popular Shops Section */}
      <section className="mtc-container mtc-section">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="mtc-heading-lg mb-2">Popular Shops</h2>
            <p className="mtc-body text-white/60">Trending stores across all malls</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {popularShops.map((shop) => (
            <div
              key={shop.id}
              className="mtc-card p-4 mtc-hover-lift cursor-pointer group"
            >
              <div className="aspect-square rounded-2xl bg-white/5 mb-4 overflow-hidden flex items-center justify-center group-hover:bg-white/10 transition-colors">
                <img
                  src={shop.logo}
                  alt={shop.name}
                  className="w-20 h-20 object-contain filter brightness-0 invert transition-transform group-hover:scale-110 duration-300"
                />
              </div>
              <h3 className="mtc-body font-semibold mb-1">{shop.name}</h3>
              <div className="flex items-center justify-between text-sm text-white/60">
                <span className="mtc-caption">{shop.category}</span>
                <div className="flex items-center gap-1">
                  <Star size={12} className="text-yellow-400 fill-yellow-400" />
                  <span>{shop.rating}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Events & Attractions */}
      <section className="mtc-container mtc-section">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="mtc-heading-lg mb-2">Events & Attractions</h2>
            <p className="mtc-body text-white/60">Upcoming entertainment and activities</p>
          </div>
          <button 
            className="mtc-button-secondary hidden md:flex items-center gap-2"
            onClick={() => window.location.href = '/events'}
          >
            All Events
            <ChevronRight size={18} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {events.map((event) => (
            <div
              key={event.id}
              className="mtc-card overflow-hidden mtc-hover-lift cursor-pointer group"
            >
              <div className="aspect-[16/10] overflow-hidden">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4">
                  <div className="mtc-badge mtc-badge-primary">{event.category}</div>
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 text-white/60 mb-2">
                  <Calendar size={14} />
                  <span className="mtc-caption">{event.date}</span>
                </div>
                <h3 className="mtc-heading-sm mb-2">{event.title}</h3>
                <p className="mtc-caption text-white/50 flex items-center gap-1">
                  <Navigation size={12} />
                  {event.mall}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Map Preview */}
      <section className="mtc-container mtc-section">
        <div className="relative rounded-3xl overflow-hidden mtc-card p-1">
          <div className="aspect-video rounded-2xl overflow-hidden bg-gradient-to-br from-blue-500/10 to-purple-500/10">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-400/30 mb-6">
                  <MapPin size={20} className="text-blue-400" />
                  <span className="text-sm font-medium text-blue-300">Interactive Map</span>
                </div>
                <h3 className="mtc-heading-md mb-2">Explore Malls on Map</h3>
                <p className="mtc-body text-white/70 mb-6">
                  Interactive map with all locations, real-time navigation, and turn-by-turn directions
                </p>
                <button
                  className="mtc-button-primary flex items-center gap-2"
                  onClick={() => window.location.href = '/map'}
                >
                  <MapPin size={18} />
                  Open Full Map
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="mtc-container mtc-section">
        <div className="rounded-3xl overflow-hidden mtc-glass p-8 md:p-12">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-400/30 mb-6">
              <Sparkles size={16} className="text-yellow-400" />
              <span className="text-sm font-medium text-yellow-300">Stay Updated</span>
            </div>
            
            <h2 className="mtc-heading-lg mb-4">Get Exclusive Offers</h2>
            <p className="mtc-body text-white/70 mb-8">
              Subscribe to receive personalized deals, event updates, and exclusive promotions from your favorite malls.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="mtc-input flex-1"
              />
              <button className="mtc-button-primary whitespace-nowrap flex items-center gap-2">
                <Zap size={18} />
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

/**
 * Quick Action Button Component
 */
function QuickActionButton({ icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="mtc-glass p-4 rounded-2xl flex flex-col items-center gap-2 hover:bg-white/10 transition-colors mtc-hover-lift"
    >
      <div className="text-blue-400">{icon}</div>
      <span className="mtc-caption text-white/80 font-medium">{label}</span>
    </button>
  )
}

/**
 * Stat Item Component
 */
function StatItem({ icon, number, label, delay = 0 }) {
  return (
    <div 
      className={`mtc-card p-5 text-center animate-mtc-slide-up mtc-hover-lift`}
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="text-blue-400 mb-3 justify-center flex">
        {icon}
      </div>
      <div className="mtc-gradient-text-gold text-3xl md:text-4xl font-bold mb-2">
        {number}
      </div>
      <div className="mtc-caption text-white/50">
        {label}
      </div>
    </div>
  )
}
