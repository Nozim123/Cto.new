import { Link } from 'react-router-dom'
import { useTheme } from '../contexts/ThemeContext'

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const { darkMode } = useTheme()

  return (
    <footer className={`mt-20 transition-colors duration-300 ${
      darkMode ? 'bg-gray-900 text-cream' : 'bg-navy text-cream'
    }`}>
      <div className="max-w-6xl mx-auto px-4 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="font-display text-2xl font-bold text-gold mb-4">Samarkand Mall</h3>
            <p className="text-cream text-opacity-80">
              Explore the finest shopping destinations in Samarkand
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-gold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-cream text-opacity-80">
              <li>
                <Link to="/" className="hover:text-gold transition-all duration-300 hover:translate-x-1 inline-block">
                  Home
                </Link>
              </li>
              <li>
                <a href="#about" className="hover:text-gold transition-all duration-300 hover:translate-x-1 inline-block">
                  About
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-gold transition-all duration-300 hover:translate-x-1 inline-block">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-gold mb-4">Contact</h4>
            <p className="text-cream text-opacity-80 mb-2">
              📞 +998 (66) 233-30-30
            </p>
            <p className="text-cream text-opacity-80">
              ✉️ info@samarkandmall.uz
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gold border-opacity-20 pt-8">
          <p className="text-center text-cream text-opacity-60">
            © {currentYear} Samarkand Mall Directory. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
