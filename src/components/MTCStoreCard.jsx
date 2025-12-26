import { useState } from 'react'
import { Clock, MapPin, Star, ArrowRight, Navigation, Store } from 'lucide-react'

/**
 * MTC Premium Store Card
 * 
 * Features:
 * - Clean, minimalist design
 * - Premium glassmorphism
 * - Logo preview with glass background
 * - Category badges
 * - Rating display
 * - Working hours status
 * - Floor/location indicator
 */

export default function MTCStoreCard({ store, onClick, delay = 0 }) {
  const [isHovered, setIsHovered] = useState(false)
  const [logoLoaded, setLogoLoaded] = useState(false)

  const getRatingColor = (rating) => {
    if (rating >= 4.5) return 'text-emerald-400'
    if (rating >= 4.0) return 'text-green-400'
    if (rating >= 3.5) return 'text-yellow-400'
    return 'text-orange-400'
  }

  const isOpenNow = () => {
    if (!store.workingHours) return false
    const now = new Date()
    const currentHour = now.getHours()
    const [openHour, closeHour] = store.workingHours.split('-').map(h => parseInt(h.trim().replace(':', '')))
    return currentHour >= openHour && currentHour < closeHour
  }

  return (
    <div
      className={`mtc-card animate-mtc-slide-up cursor-pointer mtc-hover-lift`}
      style={{ animationDelay: `${delay}s` }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Logo Section */}
      <div className="relative aspect-square overflow-hidden rounded-t-3xl bg-white/5 p-6">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-30">
          <div 
            className="w-full h-full"
            style={{
              background: 'radial-gradient(circle at center, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
            }}
          />
        </div>

        {/* Store Logo */}
        {store.logo && (
          <div className={`relative w-full h-full flex items-center justify-center transition-all duration-500 ${
            logoLoaded ? 'scale-100' : 'scale-90'
          } ${isHovered ? 'scale-110' : ''}`}>
            <img
              src={store.logo}
              alt={store.name}
              className={`w-full h-full object-contain filter brightness-0 invert transition-opacity duration-300 ${
                logoLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setLogoLoaded(true)}
              loading="lazy"
            />
          </div>
        )}

        {/* Category Badge */}
        <div className="absolute top-3 right-3 z-20">
          <div className="mtc-badge mtc-badge-primary">
            {store.category}
          </div>
        </div>

        {/* Open/Closed Status */}
        <div className="absolute bottom-3 left-3 z-20">
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full backdrop-blur-md border transition-all duration-300 ${
            isOpenNow()
              ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
              : 'bg-red-500/20 border-red-500/40 text-red-400'
          }`}>
            <div className={`w-1.5 h-1.5 rounded-full ${
              isOpenNow() ? 'bg-emerald-400' : 'bg-red-400'
            }`} />
            <span className="text-xs font-medium">
              {isOpenNow() ? 'Open' : 'Closed'}
            </span>
          </div>
        </div>
      </div>

      {/* Store Info */}
      <div className="p-5">
        {/* Store Name */}
        <h3 className="mtc-heading-sm mb-2 line-clamp-1">
          {store.name}
        </h3>

        {/* Description */}
        <p className="mtc-body-sm text-white/60 mb-4 line-clamp-2 min-h-[2.5rem]">
          {store.description}
        </p>

        {/* Meta Information */}
        <div className="space-y-2.5 mb-4">
          {/* Floor/Area */}
          {store.floor && (
            <div className="flex items-center gap-2 text-white/70">
              <Navigation size={14} className="flex-shrink-0 text-blue-400" />
              <span className="mtc-caption">Floor {store.floor}</span>
            </div>
          )}

          {/* Working Hours */}
          {store.workingHours && (
            <div className="flex items-center gap-2 text-white/70">
              <Clock size={14} className="flex-shrink-0 text-blue-400" />
              <span className="mtc-caption">{store.workingHours}</span>
            </div>
          )}

          {/* Location */}
          {store.location && (
            <div className="flex items-center gap-2 text-white/70">
              <MapPin size={14} className="flex-shrink-0 text-blue-400" />
              <span className="mtc-caption truncate">{store.location}</span>
            </div>
          )}
        </div>

        {/* Rating */}
        {store.rating && (
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-1.5">
              <Star size={16} fill="currentColor" className="text-yellow-400" />
              <span className={`text-lg font-semibold ${getRatingColor(store.rating)}`}>
                {store.rating.toFixed(1)}
              </span>
              <span className="mtc-caption text-white/50">
                ({store.reviews || 0})
              </span>
            </div>
          </div>
        )}

        {/* Divider */}
        <div className="h-px bg-white/10 mb-4" />

        {/* Action Button */}
        <button className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition-all duration-300 ${
          isHovered
            ? 'bg-blue-500 text-white hover:bg-blue-600'
            : 'bg-white/10 text-white/70 hover:bg-white/20'
        }`}>
          <Store size={18} />
          {isHovered ? 'Visit Store' : 'View Details'}
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  )
}

/**
 * Store Card Skeleton Loading State
 */
export function MTCStoreCardSkeleton() {
  return (
    <div className="mtc-card">
      {/* Logo Skeleton */}
      <div className="aspect-square mtc-shimmer" />
      
      {/* Content Skeleton */}
      <div className="p-5 space-y-4">
        <div className="h-8 w-3/4 mtc-shimmer rounded-lg" />
        <div className="h-16 w-full mtc-shimmer rounded" />
        
        {/* Meta Skeleton */}
        <div className="space-y-2">
          <div className="h-4 w-24 mtc-shimmer rounded" />
          <div className="h-4 w-32 mtc-shimmer rounded" />
          <div className="h-4 w-28 mtc-shimmer rounded" />
        </div>

        {/* Rating Skeleton */}
        <div className="h-6 w-20 mtc-shimmer rounded" />

        {/* Divider */}
        <div className="h-px bg-white/10" />

        {/* Button Skeleton */}
        <div className="h-12 w-full mtc-shimmer rounded-xl" />
      </div>
    </div>
  )
}

/**
 * Store Grid Container
 */
export function MTCStoreGrid({ children, loading = false, skeletonCount = 8 }) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: skeletonCount }).map((_, index) => (
          <MTCStoreCardSkeleton key={index} />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {children}
    </div>
  )
}
