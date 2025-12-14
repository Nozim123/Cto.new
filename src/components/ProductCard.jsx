import { Heart } from 'lucide-react'
import useFavorites from '../hooks/useFavorites'

export default function ProductCard({ product, onSelect }) {
  const { isFavorite, toggleFavorite } = useFavorites()
  const fav = isFavorite('products', product.id)

  return (
    <div
      onClick={() => onSelect(product)}
      className="glass rounded-2xl overflow-hidden cursor-pointer group h-full flex flex-col"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onSelect(product)
        }
      }}
      aria-label={`${product.name}, $${product.price.toFixed(2)}`}
    >
      <div className="relative overflow-hidden bg-white/5 h-52">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
          loading="lazy"
        />

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            toggleFavorite('products', product.id)
          }}
          className={`absolute top-3 right-3 w-11 h-11 rounded-2xl border flex items-center justify-center transition ${
            fav ? 'bg-neonPink/20 border-neonPink/40' : 'bg-midnight/40 border-white/10 hover:bg-white/10'
          }`}
          aria-label={fav ? 'Remove from favorites' : 'Save to favorites'}
        >
          <Heart className={`w-5 h-5 ${fav ? 'text-neonPink fill-neonPink' : 'text-white/70'}`} />
        </button>

        {product.tag && (
          <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 border border-white/10 text-white">
            {product.tag}
          </div>
        )}
      </div>

      <div className="p-6 flex-grow flex flex-col justify-between">
        <div>
          <p className="text-white/60 text-sm mb-1">{product.category}</p>
          <h3 className="text-lg font-semibold text-white group-hover:text-neonCyan transition-colors mb-2">
            {product.name}
          </h3>
          <p className="text-white/70 text-sm line-clamp-2">{product.description}</p>
        </div>

        <div className="mt-4 pt-4 border-t border-white/10">
          <p className="text-2xl font-semibold text-white">${product.price.toFixed(2)}</p>
        </div>
      </div>
    </div>
  )
}
