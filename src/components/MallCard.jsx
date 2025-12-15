import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useTheme } from '../contexts/ThemeContext'
import { useUserAuth } from '../contexts/UserAuthContext'
import useFavorites from '../hooks/useFavorites'
import { toggleFavorite } from '../services/favorites'
import { pushNotification } from '../services/notifications'

export default function MallCard({ mall, index = 0 }) {
  const isComingSoon = mall.status === 'coming_soon'
  const { darkMode, seasonalColors } = useTheme()
  const { user, isAuthenticated } = useUserAuth()
  const navigate = useNavigate()

  const favorites = useFavorites(user?.id)
  const isSaved = favorites.malls.includes(mall.id)

  const delayClass = `fade-in-up-delay-${Math.min(index % 3, 3)}`

  const onToggleSave = (e) => {
    e.preventDefault()

    if (!isAuthenticated) {
      toast('Create a profile to save malls')
      navigate('/register')
      return
    }

    const nowSaved = toggleFavorite({ userId: user.id, type: 'mall', id: mall.id })
    pushNotification(user.id, {
      title: nowSaved ? 'Saved mall' : 'Removed mall',
      message: nowSaved ? mall.name : `Removed ${mall.name} from your favorites`
    })
    toast.success(nowSaved ? 'Saved' : 'Removed')
  }

  return (
    <div
      className={`card-shadow rounded-lg overflow-hidden h-full flex flex-col transition-all duration-300 ${
        darkMode ? 'bg-gray-800 glass-card-dark' : 'bg-white glass-card'
      } ${delayClass}`}
    >
      {/* Image Container */}
      <div className="relative overflow-hidden bg-gray-200 dark:bg-gray-700 h-48 sm:h-56 md:h-64 group">
        <img
          src={mall.image}
          alt={mall.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 lazy"
          loading="lazy"
        />

        <button
          type="button"
          onClick={onToggleSave}
          className={`absolute top-4 left-4 w-11 h-11 rounded-full backdrop-blur-sm flex items-center justify-center transition-all duration-300 ${
            isSaved ? 'bg-red-500/90 scale-110 heart-beat' : 'bg-white/70 hover:bg-white/90'
          }`}
          aria-label={isSaved ? 'Remove from favorites' : 'Save to favorites'}
        >
          <span className={`text-lg ${isSaved ? 'text-white' : 'text-gray-600'}`}>{isSaved ? '❤️' : '🤍'}</span>
        </button>

        {isComingSoon && (
          <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center">
            <div className="text-center">
              <p className="text-white font-display text-2xl font-bold mb-2">Coming Soon</p>
              <div
                className="w-16 h-1 mx-auto rounded-full"
                style={{ backgroundColor: seasonalColors.primary }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 flex-grow flex flex-col justify-between">
        <div>
          <h3
            className={`font-display text-xl lg:text-2xl font-bold mb-2 ${
              darkMode ? 'text-cream' : 'text-navy'
            }`}
          >
            {mall.name}
          </h3>
          <p
            className={`mb-2 text-sm md:text-base flex items-center gap-1 ${
              darkMode ? 'text-gray-400' : 'text-sage'
            }`}
          >
            <span style={{ color: seasonalColors.primary }}>📍</span> {mall.location}
          </p>
          {!isComingSoon && (
            <p
              className={`text-sm md:text-base mb-4 ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}
            >
              {mall.description}
            </p>
          )}
        </div>

        {/* Button */}
        {!isComingSoon ? (
          <Link
            to={`/mall/${mall.id}`}
            className="button-primary inline-block text-center mt-4 w-full"
          >
            View Details →
          </Link>
        ) : (
          <button
            disabled
            className={`w-full px-6 py-3 font-semibold rounded-lg opacity-60 cursor-not-allowed mt-4 ${
              darkMode ? 'bg-gray-700 text-gray-500' : 'bg-gray-300 text-gray-600'
            }`}
          >
            Coming Soon
          </button>
        )}
      </div>
    </div>
  )
}
