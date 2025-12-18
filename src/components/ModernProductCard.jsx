import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTheme } from '../contexts/ThemeContext'
import { useLanguage } from '../contexts/LanguageContext'
import { useUser } from '../contexts/UserContext'

export default function ModernProductCard({ product, onQuickView }) {
  const { darkMode } = useTheme()
  const { t } = useLanguage()
  const { isFavorite, toggleFavorite } = useUser()
  const liked = isFavorite('products', product.id)
  const [imageLoaded, setImageLoaded] = useState(false)

  const handleLike = (e) => {
    e.preventDefault()
    e.stopPropagation()
    toggleFavorite('products', product.id)
  }

  const handleQuickView = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (onQuickView) {
      onQuickView(product)
    }
  }

  return (
    <div className={`group relative rounded-2xl overflow-hidden transition-all duration-500 transform hover:-translate-y-2 hover:shadow-2xl ${
      darkMode 
        ? 'bg-gray-800 shadow-lg hover:shadow-purple-500/20' 
        : 'bg-white shadow-md hover:shadow-xl'
    }`}>
      <Link to={`/product/${product.id}`} className="block">
        {/* Image Container */}
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
          {/* Skeleton Loader */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse"></div>
          )}
          
          {/* Product Image */}
          <img
            src={product.image}
            alt={product.name}
            onLoad={() => setImageLoaded(true)}
            className={`w-full h-full object-cover transition-all duration-700 ${
              imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            } group-hover:scale-110`}
            loading="lazy"
          />

          {/* Discount Badge */}
          {product.tag && (
            <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider shadow-lg animate-pulse-glow">
              {product.tag}
            </div>
          )}

          {/* Availability Badge */}
          {product.availability === 'Out of Stock' && (
            <div className="absolute top-3 right-3 bg-gray-900/80 text-white px-3 py-1.5 rounded-lg text-xs font-medium">
              {t('common.outOfStock') || 'Out of Stock'}
            </div>
          )}

          {/* Like Button */}
          <button
            onClick={handleLike}
            className={`absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-300 shadow-lg transform hover:scale-110 ${
              liked 
                ? 'bg-white text-red-500' 
                : 'bg-white/80 text-gray-400 hover:bg-white hover:text-red-400'
            }`}
          >
            <span className="text-xl">{liked ? '❤️' : '♡'}</span>
          </button>

          {/* Quick View Button - Appears on Hover */}
          <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/80 via-black/50 to-transparent">
            <button
              onClick={handleQuickView}
              className="w-full bg-white text-gray-900 font-semibold py-3 rounded-lg hover:bg-gray-100 transition-all duration-300 shadow-lg transform hover:scale-105"
            >
              👁️ {t('buttons.quickView') || 'Quick View'}
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4">
          {/* Category */}
          <div className="text-xs font-bold text-purple-600 uppercase tracking-wider mb-1">
            {product.category}
          </div>

          {/* Product Name */}
          <h3 className={`font-semibold text-base mb-2 line-clamp-2 h-12 transition-colors ${
            darkMode ? 'text-white group-hover:text-purple-400' : 'text-gray-900 group-hover:text-purple-600'
          }`}>
            {product.name}
          </h3>

          {/* Brand (if available) */}
          {product.brand && (
            <p className="text-xs text-gray-500 mb-2">{product.brand}</p>
          )}

          {/* Price */}
          <div className="flex items-baseline gap-2 mt-auto">
            <span className={`text-xl font-bold ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              ${product.price.toFixed(2)}
            </span>
            {product.tag && (
              <span className="text-sm text-gray-400 line-through">
                ${(product.price * 1.2).toFixed(2)}
              </span>
            )}
          </div>

          {/* Additional Info */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-1">
              <span className="text-yellow-500">⭐</span>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {product.rating || '4.5'}
              </span>
            </div>
            <div className={`text-xs font-medium ${
              product.availability === 'In Stock' 
                ? 'text-green-600' 
                : 'text-red-600'
            }`}>
              {product.availability || 'In Stock'}
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}
