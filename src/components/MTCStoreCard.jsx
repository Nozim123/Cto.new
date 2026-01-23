import { useState } from 'react'
import { Clock, MapPin, Star, ArrowRight, Navigation, Store, Heart } from 'lucide-react'

/**
 * MTC Premium Store Card
 * 
 * Features:
 * - Clean, minimalist design
 * - Premium glassmorphism
 * - Banner image + Logo overlay
 * - Category badges
 * - Rating display
 * - Working hours status
 * - Floor/location indicator
 */

export default function MTCStoreCard({ store, onClick, delay = 0 }) {
  const [isHovered, setIsHovered] = useState(false)
  const [isWishlisted, setIsWishlisted] = useState(false)

  const getRatingColor = (rating) => {
    if (rating >= 4.5) return 'text-emerald-400'
    if (rating >= 4.0) return 'text-green-400'
    if (rating >= 3.5) return 'text-yellow-400'
    return 'text-orange-400'
  }

  const isOpenNow = () => {
    if (!store.workingHours) return true
    try {
      const now = new Date()
      const currentHour = now.getHours()
      const [openHour, closeHour] = store.workingHours.split('-').map(h => parseInt(h.trim().split(':')[0]))
      return currentHour >= openHour && currentHour < closeHour
    } catch (e) {
      return true
    }
  }

  return (
    <div
      className={`mtc-card animate-mtc-slide-up cursor-pointer mtc-hover-lift group h-full flex flex-col`}
      style={{ animationDelay: `${delay}s` }}
      onClick={() => onClick?.() || (window.location.href = `/mall/${store.mallId}/store/${store.id}`)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Banner Section */}
      <div className="relative aspect-[16/9] overflow-hidden rounded-t-3xl">
        <img
          src={store.image || 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=600&h=400&fit=crop'}
          alt={store.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Wishlist Button */}
        <button 
          className="absolute top-3 right-3 z-20 p-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white hover:bg-red-500 transition-colors"
          onClick={(e) => {
            e.stopPropagation()
            setIsWishlisted(!isWishlisted)
          }}
        >
          <Heart size={16} fill={isWishlisted ? "currentColor" : "none"} className={isWishlisted ? "text-white" : ""} />
        </button>

        {/* Logo Overlay */}
        <div className="absolute -bottom-6 left-6 z-20 w-16 h-16 rounded-2xl bg-mtc-bg p-2 border border-white/10 shadow-xl">
           <div className="w-full h-full rounded-xl bg-white/5 flex items-center justify-center overflow-hidden">
              <img 
                src={store.logo} 
                alt={store.name} 
                className="w-full h-full object-contain filter brightness-0 invert p-1"
              />
           </div>
        </div>

        {/* Category Badge */}
        <div className="absolute top-3 left-3 z-20">
          <div className="mtc-badge mtc-badge-primary">
            {store.category}
          </div>
        </div>
      </div>

      {/* Store Info */}
      <div className="p-6 pt-10 flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h3 className="mtc-heading-sm line-clamp-1">{store.name}</h3>
          <div className="flex items-center gap-1">
            <Star size={14} fill="currentColor" className="text-yellow-400" />
            <span className="text-sm font-semibold">{store.rating || '4.5'}</span>
          </div>
        </div>

        <p className="mtc-body-sm text-white/50 mb-4 line-clamp-2">
          {store.description}
        </p>

        <div className="space-y-2 mb-6 mt-auto">
          <div className="flex items-center gap-2 text-white/60 text-xs">
            <Navigation size={14} className="text-blue-400" />
            <span>Floor {store.floor || '1'} • {store.location || 'Section A'}</span>
          </div>
          <div className="flex items-center gap-2 text-white/60 text-xs">
            <Clock size={14} className="text-blue-400" />
            <span className={isOpenNow() ? "text-emerald-400" : "text-red-400"}>
              {isOpenNow() ? 'Open Now' : 'Closed'} • {store.workingHours || '10:00 - 22:00'}
            </span>
          </div>
        </div>

        <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 border border-white/10 group-hover:bg-blue-500 group-hover:border-blue-500 transition-all">
          <span className="text-sm font-semibold">Open Shop</span>
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  )
}
