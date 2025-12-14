import { useState } from 'react'
import { useTheme } from '../contexts/ThemeContext'

export default function ProductCard({ product, onSelect }) {
  const { darkMode } = useTheme()
  const [liked, setLiked] = useState(false)

  const handleLike = (e) => {
    e.stopPropagation()
    setLiked(!liked)
  }

  return (
    <div
      onClick={() => onSelect(product)}
      className={`rounded-lg overflow-hidden card-shadow cursor-pointer group h-full flex flex-col transition-all duration-300 ${
        darkMode ? 'bg-gray-800 glass-card-dark' : 'bg-white glass-card'
      }`}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onSelect(product)
        }
      }}
      aria-label={`${product.name}, ${product.price.toFixed(2)}`}
    >
      {/* Image */}
      <div className={`relative overflow-hidden h-48 sm:h-56 ${
        darkMode ? 'bg-gray-700' : 'bg-gray-100'
      }`}>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 lazy"
          loading="lazy"
        />
        {product.tag && (
          <div className="absolute top-3 right-3 bg-gold text-navy px-3 py-1 rounded-full text-xs font-semibold">
            {product.tag}
          </div>
        )}
        
        {/* Like Button */}
        <button
          onClick={handleLike}
          className={`absolute top-3 left-3 w-10 h-10 rounded-full backdrop-blur-sm flex items-center justify-center transition-all duration-300 ${
            liked ? 'bg-red-500 scale-110 heart-beat' : 'bg-white/70 hover:bg-white/90'
          }`}
          aria-label="Like product"
        >
          <span className={`text-lg ${liked ? 'text-white' : 'text-gray-600'}`}>
            {liked ? '❤️' : '🤍'}
          </span>
        </button>
      </div>

      {/* Content */}
      <div className="p-5 flex-grow flex flex-col justify-between">
        <div>
          <p className={`text-sm mb-1 ${
            darkMode ? 'text-gray-400' : 'text-sage'
          }`}>{product.category}</p>
          <h3 className={`font-display text-lg font-bold group-hover:text-gold transition-colors duration-300 mb-2 ${
            darkMode ? 'text-cream' : 'text-navy'
          }`}>
            {product.name}
          </h3>
          <p className={`text-sm line-clamp-2 ${
            darkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {product.description}
          </p>
        </div>

        {/* Price */}
        <div className={`mt-4 pt-4 border-t ${
          darkMode ? 'border-gray-700' : 'border-gray-100'
        }`}>
          <p className="text-2xl font-bold text-gold">
            ${product.price.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  )
}
