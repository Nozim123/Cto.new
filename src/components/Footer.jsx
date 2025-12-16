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
            <h3 className="font-display text-2xl font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent mb-4">
              Mega Travel Center
            </h3>
            <p className="text-cream text-opacity-80">
              A world-class digital platform for premium shopping and travel experiences
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
              ✉️ info@megatravelcenter.com
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gold border-opacity-20 pt-8">
          <p className="text-center text-cream text-opacity-60">
            © {currentYear} Mega Travel Center (MTC). All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
