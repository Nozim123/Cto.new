import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useTheme } from '../contexts/ThemeContext'
import { useUserAuth } from '../contexts/UserAuthContext'
import DarkModeToggle from './DarkModeToggle'

export default function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { darkMode, seasonalColors } = useTheme()
  const { user, isAuthenticated } = useUserAuth()

  return (
    <nav className={`sticky top-0 z-50 shadow-md backdrop-blur-lg transition-colors duration-300 ${
      darkMode 
        ? 'bg-gray-900/90 text-cream' 
        : 'bg-white/90 text-navy'
    }`}>
      <div className="max-w-6xl mx-auto px-4 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <span className="font-display text-2xl lg:text-3xl font-bold text-gold">Samarkand</span>
            <span className="font-display text-xl lg:text-2xl font-bold hidden sm:inline" 
                  style={{ color: seasonalColors.primary }}>
              Mall
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-8 items-center">
            <Link to="/" className="hover:text-gold transition-all duration-300 transform hover:scale-110">
              Home
            </Link>
            <a href="#about" className="hover:text-gold transition-all duration-300 transform hover:scale-110">
              About
            </a>
            <a href="#contact" className="hover:text-gold transition-all duration-300 transform hover:scale-110">
              Contact
            </a>

            <div className="flex items-center gap-3">
              {isAuthenticated ? (
                <Link
                  to="/profile"
                  className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 button-3d ${
                    darkMode ? 'bg-gray-800 text-cream border border-gray-700' : 'bg-cream text-navy border border-gray-200'
                  }`}
                >
                  {user?.name || 'Profile'}
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 hover:scale-105 ${
                      darkMode ? 'text-gray-200 hover:text-gold' : 'text-navy hover:text-gold'
                    }`}
                  >
                    Sign in
                  </Link>
                  <Link to="/register" className="button-primary button-3d text-sm px-4 py-2">
                    Create profile
                  </Link>
                </>
              )}

              <Link to="/admin" className="button-secondary button-3d text-sm px-4 py-2">
                Admin
              </Link>
              <DarkModeToggle />
            </div>
          </div>

          {/* Mobile Menu Button & Dark Mode */}
          <div className="md:hidden flex items-center gap-4">
            <DarkModeToggle />
            <button 
              className="text-gold text-2xl"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              ☰
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className={`md:hidden mt-4 pb-4 border-t border-opacity-20 pt-4 ${
            darkMode ? 'border-gold' : 'border-navy'
          }`}>
            <Link 
              to="/" 
              className="block py-2 hover:text-gold transition-colors duration-300"
              onClick={() => setMenuOpen(false)}
            >
              Home
            </Link>
            <a 
              href="#about" 
              className="block py-2 hover:text-gold transition-colors duration-300"
              onClick={() => setMenuOpen(false)}
            >
              About
            </a>
            <a 
              href="#contact" 
              className="block py-2 hover:text-gold transition-colors duration-300"
              onClick={() => setMenuOpen(false)}
            >
              Contact
            </a>

            {isAuthenticated ? (
              <Link
                to="/profile"
                className="block py-2 hover:text-gold transition-colors duration-300"
                onClick={() => setMenuOpen(false)}
              >
                Profile
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block py-2 hover:text-gold transition-colors duration-300"
                  onClick={() => setMenuOpen(false)}
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="block py-2 hover:text-gold transition-colors duration-300"
                  onClick={() => setMenuOpen(false)}
                >
                  Create profile
                </Link>
              </>
            )}

            <Link 
              to="/admin" 
              className="block py-2 hover:text-gold transition-colors duration-300"
              onClick={() => setMenuOpen(false)}
            >
              Admin Panel
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}
