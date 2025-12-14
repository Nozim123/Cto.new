import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'
import useFavorites from '../hooks/useFavorites'

export default function StoreCard({ store, mallId }) {
  const statusText = store.status === 'open' ? 'Open' : 'Coming Soon'
  const { isFavorite, toggleFavorite } = useFavorites()
  const fav = isFavorite('stores', store.id)

  return (
    <Link to={`/mall/${mallId}/store/${store.id}`} className="group h-full">
      <div className="glass rounded-2xl overflow-hidden h-full">
        <div className="relative overflow-hidden bg-white/5 h-52">
          <img
            src={store.logo}
            alt={store.name}
            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
            loading="lazy"
          />

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              toggleFavorite('stores', store.id)
            }}
            className={`absolute top-3 right-3 w-11 h-11 rounded-2xl border flex items-center justify-center transition ${
              fav ? 'bg-neonPink/20 border-neonPink/40' : 'bg-midnight/40 border-white/10 hover:bg-white/10'
            }`}
            aria-label={fav ? 'Remove from favorites' : 'Save to favorites'}
          >
            <Heart className={`w-5 h-5 ${fav ? 'text-neonPink fill-neonPink' : 'text-white/70'}`} />
          </button>

          <div className="absolute left-3 top-3">
            <span
              className={`text-xs font-semibold px-3 py-1 rounded-full border backdrop-blur ${
                store.status === 'open'
                  ? 'bg-emerald-500/15 text-emerald-200 border-emerald-400/30'
                  : 'bg-amber-500/15 text-amber-200 border-amber-400/30'
              }`}
            >
              {statusText}
            </span>
          </div>
        </div>

        <div className="p-6">
          <h3 className="text-lg font-semibold text-white group-hover:text-neonCyan transition-colors">
            {store.name}
          </h3>
          <p className="text-white/60 text-sm mt-1">{store.category}</p>

          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-2xl bg-white/5 border border-white/10 px-4 py-3">
              <p className="text-white/50">Floor</p>
              <p className="text-white font-semibold">{store.floor}</p>
            </div>
            <div className="rounded-2xl bg-white/5 border border-white/10 px-4 py-3">
              <p className="text-white/50">Hours</p>
              <p className="text-white font-semibold truncate">{store.hours}</p>
            </div>
          </div>

          <div className="mt-5 text-white/70 font-semibold group-hover:translate-x-1 transition-transform">
            View store →
          </div>
        </div>
      </div>
    </Link>
  )
}
