import { useState } from 'react'
import { Heart, ShoppingCart, Star, Tag, Zap } from 'lucide-react'

/**
 * MTC Premium Product Card
 * 
 * Features:
 * - Uzum/Amazon style layout
 * - Premium glassmorphism
 * - Image zoom on hover
 * - Wishlist heart animation
 * - Quick add to cart
 * - Discount badges
 * - Rating display
 * - Mobile-optimized touch targets
 */

export default function MTCProductCard({ product, onAddToCart, onToggleWishlist, delay = 0 }) {
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  const getRatingColor = (rating) => {
    if (rating >= 4.5) return 'text-emerald-400'
    if (rating >= 4.0) return 'text-green-400'
    if (rating >= 3.5) return 'text-yellow-400'
    return 'text-orange-400'
  }

  const handleWishlistClick = (e) => {
    e.stopPropagation()
    setIsWishlisted(!isWishlisted)
    onToggleWishlist?.(product.id)
  }

  const handleAddToCart = (e) => {
    e.stopPropagation()
    onAddToCart?.(product)
  }

  return (
    <div
      className={`mtc-card animate-mtc-slide-up cursor-pointer mtc-hover-lift`}
      style={{ animationDelay: `${delay}s` }}
      onClick={() => window.location.href = `/product/${product.id}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden rounded-t-3xl bg-white/5">
        {product.images && product.images[0] && (
          <>
            <img
              src={product.images[0]}
              alt={product.name}
              className={`w-full h-full object-cover transition-transform duration-500 ${
                isHovered ? 'scale-110' : 'scale-100'
              } ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setImageLoaded(true)}
              loading="lazy"
            />
            
            {!imageLoaded && (
              <div className="absolute inset-0 mtc-shimmer" />
            )}
          </>
        )}

        {/* Discount Badge */}
        {discount > 0 && (
          <div className="absolute top-3 left-3 z-20">
            <div className="mtc-badge mtc-badge-danger flex items-center gap-1.5 px-3 py-1.5">
              <Tag size={10} />
              -{discount}%
            </div>
          </div>
        )}

        {/* Wishlist Button */}
        <button
          className={`absolute top-3 right-3 z-20 p-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 transition-all duration-300 hover:bg-white/20 ${
            isWishlisted ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          } ${isHovered ? 'opacity-100' : ''}`}
          onClick={handleWishlistClick}
          style={{ transitionDelay: isHovered ? '0.1s' : '0s' }}
        >
          <Heart
            size={18}
            className={`transition-all duration-300 ${
              isWishlisted ? 'fill-red-500 text-red-500 scale-110' : 'text-white'
            }`}
          />
        </button>

        {/* Quick Add to Cart - Appears on Hover */}
        {onAddToCart && (
          <div className={`absolute bottom-3 right-3 z-20 transition-all duration-300 ${
            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          }`}>
            <button
              className="mtc-button-primary p-2.5 rounded-full shadow-lg"
              onClick={handleAddToCart}
            >
              <ShoppingCart size={18} />
            </button>
          </div>
        )}

        {/* Rating Badge */}
        {product.rating && (
          <div className="absolute bottom-3 left-3 z-20">
            <div className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 ${getRatingColor(product.rating)}`}>
              <Star size={12} fill="currentColor" className="text-yellow-400" />
              <span className="text-xs font-semibold">{product.rating.toFixed(1)}</span>
            </div>
          </div>
        )}

        {/* Flash Sale Badge */}
        {product.isFlashSale && (
          <div className="absolute top-3 right-16 z-20">
            <div className="mtc-badge mtc-badge-warning flex items-center gap-1.5 px-2 py-1">
              <Zap size={10} />
              Flash
            </div>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Product Name */}
        <h3 className="mtc-body font-semibold mb-2 line-clamp-2 min-h-[2.5rem]">
          {product.name}
        </h3>

        {/* Price Section */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-baseline gap-2">
            {/* Current Price */}
            <span className="text-xl font-bold text-white">
              {product.price.toLocaleString()} {product.currency || 'UZS'}
            </span>
            
            {/* Original Price */}
            {product.originalPrice && (
              <span className="text-sm text-white/40 line-through">
                {product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>

          {/* You Save Badge */}
          {discount > 0 && (
            <div className="mtc-badge mtc-badge-success text-xs px-2 py-0.5">
              Save {(product.originalPrice - product.price).toLocaleString()}
            </div>
          )}
        </div>

        {/* Meta Information */}
        <div className="flex items-center justify-between text-white/50 text-xs">
          {/* Category */}
          <span className="mtc-caption line-clamp-1">
            {product.category}
          </span>
          
          {/* Reviews Count */}
          {product.reviewCount && (
            <span>
              {product.reviewCount} reviews
            </span>
          )}
        </div>

        {/* Action Button */}
        <button
          className={`w-full mt-3 py-3 rounded-xl font-semibold transition-all duration-300 ${
            isHovered
              ? 'bg-blue-500 text-white hover:bg-blue-600'
              : 'bg-white/10 text-white/70 hover:bg-white/20'
          }`}
        >
          {isHovered ? 'Quick View' : 'View Product'}
        </button>
      </div>
    </div>
  )
}

/**
 * Product Card Skeleton Loading State
 */
export function MTCProductCardSkeleton() {
  return (
    <div className="mtc-card">
      {/* Image Skeleton */}
      <div className="aspect-square mtc-shimmer" />
      
      {/* Content Skeleton */}
      <div className="p-4 space-y-3">
        <div className="h-12 w-full mtc-shimmer rounded-lg" />
        
        {/* Price Skeleton */}
        <div className="flex items-center gap-2">
          <div className="h-6 w-24 mtc-shimmer rounded-lg" />
          <div className="h-6 w-16 mtc-shimmer rounded" />
        </div>

        {/* Meta Skeleton */}
        <div className="flex justify-between">
          <div className="h-4 w-20 mtc-shimmer rounded" />
          <div className="h-4 w-16 mtc-shimmer rounded" />
        </div>

        {/* Button Skeleton */}
        <div className="h-12 w-full mtc-shimmer rounded-xl" />
      </div>
    </div>
  )
}

/**
 * Product Grid Container
 */
export function MTCProductGrid({ children, loading = false, skeletonCount = 8 }) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: skeletonCount }).map((_, index) => (
          <MTCProductCardSkeleton key={index} />
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
