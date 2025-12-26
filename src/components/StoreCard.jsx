import { Link } from 'react-router-dom'
import Button3D from './Button3D'
import ShareComponent from './ShareComponent'
import { useLanguage } from '../contexts/LanguageContext'
import { useUser } from '../contexts/UserContext'
import { Heart, Star, Map, Verified } from 'lucide-react'

export default function StoreCard({ store, mallId }) {
  const { t } = useLanguage()
  const { isFavorite, toggleFavorite } = useUser()
  const liked = isFavorite('stores', store.id)
  const verified = store.verified !== false
  const statusColor = store.status === 'open' ? 'bg-emerald-500/90' : 'bg-yellow-500/90'
  const statusText = store.status === 'open' ? t('common.open') : t('common.comingSoon')

  return (
    <div className="group relative bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 hover:border-purple-500/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-xl flex flex-col h-full">
      {/* Cover Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={store.image || store.interiorImage}
          alt={store.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

        {/* Logo overlay */}
        <div className="absolute bottom-4 left-4 w-14 h-14 bg-white rounded-xl p-2 shadow-xl border border-white/20">
          <img
            src={store.logo}
            alt="logo"
            className="w-full h-full object-contain"
          />
        </div>

        {/* Status Badge */}
        <div className={`absolute top-4 right-4 text-xs font-bold px-3 py-1.5 rounded-xl backdrop-blur-md border border-white/10 text-white ${statusColor}`}>
          {statusText}
        </div>

        {verified ? (
          <div className="absolute top-4 left-20 flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-xl bg-emerald-500/90 backdrop-blur-md border border-emerald-400/30 text-white">
            <Verified size={10} />
            Verified
          </div>
        ) : null}

        {/* Favorite Button */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            toggleFavorite('stores', store.id)
          }}
          className={`absolute top-14 right-4 w-10 h-10 rounded-xl flex items-center justify-center backdrop-blur-sm transition-all duration-300 shadow-lg transform hover:scale-110 border-2 ${
            liked
              ? 'bg-white text-red-500 border-red-200 dark:border-red-900'
              : 'bg-white/90 text-gray-400 hover:bg-white hover:text-red-400 border-gray-200 dark:border-gray-700'
          }`}
          aria-label={liked ? t('favorites.remove') || 'Remove from favorites' : t('favorites.add') || 'Add to favorites'}
        >
          <Heart size={18} fill={liked ? 'currentColor' : 'none'} strokeWidth={2.5} />
        </button>

        {/* Share Button */}
        <div className="absolute top-4 left-4">
          <ShareComponent
            type="store"
            item={store}
            mallId={mallId}
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          />
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-grow flex flex-col">
        <div className="mb-4">
          <div className="text-xs text-purple-400 font-bold uppercase tracking-wider mb-1">
            {store.category}
          </div>
          <h3 className="text-lg md:text-xl font-display font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
            {store.name}
          </h3>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <div className="flex items-center gap-1">
              <Star size={14} className="text-amber-400 fill-amber-400" />
              <span className="font-medium">4.8</span>
            </div>
            <span className="w-1 h-1 rounded-full bg-gray-500"></span>
            <div className="flex items-center gap-1">
              <Map size={14} />
              <span>{t('map.floor')} {store.floor}</span>
            </div>
          </div>
        </div>

        <div className="mt-auto flex gap-2">
          <Link to={`/mall/${mallId}/store/${store.id}`} className="flex-1">
            <Button3D variant="primary" className="w-full text-sm py-2.5">
              {t('buttons.viewProducts')}
            </Button3D>
          </Link>
        </div>
      </div>
    </div>
  )
}
