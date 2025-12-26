import { useState } from 'react'
import { Clock, MapPin, Star, Heart, ArrowRight, Navigation } from 'lucide-react'

/**
 * MTC Premium Mall Card
 * 
 * Features:
 * - 3D hover effect with perspective
 * - Premium glassmorphism
 * - Smooth micro-animations
 * - Image zoom on hover
 * - Interactive elements
 * - Mobile-optimized touch targets
 */

export default function MTCMallCard({ mall, index, delay = 0 }) {
  const [isHovered, setIsHovered] = useState(false)
  const [isWishlisted, setIsWishlisted] = useState(false)

  const handleWishlistClick = (e) => {
    e.stopPropagation()
    setIsWishlisted(!isWishlisted)
  }

  const getRatingColor = (rating) => {
    if (rating >= 4.5) return 'text-emerald-400'
    if (rating >= 4.0) return 'text-green-400'
    if (rating >= 3.5) return 'text-yellow-400'
    return 'text-orange-400'
  }

  return (
    <div
      className="mtc-card-3d animate-mtc-slide-up"
      style={{ animationDelay: `${delay}s` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => window.location.href = `/mall/${mall.id}`}
    >
      <div className={`mtc-card-3d-inner ${isHovered ? 'cursor-pointer' : ''}`}>
        <div className="mtc-card group">
          {/* Card Image with Premium Overlay */}
          <div className="mtc-card-image-wrapper relative aspect-[4/3] overflow-hidden">
            <img
              src={mall.image}
              alt={mall.name}
              className="mtc-card-image"
              loading="lazy"
            />
            
            {/* Gradient Overlay */}
            <div className="mtc-card-overlay" />
            
            {/* Premium Badge */}
            {mall.featured && (
              <div className="absolute top-4 left-4 z-20">
                <div className="mtc-badge mtc-badge-primary flex items-center gap-1">
                  <Star size={10} fill="currentColor" />
                  Featured
                </div>
              </div>
            )}

            {/* Status Badge */}
            <div className="absolute top-4 right-4 z-20">
              <div 
                className={`mtc-badge ${
                  mall.status === 'open' 
                    ? 'mtc-badge-success' 
                    : mall.status === 'closed'
                    ? 'mtc-badge-danger'
                    : 'mtc-badge-warning'
                }`}
              >
                {mall.status === 'open' ? 'Open Now' : mall.status === 'closed' ? 'Closed' : 'Coming Soon'}
              </div>
            </div>

            {/* Wishlist Button */}
            <button
              className="absolute top-4 right-20 z-20 p-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all duration-300 group-hover:opacity-100 opacity-0"
              onClick={handleWishlistClick}
              style={{ transitionDelay: '0.1s' }}
            >
              <Heart
                size={18}
                className={`transition-colors duration-300 ${
                  isWishlisted ? 'fill-red-500 text-red-500' : 'text-white'
                }`}
              />
            </button>

            {/* Rating Badge */}
            <div className="absolute bottom-4 left-4 z-20">
              <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 ${getRatingColor(mall.rating)}`}>
                <Star size={14} fill="currentColor" className="text-yellow-400" />
                <span className="text-sm font-semibold">{mall.rating.toFixed(1)}</span>
                <span className="text-xs opacity-70">({mall.reviews})</span>
              </div>
            </div>

            {/* View Mall Button - Appears on Hover */}
            <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button className="mtc-button-primary flex items-center gap-2">
                View Mall
                <ArrowRight size={18} />
              </button>
            </div>
          </div>

          {/* Card Content */}
          <div className="p-5">
            {/* Mall Name */}
            <h3 className="mtc-heading-sm mb-2 line-clamp-1 group-hover:text-blue-400 transition-colors">
              {mall.name}
            </h3>

            {/* Description */}
            <p className="mtc-body-sm line-clamp-2 mb-4 min-h-[2.5rem]">
              {mall.description}
            </p>

            {/* Meta Information */}
            <div className="space-y-2.5">
              {/* Location */}
              <div className="flex items-center gap-2 text-white/60">
                <MapPin size={14} className="flex-shrink-0" />
                <span className="mtc-caption truncate">{mall.location}</span>
              </div>

              {/* Hours */}
              <div className="flex items-center gap-2 text-white/60">
                <Clock size={14} className="flex-shrink-0" />
                <span className="mtc-caption">{mall.hours}</span>
              </div>
            </div>

            {/* Shop Count */}
            <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
              <span className="mtc-caption text-white/50">
                {mall.storeCount} Shops
              </span>
              
              <button 
                className={`flex items-center gap-1 text-sm font-medium transition-all duration-300 ${
                  isHovered ? 'text-blue-400 translate-x-1' : 'text-white/70'
                }`}
              >
                Explore
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Mall Card Skeleton Loading State
 */
export function MTCMallCardSkeleton() {
  return (
    <div className="mtc-card p-0">
      {/* Image Skeleton */}
      <div className="aspect-[4/3] mtc-shimmer" />
      
      {/* Content Skeleton */}
      <div className="p-5 space-y-4">
        <div className="h-6 w-3/4 mtc-shimmer rounded-lg" />
        <div className="h-4 w-full mtc-shimmer rounded" />
        <div className="h-4 w-2/3 mtc-shimmer rounded" />
        <div className="flex gap-2">
          <div className="h-4 w-20 mtc-shimmer rounded" />
          <div className="h-4 w-24 mtc-shimmer rounded" />
        </div>
        <div className="h-px bg-white/10" />
        <div className="flex justify-between items-center">
          <div className="h-4 w-16 mtc-shimmer rounded" />
          <div className="h-4 w-20 mtc-shimmer rounded" />
        </div>
      </div>
    </div>
  )
}
