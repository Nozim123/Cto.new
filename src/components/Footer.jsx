import { Link } from 'react-router-dom'
import { useTheme } from '../contexts/ThemeContext'
import { Phone, Mail, Send, Facebook, Instagram, Twitter } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const { darkMode } = useTheme()

  return (
    <footer className="mt-20 mtc-glass border-t border-white/10">
      <div className="max-w-6xl mx-auto px-4 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="mtc-gradient-text-gold text-2xl font-bold mb-4">
              Mega Travel Center
            </h3>
            <p className="mtc-body text-white/70">
              A world-class digital platform for premium shopping and travel experiences in the heart of Uzbekistan.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mtc-heading-sm mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="mtc-body-sm text-white/70 hover:text-blue-400 hover:translate-x-1 inline-block transition-all duration-300">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/p/about-us" className="mtc-body-sm text-white/70 hover:text-blue-400 hover:translate-x-1 inline-block transition-all duration-300">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/p/faq" className="mtc-body-sm text-white/70 hover:text-blue-400 hover:translate-x-1 inline-block transition-all duration-300">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/p/terms" className="mtc-body-sm text-white/70 hover:text-blue-400 hover:translate-x-1 inline-block transition-all duration-300">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/p/privacy" className="mtc-body-sm text-white/70 hover:text-blue-400 hover:translate-x-1 inline-block transition-all duration-300">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h4 className="mtc-heading-sm mb-4">Contact & Social</h4>
            <div className="flex items-center gap-3 text-white/70 mb-3">
              <Phone size={20} className="flex-shrink-0 text-blue-400" />
              <span className="mtc-body-sm">+998 (66) 233-30-30</span>
            </div>
            <div className="flex items-center gap-3 text-white/70 mb-6">
              <Mail size={20} className="flex-shrink-0 text-blue-400" />
              <span className="mtc-body-sm">info@megatravelcenter.com</span>
            </div>

            {/* Social Media Links */}
            <div className="flex gap-3">
              <a
                href="https://t.me/samarkandmall"
                target="_blank"
                rel="noopener noreferrer"
                className="mtc-glass p-2.5 rounded-xl text-white/70 hover:text-blue-400 hover:bg-white/10 transition-all duration-300 hover:scale-110"
                title="Telegram"
              >
                <Send size={20} />
              </a>
              <a
                href="https://instagram.com/samarkandmall"
                target="_blank"
                rel="noopener noreferrer"
                className="mtc-glass p-2.5 rounded-xl text-white/70 hover:text-pink-400 hover:bg-white/10 transition-all duration-300 hover:scale-110"
                title="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://x.com/samarkandmall"
                target="_blank"
                rel="noopener noreferrer"
                className="mtc-glass p-2.5 rounded-xl text-white/70 hover:text-blue-400 hover:bg-white/10 transition-all duration-300 hover:scale-110"
                title="X (Twitter)"
              >
                <Twitter size={20} />
              </a>
              <a
                href="https://facebook.com/samarkandmall"
                target="_blank"
                rel="noopener noreferrer"
                className="mtc-glass p-2.5 rounded-xl text-white/70 hover:text-blue-600 hover:bg-white/10 transition-all duration-300 hover:scale-110"
                title="Facebook"
              >
                <Facebook size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 pt-8">
          <p className="text-center mtc-caption text-white/50">
            © {currentYear} Mega Travel Center (MTC). All rights reserved. Built with 💜 in Samarkand.
          </p>
        </div>
      </div>
    </footer>
  )
}
