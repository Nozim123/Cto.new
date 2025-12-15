import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useTheme } from '../contexts/ThemeContext'
import { useLanguage } from '../contexts/LanguageContext'
import DarkModeToggle from './DarkModeToggle'
import ProfileSidebar from './ProfileSidebar'
import { User, Menu } from 'lucide-react'

export default function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const { darkMode, seasonalColors } = useTheme()
  const { t } = useLanguage()

  return (
    <>
      <nav className={`sticky top-0 z-50 shadow-md backdrop-blur-lg transition-colors duration-300 ${
        darkMode 
          ? 'bg-slate-900/90 text-slate-200' 
          : 'bg-white/90 text-slate-800'
      }`}>
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <span className="font-display text-2xl lg:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600 group-hover:from-cyan-400 group-hover:to-blue-500 transition-all">
                Samarkand
              </span>
              <span className="font-display text-xl lg:text-2xl font-bold hidden sm:inline" 
                    style={{ color: seasonalColors.primary }}>
                Mall
              </span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex gap-8 items-center">
              <Link to="/" className="hover:text-cyan-500 transition-all duration-300 transform hover:scale-105 font-medium">
                {t('home')}
              </Link>
              <a href="#about" className="hover:text-cyan-500 transition-all duration-300 transform hover:scale-105 font-medium">
                {t('about')}
              </a>
              <a href="#contact" className="hover:text-cyan-500 transition-all duration-300 transform hover:scale-105 font-medium">
                {t('contact')}
              </a>
              
              <div className="flex items-center gap-4 pl-4 border-l border-slate-200 dark:border-slate-700">
                <DarkModeToggle />
                <button 
                  onClick={() => setProfileOpen(true)}
                  className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-cyan-600 dark:text-cyan-400"
                  aria-label="Profile"
                >
                  <User className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Mobile Menu Button & Profile */}
            <div className="md:hidden flex items-center gap-4">
              <button 
                onClick={() => setProfileOpen(true)}
                className="p-2 text-cyan-600 dark:text-cyan-400"
              >
                <User className="w-6 h-6" />
              </button>
              <button 
                className="text-cyan-600 dark:text-cyan-400"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Toggle menu"
              >
                <Menu className="w-8 h-8" />
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {menuOpen && (
            <div className={`md:hidden mt-4 pb-4 border-t border-opacity-20 pt-4 ${
              darkMode ? 'border-slate-700' : 'border-slate-200'
            }`}>
              <Link 
                to="/" 
                className="block py-3 px-4 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-cyan-500 transition-colors font-medium"
                onClick={() => setMenuOpen(false)}
              >
                {t('home')}
              </Link>
              <a 
                href="#about" 
                className="block py-3 px-4 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-cyan-500 transition-colors font-medium"
                onClick={() => setMenuOpen(false)}
              >
                {t('about')}
              </a>
              <a 
                href="#contact" 
                className="block py-3 px-4 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-cyan-500 transition-colors font-medium"
                onClick={() => setMenuOpen(false)}
              >
                {t('contact')}
              </a>
              <div className="mt-4 px-4 flex justify-between items-center">
                <span className="text-sm font-medium opacity-70">{t('theme')}</span>
                <DarkModeToggle />
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Profile Sidebar */}
      <ProfileSidebar isOpen={profileOpen} onClose={() => setProfileOpen(false)} />
    </>
  )
}
