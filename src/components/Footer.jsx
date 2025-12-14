import { Link } from 'react-router-dom'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="mt-16 border-t border-white/10 bg-hero-gradient">
      <div className="max-w-6xl mx-auto px-4 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          <div>
            <h3 className="font-display text-xl font-semibold text-white">Samarkand Mall Explorer</h3>
            <p className="text-white/60 mt-3">
              Premium discovery for malls, stores, products, events, and experiences—built for a future-ready Samarkand.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Explore</h4>
            <ul className="space-y-2 text-white/65">
              <li>
                <Link to="/discover" className="hover:text-white transition">
                  Discover
                </Link>
              </li>
              <li>
                <Link to="/map" className="hover:text-white transition">
                  Explore Map
                </Link>
              </li>
              <li>
                <Link to="/experiences" className="hover:text-white transition">
                  Experiences
                </Link>
              </li>
              <li>
                <Link to="/events" className="hover:text-white transition">
                  Events & Promotions
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Support</h4>
            <ul className="space-y-2 text-white/65">
              <li>
                <Link to="/help" className="hover:text-white transition">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/partner" className="hover:text-white transition">
                  Partner With Us
                </Link>
              </li>
              <li>
                <Link to="/future" className="hover:text-white transition">
                  Future Innovations
                </Link>
              </li>
              <li>
                <a href="/admin/login" className="hover:text-white transition">
                  Admin Panel
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Contact</h4>
            <div className="space-y-2 text-white/65">
              <p>+998 (66) 233-30-30</p>
              <p>info@samarkandmall.uz</p>
              <p>Samarkand, Uzbekistan</p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/45 text-sm">© {currentYear} Samarkand Mall Explorer. All rights reserved.</p>
          <p className="text-white/45 text-sm">Built with accessibility, performance, and scale in mind.</p>
        </div>
      </div>

      <div className="md:hidden h-24" aria-hidden="true" />
    </footer>
  )
}
