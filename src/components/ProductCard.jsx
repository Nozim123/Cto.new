import { useState } from 'react'
import { Link } from 'react-router-dom'
import Button3D from './Button3D'
import ShareComponent from './ShareComponent'
import { useLanguage } from '../contexts/LanguageContext'

export default function ProductCard({ product, onSelect }) {
  const { t } = useLanguage()
  const [liked, setLiked] = useState(false)

  const handleLike = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setLiked(!liked)
  }

  const handleQuickView = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (onSelect) {
      onSelect(product)
    }
  }

  return (
    <div className="group relative bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-white/10 hover:border-gold/30">
      <Link to={`/product/${product.id}`} className="block h-full flex flex-col">
        {/* Image Container */}
        <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 lazy"
            loading="lazy"
          />
          
          {/* Discount Badge */}
          {product.tag && (
            <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider shadow-md">
              {product.tag}
            </div>
          )}

          {/* Share Button */}
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <ShareComponent 
              type="product" 
              item={product}
              className=""
            />
          </div>

          {/* Like Button */}
          <button
            onClick={handleLike}
            className={`absolute top-12 right-3 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-md ${
              liked ? 'bg-white text-red-500' : 'bg-white/80 text-gray-400 hover:bg-white hover:text-gray-600'
            }`}
          >
            <span className="text-xl">{liked ? '❤️' : '♡'}</span>
          </button>

          {/* Quick View Overlay - Visible on Hover */}
          <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/60 to-transparent flex justify-center pb-6">
            <Button3D 
              variant="primary" 
              className="text-sm"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                handleQuickView(e)
              }}
            >
              {t('common.open')}
            </Button3D>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 flex-grow flex flex-col bg-white/10 backdrop-blur-sm">
          <div className="text-xs text-gold font-bold uppercase tracking-wider mb-1">{product.category}</div>
          <h3 className="text-white font-medium text-base mb-1 line-clamp-2 h-12 group-hover:text-gold transition-colors">
            {product.name}
          </h3>
          
          <div className="mt-auto pt-2 flex items-baseline gap-2">
            <span className="text-lg font-bold text-white">
              ${product.price.toFixed(2)}
            </span>
            {product.tag && (
              <span className="text-xs text-gray-400 line-through">
                ${(product.price * 1.2).toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  )
}
