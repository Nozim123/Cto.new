import { useEffect, useRef } from 'react'
import { ArrowDown, Sparkles } from 'lucide-react'
import AutoSuggestSearch from './AutoSuggestSearch'
import malls from '../data/malls.json'
import stores from '../data/stores.json'
import products from '../data/products.json'

export default function HeroSection() {
  const bgRef = useRef(null)

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || 0
      if (bgRef.current) bgRef.current.style.transform = `translateY(${y * 0.12}px)`
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section className="relative w-full min-h-[520px] md:min-h-[720px] flex items-center overflow-hidden bg-midnight">
      {/* Ambient gradients */}
      <div className="absolute inset-0 bg-hero-gradient" aria-hidden="true" />

      {/* Background image */}
      <div
        ref={bgRef}
        className="absolute inset-0 opacity-20 scale-110"
        style={{
          backgroundImage:
            'url(https://images.unsplash.com/photo-1567521464027-f127ff144326?w=1800&h=1200&fit=crop)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          willChange: 'transform',
        }}
        aria-hidden="true"
      />

      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-midnight" aria-hidden="true" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 lg:px-8 py-14">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-4 py-2 text-sm text-white/70">
            <Sparkles className="w-4 h-4 text-neonCyan" aria-hidden="true" />
            Ultra-modern discovery • Personalized • Future-ready
          </div>

          <h1 className="mt-6 heading-large">
            Discover malls, stores, products, and experiences
            <span className="block text-white/70 mt-3 text-2xl md:text-3xl font-semibold">
              in Samarkand — curated like a world-class platform.
            </span>
          </h1>

          <p className="mt-6 text-white/70 text-lg leading-relaxed">
            Smart suggestions, trending picks, virtual tours, interactive maps, and a premium dark UI — built for speed and delight.
          </p>

          <div className="mt-8">
            <AutoSuggestSearch malls={malls} stores={stores} products={products} />
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a href="#discover" className="button-primary">
              Explore Discover
            </a>
            <a href="#malls" className="button-secondary">
              Browse malls
            </a>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 hidden md:flex flex-col items-center gap-2 text-white/60">
        <ArrowDown className="w-5 h-5 animate-bounce" aria-hidden="true" />
        <span className="text-xs tracking-[0.25em] uppercase">Scroll</span>
      </div>
    </section>
  )
}
