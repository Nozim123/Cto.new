import { useTheme } from '../contexts/ThemeContext'
import { useUser } from '../contexts/UserContext'
import Button3D from './Button3D'

export default function StoreSubscribeSection({ storeId, storeName }) {
  const { darkMode } = useTheme()
  const { isFavorite, toggleFavorite, isAuthenticated } = useUser()

  if (!storeId) return null

  const subscribed = isFavorite('stores', storeId)

  return (
    <div
      className={`rounded-2xl border p-6 md:p-8 ${
        darkMode ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-white'
      }`}
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="min-w-0">
          <h3 className={`text-xl md:text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            🔔 Subscribe{storeName ? ` to ${storeName}` : ''}
          </h3>
          <p className={`mt-2 text-sm md:text-base ${darkMode ? 'text-white/70' : 'text-gray-600'}`}>
            Get notified when new products are added, when discounts start, and when the store posts updates.
          </p>
          {!isAuthenticated ? (
            <p className={`mt-2 text-xs ${darkMode ? 'text-white/50' : 'text-gray-500'}`}>
              Tip: sign in to sync your subscriptions across devices (demo).
            </p>
          ) : null}
        </div>

        <div className="flex-shrink-0">
          <Button3D
            variant={subscribed ? 'outline' : 'primary'}
            className="px-6 py-3"
            onClick={() => toggleFavorite('stores', storeId)}
          >
            {subscribed ? 'Subscribed' : 'Subscribe'}
          </Button3D>
        </div>
      </div>
    </div>
  )
}
