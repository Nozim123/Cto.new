import { useState, useEffect, useRef } from 'react'
import { useUser } from '../contexts/UserContext'
import { useTheme } from '../contexts/ThemeContext'
import { useLanguage } from '../contexts/LanguageContext'

export default function UserProfile({ isOpen, onClose }) {
  const { user, logout, updateProfile } = useUser()
  const { darkMode, colorPresets, accentColor, changeAccentColor } = useTheme()
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = useState('profile')
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || ''
  })
  const modalRef = useRef(null)

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || ''
      })
    }
  }, [user])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  const handleSave = () => {
    updateProfile(formData)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || ''
    })
    setIsEditing(false)
  }

  if (!isOpen || !user) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
      <div 
        ref={modalRef}
        className={`relative w-full max-w-md max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl transform transition-all duration-300 animate-slide-up ${
          darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
        }`}
      >
        {/* Header */}
        <div className={`relative px-6 py-4 border-b ${
          darkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
              {t('nav.profile')}
            </h2>
            <button 
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Tab Navigation */}
          <div className="flex mt-4">
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                activeTab === 'profile'
                  ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              {t('profile.title')}
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ml-2 ${
                activeTab === 'settings'
                  ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              {t('settings.title')}
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {activeTab === 'profile' && (
            <div className="space-y-6">
              {/* Profile Picture */}
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-400 to-purple-600 flex items-center justify-center text-white text-2xl font-bold mb-4">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <button className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                  {t('profile.edit')}
                </button>
              </div>

              {/* Profile Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t('profile.name')}
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
                        darkMode 
                          ? 'bg-gray-800 border-gray-700 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                  ) : (
                    <p className={`px-3 py-2 rounded-lg ${
                      darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-50 text-gray-700'
                    }`}>
                      {user.name || t('common.notSet')}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t('profile.email')}
                  </label>
                  <p className={`px-3 py-2 rounded-lg ${
                    darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-50 text-gray-700'
                  }`}>
                    {user.email}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t('profile.phone')}
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
                        darkMode 
                          ? 'bg-gray-800 border-gray-700 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                  ) : (
                    <p className={`px-3 py-2 rounded-lg ${
                      darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-50 text-gray-700'
                    }`}>
                      {user.phone || t('common.notSet')}
                    </p>
                  )}
                </div>

                {/* Edit Actions */}
                <div className="flex gap-3 pt-4">
                  {isEditing ? (
                    <>
                      <button
                        onClick={handleSave}
                        className="flex-1 button-3d bg-gradient-to-r from-purple-500 to-purple-700 text-white py-2 px-4 rounded-lg font-medium hover:from-purple-600 hover:to-purple-800 transition-all"
                      >
                        {t('profile.save')}
                      </button>
                      <button
                        onClick={handleCancel}
                        className="flex-1 px-4 py-2 rounded-lg font-medium border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                      >
                        {t('profile.cancel')}
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="w-full button-3d bg-gradient-to-r from-purple-500 to-purple-700 text-white py-2 px-4 rounded-lg font-medium hover:from-purple-600 hover:to-purple-800 transition-all"
                    >
                      {t('profile.edit')}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              {/* Theme Settings */}
              <div>
                <h3 className="text-lg font-semibold mb-4">{t('settings.themeSettings')}</h3>
                <div className="grid grid-cols-3 gap-3">
                  {Object.entries(colorPresets).map(([key, colors]) => (
                    <button
                      key={key}
                      onClick={() => changeAccentColor(key)}
                      className={`p-3 rounded-xl border-2 transition-all transform hover:scale-105 ${
                        accentColor === key 
                          ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' 
                          : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'
                      }`}
                    >
                      <div className={`w-full h-8 rounded-lg mb-2 bg-gradient-to-r ${colors.gradient}`}></div>
                      <span className="text-xs font-medium capitalize">{key}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Language Settings */}
              <div>
                <h3 className="text-lg font-semibold mb-4">{t('settings.languageSettings')}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {t('settings.language')}
                </p>
                <p className="text-sm bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 p-3 rounded-lg">
                  🌐 Use the language switcher in the navigation to change your preferred language
                </p>
              </div>

              {/* Notifications */}
              <div>
                <h3 className="text-lg font-semibold mb-4">{t('settings.notifications')}</h3>
                <div className="space-y-3">
                  <label className="flex items-center justify-between">
                    <span className="text-sm">Mall Updates</span>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </label>
                  <label className="flex items-center justify-between">
                    <span className="text-sm">Promotions</span>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </label>
                  <label className="flex items-center justify-between">
                    <span className="text-sm">Events</span>
                    <input type="checkbox" className="rounded" />
                  </label>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={logout}
                  className="w-full px-4 py-3 rounded-lg font-medium text-red-600 border border-red-200 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                >
                  🚪 {t('nav.logout')}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}