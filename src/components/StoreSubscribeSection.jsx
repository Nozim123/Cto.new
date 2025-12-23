import { useState, useEffect } from 'react'
import { useTheme } from '../contexts/ThemeContext'
import { useUser } from '../contexts/UserContext'
import { toast } from 'react-hot-toast'
import realTimeService from '../services/realTimeService'
import Button3D from './Button3D'

export default function StoreSubscribeSection({ storeId, storeName }) {
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const { darkMode } = useTheme()
  const { isAuthenticated, addToFavorites, removeFromFavorites } = useUser()

  // Get subscription status from user context
  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem('samarkand-favorites') || '{}')
    setIsSubscribed(favorites.stores?.[storeId] || false)
  }, [storeId])

  // Subscribe to real-time updates for this store
  useEffect(() => {
    if (isSubscribed && storeId) {
      const unsubscribe = realTimeService.subscribe('store', storeId, (updateData) => {
        if (updateData.notifications > 0) {
          toast.success(`📢 ${updateData.newProducts} new products added to ${storeName}!`)
          setNotifications(prev => [...prev, {
            id: Date.now(),
            type: 'new_products',
            message: `${updateData.newProducts} new products added`,
            timestamp: new Date().toLocaleTimeString()
          }])
        }
        
        if (updateData.discounts?.length > 0) {
          updateData.discounts.forEach(discount => {
            toast.success(`🎉 New discount at ${storeName}: ${discount}`)
            setNotifications(prev => [...prev, {
              id: Date.now(),
              type: 'discount',
              message: `New discount: ${discount}`,
              timestamp: new Date().toLocaleTimeString()
            }])
          })
        }
      })

      return unsubscribe
    }
  }, [isSubscribed, storeId, storeName])

  const handleSubscribe = async () => {
    if (isLoading) return
    
    setIsLoading(true)
    try {
      const favorites = JSON.parse(localStorage.getItem('samarkand-favorites') || '{}')
      
      if (!favorites.stores) {
        favorites.stores = {}
      }

      if (isSubscribed) {
        // Unsubscribe
        removeFromFavorites('stores', storeId)
        delete favorites.stores[storeId]
        setIsSubscribed(false)
        toast.success(`Unsubscribed from ${storeName} notifications`)
        
        // Clear notifications
        setNotifications([])
      } else {
        // Subscribe
        addToFavorites('stores', storeId)
        favorites.stores[storeId] = {
          name: storeName,
          subscribedAt: new Date().toISOString(),
          notifications: true
        }
        setIsSubscribed(true)
        toast.success(`Successfully subscribed to ${storeName}!`)
        
        // Simulate welcome notification
        setTimeout(() => {
          toast.success(`🎉 Welcome! You'll get notified about new products and discounts from ${storeName}`)
        }, 1000)
      }

      localStorage.setItem('samarkand-favorites', JSON.stringify(favorites))
    } catch (error) {
      console.error('Subscription error:', error)
      toast.error('Failed to update subscription. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const clearNotifications = () => {
    setNotifications([])
    toast.success('Notifications cleared')
  }

  return (
    <div
      className={`rounded-2xl border p-6 md:p-8 ${
        darkMode ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-white'
      } shadow-lg`}
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className={`text-xl md:text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              🔔 Subscribe to {storeName}
            </h3>
            {isSubscribed && (
              <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full animate-pulse">
                ACTIVE
              </span>
            )}
          </div>
          
          <p className={`text-sm md:text-base ${darkMode ? 'text-white/70' : 'text-gray-600'} mb-3`}>
            Get instant notifications when:
          </p>
          
          <ul className={`text-sm space-y-1 ${darkMode ? 'text-white/60' : 'text-gray-500'} mb-4`}>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              New products are added
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              Special discounts start
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              Store updates and news
            </li>
          </ul>

          {!isAuthenticated && (
            <p className={`text-xs ${darkMode ? 'text-white/50' : 'text-gray-500'}`}>
              💡 Tip: Sign in to sync your subscriptions across all devices
            </p>
          )}

          {/* Notifications Panel */}
          {isSubscribed && notifications.length > 0 && (
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                  Recent Notifications ({notifications.length})
                </span>
                <button
                  onClick={clearNotifications}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Clear all
                </button>
              </div>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {notifications.slice(-3).map(notification => (
                  <div key={notification.id} className="text-xs text-blue-700 dark:text-blue-300 flex items-center gap-2">
                    <span className="w-1 h-1 bg-blue-500 rounded-full"></span>
                    <span>{notification.message}</span>
                    <span className="text-blue-500">({notification.timestamp})</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex-shrink-0 flex flex-col gap-2">
          <Button3D
            variant={isSubscribed ? 'outline' : 'primary'}
            className="px-6 py-3 min-w-[140px]"
            onClick={handleSubscribe}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                {isSubscribed ? 'Updating...' : 'Subscribing...'}
              </span>
            ) : (
              isSubscribed ? 'Unsubscribe' : 'Subscribe'
            )}
          </Button3D>

          {/* Connection Status */}
          <div className="text-center">
            <div className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
              isSubscribed 
                ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
                : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
            }`}>
              <div className={`w-2 h-2 rounded-full ${isSubscribed ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
              {isSubscribed ? 'Live Updates On' : 'Notifications Off'}
            </div>
          </div>
        </div>
      </div>

      {/* Real-time features info */}
      {isSubscribed && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
            <span className="text-lg">🟢</span>
            <span>Real-time notifications active</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              (Updates every 30 seconds)
            </span>
          </div>
        </div>
      )}
    </div>
  )
}