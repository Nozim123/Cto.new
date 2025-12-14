import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'
import useFavorites from '../hooks/useFavorites'

export default function MallCard({ mall }) {
  const isComingSoon = mall.status === 'coming_soon'
  const { isFavorite, toggleFavorite } = useFavorites()

  const fav = isFavorite('malls', mall.id)

  return (
    <div className="glass rounded-2xl overflow-hidden h-full flex flex-col group">
      {/* Image */}
      <div className="relative overflow-hidden bg-white/5 h-52">
        <img
          src={mall.image}
          alt={mall.name}
          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
          loading="lazy"
        />

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault()
            toggleFavorite('malls', mall.id)
          }}
          className={`absolute top-3 right-3 w-11 h-11 rounded-2xl border flex items-center justify-center transition ${
            fav ? 'bg-neonPink/20 border-neonPink/40' : 'bg-midnight/40 border-white/10 hover:bg-white/10'
          }`}
          aria-label={fav ? 'Remove from favorites' : 'Save to favorites'}
        >
          <Heart className={`w-5 h-5 ${fav ? 'text-neonPink fill-neonPink' : 'text-white/70'}`} />
        </button>

        {isComingSoon && (
          <div className="absolute inset-0 bg-black/55 flex items-center justify-center">
            <div className="text-center">
              <p className="text-white font-semibold text-xl">Coming Soon</p>
              <p className="text-white/60 text-sm mt-1">Future-ready experience in progress.</p>
            </div>
          </div>
        )}
      </div>

      <div className="p-6 flex-grow flex flex-col justify-between">
        <div>
          <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-neonCyan transition-colors">
            {mall.name}
          </h3>
          <p className="text-white/60 text-sm">📍 {mall.location}</p>
          {!isComingSoon && <p className="text-white/70 mt-3 text-sm leading-relaxed">{mall.description}</p>}
        </div>

        <div className="mt-5">
          {!isComingSoon ? (
            <Link to={`/mall/${mall.id}`} className="button-primary w-full text-center block">
              View details
            </Link>
          ) : (
            <button
              disabled
              className="w-full px-5 py-3 rounded-xl bg-white/5 text-white/40 font-semibold border border-white/10 cursor-not-allowed"
            >
              Coming soon
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
