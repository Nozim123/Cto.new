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

export default function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)
  const { darkMode, seasonalColors } = useTheme()
  const { t } = useLanguage()
  const { isAuthenticated, user } = useUser()

  return (
    <nav
      className={`sticky top-0 z-50 shadow-lg backdrop-blur-xl transition-all duration-500 ${
        darkMode
          ? 'bg-gray-900/95 text-cream border-b border-purple-500/20'
          : 'bg-white/95 text-navy border-b border-purple-200/50'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative">
              <span className="font-display text-xl lg:text-2xl font-bold bg-gradient-to-r from-purple-400 via-purple-600 to-purple-800 bg-clip-text text-transparent group-hover:from-purple-300 group-hover:via-purple-500 group-hover:to-purple-700 transition-all duration-500 transform group-hover:scale-105">
                MTC
              </span>
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-purple-600 group-hover:w-full transition-all duration-500"></div>
            </div>
            <span
              className="font-display text-sm lg:text-base font-semibold hidden sm:inline transition-all duration-300 hover:scale-110 opacity-70"
              style={{ color: seasonalColors.primary }}
            >
              Mega Travel Center
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-8 items-center">
            <Link to="/" className="relative overflow-hidden group">
              <span className="hover:text-purple-500 transition-all duration-300 transform hover:scale-110 block">
                {t('nav.home')}
              </span>
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-500 group-hover:w-full transition-all duration-300"></div>
            </Link>
            <Link to="/stores" className="relative overflow-hidden group">
              <span className="hover:text-purple-500 transition-all duration-300 transform hover:scale-110 block">
                {t('stores.title')}
              </span>
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-500 group-hover:w-full transition-all duration-300"></div>
            </Link>
            <Link to="/promotions" className="relative overflow-hidden group">
              <span className="hover:text-purple-500 transition-all duration-300 transform hover:scale-110 block">
                {t('nav.promotions') || t('home.promotions') || 'Promotions'}
              </span>
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-500 group-hover:w-full transition-all duration-300"></div>
            </Link>
            <Link to="/events" className="relative overflow-hidden group">
              <span className="hover:text-purple-500 transition-all duration-300 transform hover:scale-110 block">
                {t('home.events') || 'Events'}
              </span>
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-500 group-hover:w-full transition-all duration-300"></div>
            </Link>
            <Link to="/map" className="relative overflow-hidden group">
              <span className="hover:text-purple-500 transition-all duration-300 transform hover:scale-110 block">
                {t('map.title')}
              </span>
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-500 group-hover:w-full transition-all duration-300"></div>
            </Link>
            <a href="#about" className="relative overflow-hidden group">
              <span className="hover:text-purple-500 transition-all duration-300 transform hover:scale-110 block">
                {t('nav.about')}
              </span>
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-500 group-hover:w-full transition-all duration-300"></div>
            </a>
            <a href="#contact" className="relative overflow-hidden group">
              <span className="hover:text-purple-500 transition-all duration-300 transform hover:scale-110 block">
                {t('nav.contact')}
              </span>
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-500 group-hover:w-full transition-all duration-300"></div>
            </a>

            <div className="flex items-center gap-4">
              <LanguageSwitcher />
              <DarkModeToggle />

              {isAuthenticated && user ? (
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-400 to-purple-600 flex items-center justify-center text-white font-bold text-sm hover:from-purple-300 hover:to-purple-500 transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-purple-500/25"
                  aria-label={t('nav.profile') || 'Profile'}
                >
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setAuthOpen(true)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-purple-700 text-white text-sm font-semibold hover:from-purple-400 hover:to-purple-600 transition-all shadow-lg"
                >
                  {t('common.login') || 'Sign in'}
                </button>
              )}

              {isAuthenticated && user ? (
                <Link
                  to="/account"
                  className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-sm font-semibold text-white"
                >
                  {t('account.title') || 'Account'}
                </Link>
              ) : null}
            </div>
          </div>

          {/* Mobile Menu Button & Controls */}
          <div className="md:hidden flex items-center gap-3">
            <LanguageSwitcher />
            <DarkModeToggle />
            <button
              className="text-purple-600 text-2xl p-2 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-all duration-300"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              <div className="w-6 h-6 flex flex-col justify-center items-center">
                <div
                  className={`w-5 h-0.5 bg-current transition-all duration-300 ${
                    menuOpen ? 'rotate-45 translate-y-1.5' : ''
                  }`}
                ></div>
                <div
                  className={`w-5 h-0.5 bg-current transition-all duration-300 mt-1 ${
                    menuOpen ? 'opacity-0' : ''
                  }`}
                ></div>
                <div
                  className={`w-5 h-0.5 bg-current transition-all duration-300 mt-1 ${
                    menuOpen ? '-rotate-45 -translate-y-1.5' : ''
                  }`}
                ></div>
              </div>
            </button>
          </div>
        </div>

        {/* Global Smart Search */}
        <div className="mt-4">
          <GlobalSearch />
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div
            className={`md:hidden mt-4 pb-4 border-t border-opacity-20 pt-4 ${
              darkMode ? 'border-purple-500/30' : 'border-purple-200/50'
            } animate-slide-down`}
          >
            <Link
              to="/"
              className="block py-3 px-4 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-600 transition-all duration-300 transform hover:translate-x-2"
              onClick={() => setMenuOpen(false)}
            >
              {t('nav.home')}
            </Link>
            <Link
              to="/stores"
              className="block py-3 px-4 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-600 transition-all duration-300 transform hover:translate-x-2"
              onClick={() => setMenuOpen(false)}
            >
              {t('stores.title')}
            </Link>
            <Link
              to="/promotions"
              className="block py-3 px-4 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-600 transition-all duration-300 transform hover:translate-x-2"
              onClick={() => setMenuOpen(false)}
            >
              {t('nav.promotions') || t('home.promotions') || 'Promotions'}
            </Link>
            <Link
              to="/events"
              className="block py-3 px-4 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-600 transition-all duration-300 transform hover:translate-x-2"
              onClick={() => setMenuOpen(false)}
            >
              {t('home.events') || 'Events'}
            </Link>
            <Link
              to="/map"
              className="block py-3 px-4 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-600 transition-all duration-300 transform hover:translate-x-2"
              onClick={() => setMenuOpen(false)}
            >
              {t('map.title')}
            </Link>
            <a
              href="#about"
              className="block py-3 px-4 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-600 transition-all duration-300 transform hover:translate-x-2"
              onClick={() => setMenuOpen(false)}
            >
              {t('nav.about')}
            </a>
            <a
              href="#contact"
              className="block py-3 px-4 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-600 transition-all duration-300 transform hover:translate-x-2"
              onClick={() => setMenuOpen(false)}
            >
              {t('nav.contact')}
            </a>

            {isAuthenticated && user ? (
              <>
                <Link
                  to="/account"
                  className="block py-3 px-4 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-600 transition-all duration-300 transform hover:translate-x-2"
                  onClick={() => setMenuOpen(false)}
                >
                  {t('account.title') || 'Account'}
                </Link>
                <button
                  onClick={() => {
                    setProfileOpen(!profileOpen)
                    setMenuOpen(false)
                  }}
                  className="block w-full text-left py-3 px-4 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-600 transition-all duration-300 transform hover:translate-x-2"
                >
                  {t('nav.profile')}
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setAuthOpen(true)
                  setMenuOpen(false)
                }}
                className="block w-full text-left py-3 px-4 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-600 transition-all duration-300 transform hover:translate-x-2"
              >
                {t('common.login') || 'Sign in'}
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
