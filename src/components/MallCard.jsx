import { Link } from 'react-router-dom'
import { useTheme } from '../contexts/ThemeContext'
import { useLanguage } from '../contexts/LanguageContext'
import { useUser } from '../contexts/UserContext'
import { useState, useEffect } from 'react'
import { MapPin, Clock, Heart, Navigation, Star } from 'lucide-react'
import { checkMallStatus } from '../utils/mallStatus'

export default function MallCard({ mall, index = 0 }) {
  const isComingSoon = mall.status === 'coming_soon'
  const { darkMode, seasonalColors } = useTheme()
  const { t } = useLanguage()
  const { isFavorite, toggleFavorite } = useUser()
  const liked = isFavorite('malls', mall.id)
  const [realTimeStatus, setRealTimeStatus] = useState(checkMallStatus(mall))

  // Update status every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeStatus(checkMallStatus(mall))
    }, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [mall])

  const delayClass = `fade-in-up-delay-${Math.min(index % 3, 3)}`

  return (
    <div className={`modern-card rounded-3xl overflow-hidden h-full flex flex-col ${
      darkMode
        ? 'bg-gray-800/95 backdrop-blur-xl border-gray-700'
        : 'bg-white/95 backdrop-blur-xl border-gray-100'
    } ${delayClass} shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 hover:scale-[1.02] border`}>
      {/* Image Container */}
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 h-52 sm:h-56 md:h-64 group">
        <img
          src={mall.image}
          alt={mall.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          loading="lazy"
        />

        {/* Favorite Button */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            toggleFavorite('malls', mall.id)
          }}
          className={`absolute top-4 left-4 w-11 h-11 rounded-2xl flex items-center justify-center backdrop-blur-md transition-all duration-300 shadow-lg transform hover:scale-110 border-2 ${
            liked
              ? 'bg-white text-red-500 border-red-200 dark:border-red-900'
              : 'bg-white/90 text-gray-400 hover:bg-white hover:text-red-400 border-gray-200 dark:border-gray-700'
          }`}
          aria-label={liked ? t('favorites.remove') || 'Remove from favorites' : t('favorites.add') || 'Add to favorites'}
        >
          <Heart size={20} fill={liked ? 'currentColor' : 'none'} strokeWidth={2.5} />
        </button>

        {/* Real-time Status Badge */}
        {!isComingSoon && (
          <div className={`absolute top-4 right-4 flex items-center gap-2 px-4 py-2 rounded-2xl backdrop-blur-xl text-xs font-bold tracking-wide shadow-lg ${
            realTimeStatus.isOpen
              ? 'bg-emerald-500/95 text-white'
              : 'bg-rose-500/95 text-white'
          }`}>
            <div className={`w-2 h-2 rounded-full ${
              realTimeStatus.isOpen ? 'bg-white animate-pulse' : 'bg-white'
            }`}></div>
            {realTimeStatus.isOpen ? t('common.open') : t('common.closed')}
          </div>
        )}

        {/* Star Rating */}
        {!isComingSoon && mall.rating && (
          <div className={`absolute bottom-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-xl backdrop-blur-xl shadow-lg ${
            darkMode ? 'bg-black/60 text-amber-400' : 'bg-white/90 text-amber-500'
          }`}>
            <Star size={16} fill="currentColor" strokeWidth={0} />
            <span className="font-bold text-sm">{mall.rating}</span>
          </div>
        )}

        {/* Coming Soon Overlay */}
        {isComingSoon && (
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/60 to-black/70 backdrop-blur-sm flex items-center justify-center">
            <div className="text-center">
              <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-2xl mb-3`}
                   style={{ background: `linear-gradient(135deg, ${seasonalColors.primary}, ${seasonalColors.accent})` }}>
                <span className="text-white font-display text-xl font-bold">Coming Soon</span>
              </div>
              <div className="w-20 h-1 mx-auto rounded-full bg-white/50"></div>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex-grow flex flex-col justify-between">
        <div>
          {/* Mall Name */}
          <h3 className={`font-display text-xl lg:text-2xl font-bold mb-3 leading-tight ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            {mall.name}
          </h3>

          {/* Location */}
          <div className={`flex items-center gap-2 mb-3 ${
            darkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            <MapPin size={16} className="flex-shrink-0" style={{ color: seasonalColors.primary }} />
            <span className="text-sm font-medium truncate">{mall.location}</span>
          </div>

          {!isComingSoon && (
            <>
              {/* Opening Hours */}
              <div className={`flex items-center gap-2 mb-3 text-sm ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                <Clock size={16} className="flex-shrink-0" />
                <span className="font-medium">{mall.hours}</span>
                {realTimeStatus.message && (
                  <span className={`ml-auto px-2.5 py-1 rounded-xl text-xs font-bold ${
                    realTimeStatus.isOpen
                      ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300'
                      : 'bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300'
                  }`}>
                    {realTimeStatus.message}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className={`text-sm mb-4 line-clamp-2 leading-relaxed ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {mall.description}
              </p>
            </>
          )}
        </div>

        {/* CTA Button */}
        {!isComingSoon ? (
          <Link to={`/mall/${mall.id}`} className="mt-2 block">
            <button className="w-full py-3.5 px-4 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-2xl transition-all duration-300 font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 group">
              <span>View Details</span>
              <Navigation size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
        ) : (
          <button disabled className="w-full py-3.5 px-4 border-2 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 rounded-2xl mt-2 opacity-60 cursor-not-allowed font-semibold">
            Coming Soon
          </button>
        )}
      </div>
    </div>
  )
}
