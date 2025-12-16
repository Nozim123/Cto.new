import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'

import { useTheme } from '../contexts/ThemeContext'

const parsePrice = (raw) => {
  if (raw === null || raw === undefined) return null
  const str = String(raw).trim()
  if (!str) return null

  const normalized = str.replace(/,/g, '')
  const n = Number(normalized)
  if (Number.isNaN(n)) return str
  return n
}

const formatPrice = (raw) => {
  const value = parsePrice(raw)
  if (value === null) return null
  if (typeof value === 'number') {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(value)
  }
  return value
}

export default function ProductCard({ product, to, onSelect }) {
  const { darkMode } = useTheme()
  const [liked, setLiked] = useState(false)

  const image = useMemo(
    () => product.gallery?.[0] || product.image || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400',
    [product.gallery, product.image]
  )

  const priceLabel = useMemo(() => formatPrice(product.price), [product.price])

  const handleLike = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setLiked((v) => !v)
  }

  const Card = (
    <div
      className={`rounded-2xl overflow-hidden card-shadow group h-full flex flex-col transition-all duration-300 ${
        darkMode ? 'bg-gray-800 glass-card-dark' : 'bg-white glass-card'
      }`}
    >
      {/* Image */}
      <div className={`relative overflow-hidden h-48 sm:h-56 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
        <img
          src={image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 lazy"
          loading="lazy"
        />

        {product.tag ? (
          <div className="absolute top-3 right-3 bg-gold text-navy px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
            {product.tag}
          </div>
        ) : null}

        {/* Like Button */}
        <button
          onClick={handleLike}
          className={`absolute top-3 left-3 w-11 h-11 rounded-full backdrop-blur-sm flex items-center justify-center transition-all duration-300 ${
            liked ? 'bg-red-500/90' : 'bg-white/70 hover:bg-white/90'
          }`}
          aria-label={liked ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart
            className={`${liked ? 'text-white' : 'text-gray-600'} transition-colors`}
            fill={liked ? 'currentColor' : 'none'}
            strokeWidth={liked ? 1.5 : 2}
            size={20}
          />
        </button>
      </div>

      {/* Content */}
      <div className="p-5 flex-grow flex flex-col justify-between">
        <div>
          {product.category ? (
            <p className={`text-sm mb-1 ${darkMode ? 'text-gray-400' : 'text-sage'}`}>{product.category}</p>
          ) : null}

          <h3
            className={`font-display text-lg font-bold group-hover:text-gold transition-colors duration-300 mb-2 ${
              darkMode ? 'text-cream' : 'text-navy'
            }`}
          >
            {product.name}
          </h3>

          {product.description ? (
            <p className={`text-sm line-clamp-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{product.description}</p>
          ) : null}
        </div>

        {/* Price */}
        {priceLabel ? (
          <div className={`mt-4 pt-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
            <p className="text-2xl font-bold text-gold">{priceLabel}</p>
          </div>
        ) : null}
      </div>
    </div>
  )

  if (to) {
    return (
      <Link to={to} className="block hover:no-underline" aria-label={product.name}>
        {Card}
      </Link>
    )
  }

  return (
    <button
      type="button"
      onClick={() => onSelect?.(product)}
      className="text-left"
      aria-label={product.name}
    >
      {Card}
    </button>
  )
}
