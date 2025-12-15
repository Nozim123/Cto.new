import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useTheme } from '../contexts/ThemeContext'
import { useUserAuth } from '../contexts/UserAuthContext'
import useFavorites from '../hooks/useFavorites'
import { toggleFavorite } from '../services/favorites'
import { pushNotification } from '../services/notifications'

export default function StoreCard({ store, mallId }) {
  const { darkMode } = useTheme()
  const { user, isAuthenticated } = useUserAuth()
  const navigate = useNavigate()

  const favorites = useFavorites(user?.id)
  const isSaved = favorites.stores.includes(store.id)

  const statusColor =
    store.status === 'open'
      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
  const statusText = store.status === 'open' ? 'Open' : 'Coming Soon'

  const onToggleSave = (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (!isAuthenticated) {
      toast('Create a profile to save stores')
      navigate('/register')
      return
    }

    const nowSaved = toggleFavorite({ userId: user.id, type: 'store', id: store.id })
    pushNotification(user.id, {
      title: nowSaved ? 'Saved store' : 'Removed store',
      message: nowSaved ? store.name : `Removed ${store.name} from your favorites`
    })
    toast.success(nowSaved ? 'Saved' : 'Removed')
  }

  return (
    <Link
      to={`/mall/${mallId}/store/${store.id}`}
      className={`card-shadow rounded-lg overflow-hidden hover:no-underline group h-full transition-all duration-300 ${
        darkMode ? 'bg-gray-800 glass-card-dark' : 'bg-white glass-card'
      }`}
    >
      {/* Logo Container */}
      <div
        className={`relative overflow-hidden h-48 sm:h-56 md:h-64 ${
          darkMode ? 'bg-gray-700' : 'bg-gray-100'
        }`}
      >
        <img
          src={store.logo}
          alt={store.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 lazy"
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
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex justify-between items-start gap-2 mb-3">
          <div>
            <h3
              className={`font-display text-lg lg:text-xl font-bold group-hover:text-gold transition-colors duration-300 ${
                darkMode ? 'text-cream' : 'text-navy'
              }`}
            >
              {store.name}
            </h3>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-sage'}`}>{store.category}</p>
          </div>
          <span className={`text-xs font-semibold px-2 py-1 rounded-full whitespace-nowrap ${statusColor}`}>
            {statusText}
          </span>
        </div>

        {/* Meta Info */}
        <div className={`space-y-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          <p>
            <span className="font-semibold">Floor:</span> {store.floor}
          </p>
          <p>
            <span className="font-semibold">Hours:</span> {store.hours}
          </p>
        </div>

        {/* CTA */}
        <div className="mt-4 text-gold font-semibold group-hover:translate-x-1 transition-transform duration-300 inline-flex items-center">
          View Store →
        </div>
      </div>
    </Link>
  )
}
