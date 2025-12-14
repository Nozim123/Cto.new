import { Link } from 'react-router-dom'
import { useState } from 'react'

export default function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="bg-navy text-cream sticky top-0 z-50 shadow-md">
      <div className="max-w-6xl mx-auto px-4 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <span className="font-display text-2xl font-bold text-gold">Samarkand</span>
            <span className="font-display text-lg font-bold hidden sm:inline">Mall</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-8 items-center">
            <Link to="/" className="hover:text-gold transition-colors duration-300">
              Home
            </Link>
            <a href="#malls" className="hover:text-gold transition-colors duration-300">
              Malls
            </a>
            <a href="#contact" className="hover:text-gold transition-colors duration-300">
              Contact
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-gold text-2xl"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            ☰
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gold border-opacity-20 pt-4">
            <Link 
              to="/" 
              className="block py-2 hover:text-gold transition-colors duration-300"
              onClick={() => setMenuOpen(false)}
            >
              Home
            </Link>
            <a 
              href="#malls" 
              className="block py-2 hover:text-gold transition-colors duration-300"
              onClick={() => setMenuOpen(false)}
            >
              Malls
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
