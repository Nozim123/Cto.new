import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useTheme } from '../contexts/ThemeContext'
import { useLanguage } from '../contexts/LanguageContext'
import { useUser } from '../contexts/UserContext'
import DarkModeToggle from './DarkModeToggle'
import LanguageSwitcher from './LanguageSwitcher'
import UserProfile from './UserProfile'
import GlobalSearch from './GlobalSearch'
import AuthModal from './AuthModal'
import { Menu, X, Home, ShoppingBag, Gift, Calendar, MapPin, User, Info, Mail } from 'lucide-react'

export default function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)
  const { darkMode, seasonalColors } = useTheme()
  const { t } = useLanguage()
  const { isAuthenticated, user } = useUser()

  const navLinks = [
    { to: '/', label: t('nav.home'), icon: Home },
    { to: '/stores', label: t('stores.title'), icon: ShoppingBag },
    { to: '/promotions', label: t('nav.promotions') || t('home.promotions') || 'Promotions', icon: Gift },
    { to: '/events', label: t('home.events') || 'Events', icon: Calendar },
    { to: '/map', label: t('map.title'), icon: MapPin },
    { href: '#about', label: t('nav.about'), icon: Info },
    { href: '#contact', label: t('nav.contact'), icon: Mail },
  ]

  return (
    <nav
      className={`sticky top-0 z-50 shadow-lg backdrop-blur-xl transition-all duration-500 mtc-glass`}
    >
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative">
              <span className="font-display text-xl lg:text-2xl font-bold mtc-gradient-text group-hover:scale-105 transition-transform duration-300">
                MTC
              </span>
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-600 group-hover:w-full transition-all duration-500"></div>
            </div>
            <span
              className="font-display text-sm lg:text-base font-semibold hidden sm:inline transition-all duration-300 hover:scale-110 opacity-70 text-white/80"
            >
              Mega Travel Center
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-6 items-center">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                href={link.href}
                className="relative overflow-hidden group flex items-center gap-1.5"
              >
                <span className="hover:text-purple-500 transition-all duration-300 transform hover:scale-110 block text-sm font-medium">
                  {link.label}
                </span>
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-500 group-hover:w-full transition-all duration-300"></div>
              </Link>
            ))}

            <div className="flex items-center gap-3 pl-4 border-l border-gray-200 dark:border-gray-700">
              <LanguageSwitcher />
              <DarkModeToggle />

              {isAuthenticated && user ? (
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-400 to-purple-600 flex items-center justify-center text-white font-bold text-sm hover:from-purple-300 hover:to-purple-500 transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-purple-500/25"
                  aria-label={t('nav.profile') || 'Profile'}
                >
                  <User size={18} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setAuthOpen(true)}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-purple-700 text-white text-sm font-semibold hover:from-purple-400 hover:to-purple-600 transition-all shadow-lg flex items-center gap-2"
                >
                  <User size={16} />
                  <span>{t('common.login') || 'Sign in'}</span>
                </button>
              )}

              {isAuthenticated && user ? (
                <Link
                  to="/account"
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-sm font-semibold text-white"
                >
                  {t('account.title') || 'Account'}
                </Link>
              ) : null}
            </div>
          </div>

          {/* Mobile Menu Button & Controls */}
          <div className="md:hidden flex items-center gap-2">
            <LanguageSwitcher />
            <DarkModeToggle />
            <button
              className={`text-purple-600 p-2.5 rounded-xl hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-all duration-300`}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Global Smart Search */}
        <div className="mt-3">
          <GlobalSearch />
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div
            className={`md:hidden mt-4 pb-4 border-t border-opacity-20 pt-4 ${
              darkMode ? 'border-purple-500/30' : 'border-purple-200/50'
            } animate-slide-down`}
          >
            {navLinks.map((link) => {
              const Icon = link.icon
              return (
                <Link
                  key={link.label}
                  to={link.to}
                  href={link.href}
                  className="flex items-center gap-3 py-3.5 px-4 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-600 transition-all duration-300 transform hover:translate-x-2"
                  onClick={() => setMenuOpen(false)}
                >
                  <Icon size={20} className="flex-shrink-0" />
                  <span className="font-medium">{link.label}</span>
                </Link>
              )
            })}

            {isAuthenticated && user ? (
              <>
                <Link
                  to="/account"
                  className="flex items-center gap-3 py-3.5 px-4 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-600 transition-all duration-300 transform hover:translate-x-2"
                  onClick={() => setMenuOpen(false)}
                >
                  <User size={20} className="flex-shrink-0" />
                  <span className="font-medium">{t('account.title') || 'Account'}</span>
                </Link>
                <button
                  onClick={() => {
                    setProfileOpen(!profileOpen)
                    setMenuOpen(false)
                  }}
                  className="flex items-center gap-3 w-full text-left py-3.5 px-4 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-600 transition-all duration-300 transform hover:translate-x-2"
                >
                  <User size={20} className="flex-shrink-0" />
                  <span className="font-medium">{t('nav.profile')}</span>
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setAuthOpen(true)
                  setMenuOpen(false)
                }}
                className="flex items-center gap-3 w-full text-left py-3.5 px-4 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-600 transition-all duration-300 transform hover:translate-x-2"
              >
                <User size={20} className="flex-shrink-0" />
                <span className="font-medium">{t('common.login') || 'Sign in'}</span>
              </button>
            )}
          </div>
        )}
      </div>

      {isAuthenticated && user ? (
        <UserProfile isOpen={profileOpen} onClose={() => setProfileOpen(false)} />
      ) : null}
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </nav>
  )
}
