import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useTheme } from '../contexts/ThemeContext'
import { useUserAuth } from '../contexts/UserAuthContext'
import mallsData from '../data/malls.json'
import storesData from '../data/stores.json'
import productsData from '../data/products.json'
import { toggleFavorite } from '../services/favorites'
import { getNotifications, markNotificationRead } from '../services/notifications'
import { getUserPreferences } from '../services/preferences'
import useFavorites from '../hooks/useFavorites'
import useCountUp from '../hooks/useCountUp'
import { getRecentEvents, getTopBehaviorIds, getTopCategories } from '../services/behavior'

const StatCard = ({ label, value, hint }) => {
  const { darkMode } = useTheme()
  return (
    <div className={`rounded-2xl p-6 card-shadow ${darkMode ? 'bg-gray-800 glass-card-dark' : 'bg-white glass-card'}`}>
      <p className={`text-sm font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{label}</p>
      <p className={`font-display text-4xl font-bold mt-2 ${darkMode ? 'text-cream' : 'text-navy'}`}>{value}</p>
      {hint ? <p className={`text-sm mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{hint}</p> : null}
    </div>
  )
}

export default function ProfilePage() {
  const { darkMode } = useTheme()
  const { user, logout } = useUserAuth()
  const navigate = useNavigate()

  const favorites = useFavorites(user?.id)
  const prefs = useMemo(() => getUserPreferences(user?.id), [user?.id])

  const [notificationsVersion, setNotificationsVersion] = useState(0)

  useEffect(() => {
    const handler = (e) => {
      if ((user?.id || 'guest') === e?.detail?.userId) {
        setNotificationsVersion((v) => v + 1)
      }
    }

    window.addEventListener('sme:notifications', handler)
    return () => window.removeEventListener('sme:notifications', handler)
  }, [user?.id])

  const notifications = useMemo(
    () => getNotifications(user?.id),
    [user?.id, notificationsVersion]
  )

  const favoriteMalls = useMemo(
    () => mallsData.filter((m) => favorites.malls.includes(m.id)),
    [favorites.malls]
  )

  const favoriteStores = useMemo(
    () => storesData.filter((s) => favorites.stores.includes(s.id)),
    [favorites.stores]
  )

  const favoriteProducts = useMemo(
    () => productsData.filter((p) => favorites.products.includes(p.id)),
    [favorites.products]
  )

  const recentActivity = useMemo(() => getRecentEvents(12), [])

  const recommendations = useMemo(() => {
    const topCategories = prefs.interests?.length ? prefs.interests : getTopCategories(2)

    const topMallIds = getTopBehaviorIds('mall', 3)
    const byCategory = storesData.filter((s) => topCategories.includes(s.category))

    const recommendedMall = mallsData.find((m) => topMallIds.includes(m.id)) || mallsData.find((m) => m.featured)
    const recommendedStores = byCategory.slice(0, 4)

    return {
      mall: recommendedMall,
      stores: recommendedStores
    }
  }, [prefs.interests])

  const totalFavorites = favorites.malls.length + favorites.stores.length + favorites.products.length
  const favCount = useCountUp(totalFavorites)
  const notifCount = useCountUp(notifications.filter((n) => !n.read).length)

  const removeFavorite = ({ type, id }) => {
    toggleFavorite({ userId: user.id, type, id })
    toast.success('Removed')
  }

  return (
    <div className="min-h-screen">
      <div className="section-padding max-w-6xl mx-auto">
        <div className="flex items-start justify-between gap-6 flex-wrap">
          <div>
            <h1 className="heading-medium mb-2">Your Profile</h1>
            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {user?.name} • {user?.email}
            </p>
          </div>

          <div className="flex gap-3">
            <button type="button" className="button-secondary button-3d" onClick={() => navigate('/onboarding')}>
              Preferences
            </button>
            <button
              type="button"
              className="button-primary button-3d"
              onClick={() => {
                logout()
                navigate('/')
              }}
            >
              Sign out
            </button>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard label="Favorites" value={favCount} hint="Saved malls, stores, and products" />
          <StatCard label="Unread notifications" value={notifCount} hint="Personalized alerts (demo)" />
          <StatCard
            label="Top interests"
            value={(prefs.interests?.length || 0).toString()}
            hint={prefs.interests?.length ? prefs.interests.slice(0, 3).join(' • ') : 'Complete onboarding to personalize'}
          />
        </div>

        <div className="mt-14 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className={`rounded-2xl p-6 md:p-8 ${darkMode ? 'bg-gray-800 glass-card-dark' : 'bg-white glass-card'}`}>
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <h2 className="font-display text-2xl font-bold">Saved</h2>
              <Link to="/" className="text-gold font-semibold hover:text-gold/80">
                Explore more →
              </Link>
            </div>

            <div className="mt-6 space-y-6">
              <div>
                <p className={`text-sm font-semibold mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Malls</p>
                {favoriteMalls.length ? (
                  <div className="space-y-3">
                    {favoriteMalls.map((mall) => (
                      <div key={mall.id} className={`flex items-center justify-between gap-4 rounded-xl p-4 border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                        <div>
                          <p className={`font-semibold ${darkMode ? 'text-cream' : 'text-navy'}`}>{mall.name}</p>
                          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{mall.location}</p>
                        </div>
                        <div className="flex gap-2">
                          <button type="button" className="button-secondary button-3d" onClick={() => navigate(`/mall/${mall.id}`)}>
                            Open
                          </button>
                          <button type="button" className="button-primary button-3d" onClick={() => removeFavorite({ type: 'mall', id: mall.id })}>
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>No saved malls yet.</p>
                )}
              </div>

              <div>
                <p className={`text-sm font-semibold mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Stores</p>
                {favoriteStores.length ? (
                  <div className="space-y-3">
                    {favoriteStores.map((store) => (
                      <div key={store.id} className={`flex items-center justify-between gap-4 rounded-xl p-4 border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                        <div>
                          <p className={`font-semibold ${darkMode ? 'text-cream' : 'text-navy'}`}>{store.name}</p>
                          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{store.category}</p>
                        </div>
                        <div className="flex gap-2">
                          <button type="button" className="button-secondary button-3d" onClick={() => navigate(`/mall/${store.mallId}/store/${store.id}`)}>
                            Open
                          </button>
                          <button type="button" className="button-primary button-3d" onClick={() => removeFavorite({ type: 'store', id: store.id })}>
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>No saved stores yet.</p>
                )}
              </div>

              <div>
                <p className={`text-sm font-semibold mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Products</p>
                {favoriteProducts.length ? (
                  <div className="space-y-3">
                    {favoriteProducts.map((p) => (
                      <div key={p.id} className={`flex items-center justify-between gap-4 rounded-xl p-4 border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                        <div>
                          <p className={`font-semibold ${darkMode ? 'text-cream' : 'text-navy'}`}>{p.name}</p>
                          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{p.category}</p>
                        </div>
                        <button type="button" className="button-primary button-3d" onClick={() => removeFavorite({ type: 'product', id: p.id })}>
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>No saved products yet.</p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className={`rounded-2xl p-6 md:p-8 ${darkMode ? 'bg-gray-800 glass-card-dark' : 'bg-white glass-card'}`}>
              <h2 className="font-display text-2xl font-bold">Discover for you</h2>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mt-2`}>
                Based on your interests and recent browsing.
              </p>

              <div className="mt-6 space-y-4">
                {recommendations.mall ? (
                  <div className={`rounded-xl p-5 border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <p className="text-gold text-sm font-semibold">Recommended mall</p>
                    <p className={`font-semibold text-lg ${darkMode ? 'text-cream' : 'text-navy'}`}>{recommendations.mall.name}</p>
                    <button type="button" className="button-secondary button-3d mt-4" onClick={() => navigate(`/mall/${recommendations.mall.id}`)}>
                      Explore
                    </button>
                  </div>
                ) : null}

                <div className={`rounded-xl p-5 border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <p className="text-gold text-sm font-semibold">Stores you may like</p>
                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {recommendations.stores.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        className={`text-left rounded-lg p-4 transition-colors button-3d ${darkMode ? 'bg-gray-900/40 hover:bg-gray-900/60' : 'bg-cream hover:bg-cream/80'}`}
                        onClick={() => navigate(`/mall/${s.mallId}/store/${s.id}`)}
                      >
                        <p className={`font-semibold ${darkMode ? 'text-cream' : 'text-navy'}`}>{s.name}</p>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{s.category}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className={`rounded-2xl p-6 md:p-8 ${darkMode ? 'bg-gray-800 glass-card-dark' : 'bg-white glass-card'}`}>
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <h2 className="font-display text-2xl font-bold">Notifications</h2>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {notifications.filter((n) => !n.read).length} unread
                </p>
              </div>

              <div className="mt-6 space-y-3">
                {notifications.length ? (
                  notifications.slice(0, 10).map((n) => (
                    <button
                      key={n.id}
                      type="button"
                      onClick={() => markNotificationRead(user?.id, n.id)}
                      className={`w-full text-left rounded-xl p-4 border transition-colors ${
                        n.read
                          ? darkMode
                            ? 'border-gray-700 text-gray-400'
                            : 'border-gray-200 text-gray-600'
                          : 'border-gold text-cream bg-gold/10'
                      }`}
                    >
                      <p className={`font-semibold ${n.read ? '' : 'text-gold'}`}>{n.title || 'Update'}</p>
                      {n.message ? <p className="text-sm mt-1">{n.message}</p> : null}
                    </button>
                  ))
                ) : (
                  <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    No notifications yet.
                  </p>
                )}
              </div>
            </div>

            <div className={`rounded-2xl p-6 md:p-8 ${darkMode ? 'bg-gray-800 glass-card-dark' : 'bg-white glass-card'}`}>
              <h2 className="font-display text-2xl font-bold">Recent activity</h2>
              <div className="mt-6 space-y-3">
                {recentActivity.length ? (
                  recentActivity.map((evt) => (
                    <div key={evt.id} className={`rounded-xl p-4 border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                      <div className="flex items-center justify-between gap-4">
                        <p className={`font-semibold ${darkMode ? 'text-cream' : 'text-navy'}`}>
                          Viewed {evt.type}
                        </p>
                        <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {new Date(evt.createdAt).toLocaleString()}
                        </p>
                      </div>
                      {evt.category ? (
                        <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Category: {evt.category}
                        </p>
                      ) : null}
                    </div>
                  ))
                ) : (
                  <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Browse malls and stores to build activity history.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
