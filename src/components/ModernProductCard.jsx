import { Link } from 'react-router-dom'
import { useMemo } from 'react'
import { useTheme } from '../contexts/ThemeContext'
import { useUser } from '../contexts/UserContext'
import { useEcosystem } from '../contexts/EcosystemContext'
import Button3D from './Button3D'
import ShareComponent from './ShareComponent'

const formatPrice = (value) => {
  const num = Number(value)
  if (Number.isNaN(num)) return ''
  return `$${num.toFixed(2)}`
}

export default function ModernProductCard({ product, onQuickView }) {
  const { darkMode } = useTheme()
  const { isFavorite, toggleFavorite } = useUser()
  const { getStoreById } = useEcosystem()

  const storeId = product?.storeId
  const store = useMemo(() => {
    if (!storeId) return null
    return getStoreById(storeId)
  }, [getStoreById, storeId])

  if (!product) return null

  const liked = isFavorite('products', product.id)
  const hasDiscount = Boolean(product.tag)
  const currentPrice = formatPrice(product.price)
  const oldPrice = hasDiscount ? formatPrice(Number(product.price) * 1.2) : null

  const cardCls = darkMode
    ? 'border-white/10 bg-white/5 hover:bg-white/10'
    : 'border-gray-200 bg-white hover:bg-gray-50'

  const stop = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  return (
    <div className={`group relative rounded-2xl border overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${cardCls}`}>
      <Link to={`/product/${product.id}`} className="block h-full">
        <div className="relative aspect-[4/5] bg-gray-100 dark:bg-gray-800 overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />

          {hasDiscount ? (
            <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-500/90 text-white text-[11px] font-bold shadow-sm">
              <span className="text-[10px]">%</span>
              <span className="uppercase tracking-wide">{product.tag}</span>
            </div>
          ) : null}

          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <ShareComponent type="product" item={product} />
            <button
              type="button"
              onClick={(e) => {
                stop(e)
                toggleFavorite('products', product.id)
              }}
              className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md border transition-colors ${
                darkMode
                  ? 'border-white/10 bg-gray-900/70 hover:bg-gray-900 text-white'
                  : 'border-gray-200 bg-white/90 hover:bg-white text-gray-800'
              }`}
              aria-label={liked ? 'Remove from favorites' : 'Add to favorites'}
            >
              <span className={liked ? 'text-red-500 text-xl' : 'text-xl'}>{liked ? '❤' : '♡'}</span>
            </button>
          </div>

          {typeof onQuickView === 'function' ? (
            <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/60 via-black/20 to-transparent">
              <Button3D
                variant="primary"
                className="w-full"
                onClick={(e) => {
                  stop(e)
                  onQuickView(product)
                }}
              >
                Quick View
              </Button3D>
            </div>
          ) : null}
        </div>

        <div className="p-4">
          <div className={`text-xs font-semibold mb-1 ${darkMode ? 'text-white/60' : 'text-gray-500'}`}>
            {store?.name ? store.name : product.brand ? product.brand : 'Store'}
          </div>

          <h3 className={`font-semibold leading-snug mb-2 line-clamp-2 min-h-[2.5rem] ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {product.name}
          </h3>

          {product.description ? (
            <p className={`text-xs mb-3 line-clamp-2 ${darkMode ? 'text-white/60' : 'text-gray-600'}`}>
              {product.description}
            </p>
          ) : null}

          <div className="flex items-end justify-between gap-3">
            <div>
              <div className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{currentPrice}</div>
              {oldPrice ? <div className={`text-xs line-through ${darkMode ? 'text-white/40' : 'text-gray-400'}`}>{oldPrice}</div> : null}
            </div>

            <div className={`text-[11px] px-2 py-1 rounded-full border ${
              darkMode ? 'border-white/10 bg-white/5 text-white/70' : 'border-gray-200 bg-gray-50 text-gray-600'
            }`}>
              {product.availability || 'In Stock'}
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}
