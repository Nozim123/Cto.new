import { useState, useEffect } from 'react'
import { useUser } from '../contexts/UserContext'
import { useTheme } from '../contexts/ThemeContext'
import { useLanguage } from '../contexts/LanguageContext'
import { useEcosystem } from '../contexts/EcosystemContext'
import { useNavigate } from 'react-router-dom'
import Button3D from '../components/Button3D'
import ModernProductCard from '../components/ModernProductCard'
import StoreCard from '../components/StoreCard'
import MallCard from '../components/MallCard'
import { motion, AnimatePresence } from 'framer-motion'

export default function UserProfilePage() {
  const { user, logout, isAuthenticated, favorites, toggleFavorite } = useUser()
  const { darkMode } = useTheme()
  const { t } = useLanguage()
  const { stores, malls, products } = useEcosystem()
  const navigate = useNavigate()
  
  const [activeTab, setActiveTab] = useState('profile')
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    language: user?.language || 'uz',
    notifications: user?.notifications || {
      mallUpdates: true,
      promotions: true,
      events: false,
      lowStock: true,
      email: true,
      push: true
    }
  })

  if (!isAuthenticated || !user) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="text-center">
          <h1 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Please login to view your profile
          </h1>
          <Button3D onClick={() => navigate('/login')} variant="primary">
            Login
          </Button3D>
        </div>
      </div>
    )
  }

  const favoriteStores = stores.filter(s => favorites.stores.includes(s.id))
  const favoriteProducts = products.filter(p => favorites.products.includes(p.id))
  const favoriteMalls = malls.filter(m => favorites.malls.includes(m.id))

  const handleSaveProfile = () => {
    // In a real app, this would be an API call
    console.log('Saving profile:', profileData)
    setIsEditing(false)
  }

  const toggleNotificationSetting = (key) => {
    setProfileData(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: !prev.notifications[key]
      }
    }))
  }

  const tabs = [
    { id: 'profile', label: '👤 Profile', icon: '👤' },
    { id: 'favorites', label: `❤️ Favorites (${favorites.stores.length + favorites.products.length + favorites.malls.length})`, icon: '❤️' },
    { id: 'notifications', label: '🔔 Notifications', icon: '🔔' },
    { id: 'history', label: '📜 History', icon: '📜' },
    { id: 'loyalty', label: '🎁 Loyalty', icon: '🎁' }
  ]

  return (
    <div className={`min-h-screen pb-20 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className="relative h-48 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-purple-800"></div>
        <div className="absolute inset-0 bg-black/30"></div>
        
        <div className="relative z-10 max-w-6xl mx-auto px-4 lg:px-8 h-full flex items-center">
          <div className="w-full">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-4xl text-white border-4 border-white/30">
                {user.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="text-white">
                <h1 className="text-3xl font-bold mb-1">{user.name}</h1>
                <p className="text-white/90">{user.email}</p>
                <p className="text-white/80 text-sm mt-1">Member since {new Date(user.joinDate).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 lg:px-8 -mt-8">
        {/* Profile Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className={`p-4 rounded-xl border ${darkMode ? 'border-white/10 bg-white/5' : 'border-white/20 bg-white/90'} backdrop-blur-sm`}>
            <div className="text-2xl font-bold text-purple-600">{favorites.stores.length}</div>
            <div className="text-sm text-gray-600">Favorite Stores</div>
          </div>
          <div className={`p-4 rounded-xl border ${darkMode ? 'border-white/10 bg-white/5' : 'border-white/20 bg-white/90'} backdrop-blur-sm`}>
            <div className="text-2xl font-bold text-purple-600">{favorites.products.length}</div>
            <div className="text-sm text-gray-600">Wishlist</div>
          </div>
          <div className={`p-4 rounded-xl border ${darkMode ? 'border-white/10 bg-white/5' : 'border-white/20 bg-white/90'} backdrop-blur-sm`}>
            <div className="text-2xl font-bold text-purple-600">{user.points || 0}</div>
            <div className="text-sm text-gray-600">Loyalty Points</div>
          </div>
          <div className={`p-4 rounded-xl border ${darkMode ? 'border-white/10 bg-white/5' : 'border-white/20 bg-white/90'} backdrop-blur-sm`}>
            <div className="text-2xl font-bold text-purple-600">{user.tier || 'Bronze'}</div>
            <div className="text-sm text-gray-600">Member Tier</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 border-b border-gray-700 pb-4">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-purple-600 text-white'
                    : darkMode ? 'text-gray-300 hover:bg-white/10' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="mb-12"
          >
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className={`p-6 rounded-2xl border ${darkMode ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-white'}`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Personal Information</h3>
                    {!isEditing && (
                      <Button3D onClick={() => setIsEditing(true)} variant="outline" size="sm">
                        Edit
                      </Button3D>
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                        Full Name
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={profileData.name}
                          onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                          className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-purple-500 ${
                            darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300'
                          }`}
                        />
                      ) : (
                        <p className={`px-4 py-3 rounded-lg ${darkMode ? 'bg-gray-800 text-white' : 'bg-gray-50'}`}>
                          {user.name}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                        Email
                      </label>
                      <p className={`px-4 py-3 rounded-lg ${darkMode ? 'bg-gray-800 text-white' : 'bg-gray-50'}`}>
                        {user.email}
                      </p>
                    </div>

                    <div>
                      <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                        Phone
                      </label>
                      {isEditing ? (
                        <input
                          type="tel"
                          value={profileData.phone}
                          onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                          className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-purple-500 ${
                            darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300'
                          }`}
                        />
                      ) : (
                        <p className={`px-4 py-3 rounded-lg ${darkMode ? 'bg-gray-800 text-white' : 'bg-gray-50'}`}>
                          {user.phone || 'Not set'}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                        Preferred Language
                      </label>
                      {isEditing ? (
                        <select
                          value={profileData.language}
                          onChange={(e) => setProfileData({...profileData, language: e.target.value})}
                          className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-purple-500 ${
                            darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300'
                          }`}
                        >
                          <option value="uz">🇺🇿 Uzbek</option>
                          <option value="ru">🇷🇺 Russian</option>
                          <option value="en">🇬🇧 English</option>
                          <option value="tr">🇹🇷 Turkish</option>
                        </select>
                      ) : (
                        <p className={`px-4 py-3 rounded-lg ${darkMode ? 'bg-gray-800 text-white' : 'bg-gray-50'}`}>
                          {profileData.language.toUpperCase()}
                        </p>
                      )}
                    </div>
                  </div>

                  {isEditing && (
                    <div className="flex gap-3 mt-6">
                      <Button3D onClick={handleSaveProfile} variant="primary">
                        Save Changes
                      </Button3D>
                      <Button3D onClick={() => setIsEditing(false)} variant="outline">
                        Cancel
                      </Button3D>
                    </div>
                  )}
                </div>

                <div className={`p-6 rounded-2xl border ${darkMode ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-white'}`}>
                  <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>Communication Preferences</h3>
                  
                  <div className="space-y-3">
                    <label className="flex items-center justify-between">
                      <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>Email notifications</span>
                      <input
                        type="checkbox"
                        checked={profileData.notifications.email}
                        onChange={() => toggleNotificationSetting('email')}
                        disabled={!isEditing}
                        className="rounded"
                      />
                    </label>
                    <label className="flex items-center justify-between">
                      <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>Push notifications</span>
                      <input
                        type="checkbox"
                        checked={profileData.notifications.push}
                        onChange={() => toggleNotificationSetting('push')}
                        disabled={!isEditing}
                        className="rounded"
                      />
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Favorites Tab */}
            {activeTab === 'favorites' && (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className={`p-4 rounded-xl border ${darkMode ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-white'}`}>
                    <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-3`}>🏬 Favorite Malls ({favoriteMalls.length})</h4>
                  </div>
                  <div className={`p-4 rounded-xl border ${darkMode ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-white'}`}>
                    <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-3`}>🏪 Favorite Stores ({favoriteStores.length})</h4>
                  </div>
                  <div className={`p-4 rounded-xl border ${darkMode ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-white'}`}>
                    <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-3`}>🛍️ Wishlist ({favoriteProducts.length})</h4>
                  </div>
                </div>

                {/* Favorite Malls */}
                {favoriteMalls.length > 0 && (
                  <div className="mb-8">
                    <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>Favorite Malls</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {favoriteMalls.map(mall => (
                        <MallCard key={mall.id} mall={mall} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Favorite Stores */}
                {favoriteStores.length > 0 && (
                  <div className="mb-8">
                    <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>Favorite Stores</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {favoriteStores.map(store => (
                        <StoreCard key={store.id} store={store} mallId={store.mallId} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Favorite Products */}
                {favoriteProducts.length > 0 && (
                  <div className="mb-8">
                    <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>Wishlist</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {favoriteProducts.map(product => (
                        <ModernProductCard key={product.id} product={product} />
                      ))}
                    </div>
                  </div>
                )}

                {favoriteMalls.length === 0 && favoriteStores.length === 0 && favoriteProducts.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-4xl mb-4">💔</div>
                    <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>No favorites yet. Start exploring!</p>
                  </div>
                )}
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className={`p-6 rounded-2xl border ${darkMode ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-white'}`}>
                <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-6`}>Notification Settings</h3>
                
                <div className="space-y-4">
                  <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                    <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-3`}>🎯 Mall & Shopping</h4>
                    <div className="space-y-3">
                      <label className="flex items-center justify-between">
                        <span>New stores in favorite malls</span>
                        <input type="checkbox" className="rounded" defaultChecked />
                      </label>
                      <label className="flex items-center justify-between">
                        <span>Store opening/closing changes</span>
                        <input type="checkbox" className="rounded" />
                      </label>
                      <label className="flex items-center justify-between">
                        <span>Mall events and promotions</span>
                        <input type="checkbox" className="rounded" defaultChecked />
                      </label>
                    </div>
                  </div>

                  <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                    <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-3`}>🛍️ Products & Deals</h4>
                    <div className="space-y-3">
                      <label className="flex items-center justify-between">
                        <span>Price drops on wishlist items</span>
                        <input type="checkbox" className="rounded" defaultChecked />
                      </label>
                      <label className="flex items-center justify-between">
                        <span>Back in stock notifications</span>
                        <input type="checkbox" className="rounded" defaultChecked />
                      </label>
                      <label className="flex items-center justify-between">
                        <span>Flash sales and limited offers</span>
                        <input type="checkbox" className="rounded" />
                      </label>
                      <label className="flex items-center justify-between">
                        <span>New arrivals in favorite stores</span>
                        <input type="checkbox" className="rounded" defaultChecked />
                      </label>
                    </div>
                  </div>

                  <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                    <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-3`}>🎁 Loyalty & Rewards</h4>
                    <div className="space-y-3">
                      <label className="flex items-center justify-between">
                        <span>Points earned notifications</span>
                        <input type="checkbox" className="rounded" defaultChecked />
                      </label>
                      <label className="flex items-center justify-between">
                        <span>Reward available alerts</span>
                        <input type="checkbox" className="rounded" />
                      </label>
                      <label className="flex items-center justify-between">
                        <span>Tier upgrade notifications</span>
                        <input type="checkbox" className="rounded" defaultChecked />
                      </label>
                      <label className="flex items-center justify-between">
                        <span>Birthday rewards</span>
                        <input type="checkbox" className="rounded" defaultChecked />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* History Tab */}
            {activeTab === 'history' && (
              <div>
                <div className={`p-6 rounded-2xl border ${darkMode ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-white'}`}>
                  <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-6`}>Recently Viewed</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-3`}>Stores</h4>
                      <div className="space-y-2">
                        {/* Mock recently viewed stores */}
                        {stores.slice(0, 3).map(store => (
                          <div key={store.id} className={`p-3 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                            <p className="font-medium">{store.name}</p>
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              Viewed 2 days ago
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-3`}>Products</h4>
                      <div className="space-y-2">
                        {/* Mock recently viewed products */}
                        {products.slice(0, 3).map(product => (
                          <div key={product.id} className={`p-3 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                            <p className="font-medium">{product.name}</p>
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              Viewed 1 day ago
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-700">
                    <Button3D variant="outline" size="sm">
                      Clear History
                    </Button3D>
                  </div>
                </div>
              </div>
            )}

            {/* Loyalty Tab */}
            {activeTab === 'loyalty' && (
              <div className={`p-6 rounded-2xl border ${darkMode ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-white'}`}>
                <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-6`}>Loyalty Program</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className={`p-4 rounded-xl border ${darkMode ? 'border-purple-500/30 bg-purple-900/20' : 'border-purple-200 bg-purple-50'}`}>
                    <h4 className="font-semibold text-purple-600 mb-2">Current Tier</h4>
                    <div className="text-3xl font-bold text-purple-600">🥉 Bronze</div>
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} mt-2`}>
                      Earn 1000 points to reach Silver tier
                    </p>
                  </div>

                  <div className={`p-4 rounded-xl border ${darkMode ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-white'}`}>
                    <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>Points Balance</h4>
                    <div className="text-3xl font-bold text-purple-600">{user.points || 0}</div>
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} mt-2`}>
                      Points available for rewards
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>Available Rewards</h4>
                  <div className="space-y-3">
                    <div className={`p-3 rounded-lg border ${darkMode ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-white'}`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>10% off any purchase</p>
                          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>500 points</p>
                        </div>
                        <Button3D variant="primary" size="sm" disabled={(user.points || 0) < 500}>
                          Redeem
                        </Button3D>
                      </div>
                    </div>

                    <div className={`p-3 rounded-lg border ${darkMode ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-white'}`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Free shipping</p>
                          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>300 points</p>
                        </div>
                        <Button3D variant="primary" size="sm" disabled={(user.points || 0) < 300}>
                          Redeem
                        </Button3D>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Danger Zone */}
        <div className={`mt-12 p-6 rounded-2xl border border-red-500/30 ${darkMode ? 'bg-red-900/20' : 'bg-red-50'}`}>
          <h3 className={`text-xl font-bold ${darkMode ? 'text-red-400' : 'text-red-600'} mb-4`}>⚠️ Danger Zone</h3>
          <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-4`}>
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <Button3D variant="danger" onClick={() => {
            if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
              // Handle account deletion
              logout()
              navigate('/')
            }
          }}>
            Delete Account
          </Button3D>
        </div>
      </div>
    </div>
  )
}