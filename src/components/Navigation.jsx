import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useTheme } from '../contexts/ThemeContext'
import DarkModeToggle from './DarkModeToggle'

export default function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { darkMode, seasonalColors } = useTheme()

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
            <DarkModeToggle />
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
          </div>
        )}
      </div>
    </nav>
  )
}
