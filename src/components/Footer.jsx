import { Link } from 'react-router-dom'
import { useTheme } from '../contexts/ThemeContext'
import { Phone, Mail, Send, Facebook, Instagram, Twitter } from 'lucide-react'

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
                <Link to="/p/about-us" className="hover:text-gold transition-all duration-300 hover:translate-x-1 inline-block">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/p/about-the-mall" className="hover:text-gold transition-all duration-300 hover:translate-x-1 inline-block">
                  About Mall
                </Link>
              </li>
              <li>
                <Link to="/p/faq" className="hover:text-gold transition-all duration-300 hover:translate-x-1 inline-block">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/p/terms" className="hover:text-gold transition-all duration-300 hover:translate-x-1 inline-block">
                  Terms
                </Link>
              </li>
              <li>
                <Link to="/p/privacy" className="hover:text-gold transition-all duration-300 hover:translate-x-1 inline-block">
                  Privacy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-gold mb-4">Contact</h4>
            <div className="flex items-center gap-3 text-cream text-opacity-80 mb-3">
              <Phone size={20} className="flex-shrink-0" />
              <span>+998 (66) 233-30-30</span>
            </div>
            <div className="flex items-center gap-3 text-cream text-opacity-80 mb-4">
              <Mail size={20} className="flex-shrink-0" />
              <span>info@megatravelcenter.com</span>
            </div>

            {/* Social Media Links */}
            <h5 className="font-semibold text-gold mb-3">Follow Us</h5>
            <div className="flex gap-3">
              <a
                href="https://t.me/samarkandmall"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cream text-opacity-80 hover:text-gold transition-all duration-300 hover:scale-110"
                title="Telegram"
              >
                <Send size={24} />
              </a>
              <a
                href="https://instagram.com/samarkandmall"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cream text-opacity-80 hover:text-gold transition-all duration-300 hover:scale-110"
                title="Instagram"
              >
                <Instagram size={24} />
              </a>
              <a
                href="https://x.com/samarkandmall"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cream text-opacity-80 hover:text-gold transition-all duration-300 hover:scale-110"
                title="X (Twitter)"
              >
                <Twitter size={24} />
              </a>
              <a
                href="https://facebook.com/samarkandmall"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cream text-opacity-80 hover:text-gold transition-all duration-300 hover:scale-110"
                title="Facebook"
              >
                <Facebook size={24} />
              </a>
            </div>
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
