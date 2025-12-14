import { Link, NavLink } from 'react-router-dom'
import { useState } from 'react'
import { LogIn, Menu, User, X } from 'lucide-react'
import { useUser } from '../contexts/UserContext'
import NotificationCenter from './NotificationCenter'

const NavItem = ({ to, children, ...props }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `px-3 py-2 rounded-xl font-semibold transition ${
        isActive ? 'bg-white/10 text-white' : 'text-white/75 hover:text-white hover:bg-white/5'
      }`
    }
    {...props}
  >
    {children}
  </NavLink>
)

export default function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { user, isAuthenticated, logout } = useUser()

  return (
    <nav className="sticky top-0 z-50">
      <div className="glass-strong border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 lg:px-8 py-3">
          <div className="flex justify-between items-center gap-4">
            <Link to="/" className="flex items-center gap-2 shrink-0">
              <span className="font-display text-xl sm:text-2xl font-semibold text-white">Samarkand</span>
              <span className="hidden sm:inline text-sm px-2 py-1 rounded-full bg-white/5 border border-white/10 text-white/70">
                Mall Explorer
              </span>
            </Link>

            {/* Desktop */}
            <div className="hidden lg:flex items-center gap-1">
              <NavItem to="/">Home</NavItem>
              <NavItem to="/discover">Discover</NavItem>
              <NavItem to="/map">Explore Map</NavItem>
              <NavItem to="/experiences">Experiences</NavItem>
              <NavItem to="/events">Events</NavItem>
              <NavItem to="/help">Help</NavItem>
              <NavItem to="/partner">Partner</NavItem>
              <NavItem to="/future">Future</NavItem>
            </div>

            <div className="flex items-center gap-2">
              <div className="hidden md:block">
                <NotificationCenter />
              </div>

              {isAuthenticated ? (
                <div className="hidden md:flex items-center gap-2">
                  <Link to="/profile" className="button-secondary inline-flex items-center gap-2">
                    <User className="w-4 h-4" />
                    {user?.name || 'Profile'}
                  </Link>
                  <button type="button" className="button-ghost" onClick={logout}>
                    Sign out
                  </button>
                </div>
              ) : (
                <div className="hidden md:flex items-center gap-2">
                  <Link to="/login" className="button-ghost inline-flex items-center gap-2">
                    <LogIn className="w-4 h-4" />
                    Sign in
                  </Link>
                  <Link to="/register" className="button-primary">
                    Register
                  </Link>
                </div>
              )}

              {/* Mobile menu */}
              <button
                className="lg:hidden button-ghost"
                onClick={() => setMenuOpen((v) => !v)}
                aria-label="Toggle menu"
              >
                {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {menuOpen && (
            <div className="lg:hidden mt-3 pt-3 border-t border-white/10">
              <div className="grid grid-cols-2 gap-2">
                <NavItem to="/" onClick={() => setMenuOpen(false)}>
                  Home
                </NavItem>
                <NavItem to="/discover" onClick={() => setMenuOpen(false)}>
                  Discover
                </NavItem>
                <NavItem to="/map" onClick={() => setMenuOpen(false)}>
                  Map
                </NavItem>
                <NavItem to="/experiences" onClick={() => setMenuOpen(false)}>
                  Experiences
                </NavItem>
                <NavItem to="/events" onClick={() => setMenuOpen(false)}>
                  Events
                </NavItem>
                <NavItem to="/help" onClick={() => setMenuOpen(false)}>
                  Help
                </NavItem>
                <NavItem to="/partner" onClick={() => setMenuOpen(false)}>
                  Partner
                </NavItem>
                <NavItem to="/future" onClick={() => setMenuOpen(false)}>
                  Future
                </NavItem>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <NotificationCenter />

                {isAuthenticated ? (
                  <div className="flex items-center gap-2">
                    <Link
                      to="/profile"
                      className="button-secondary inline-flex items-center gap-2"
                      onClick={() => setMenuOpen(false)}
                    >
                      <User className="w-4 h-4" />
                      Profile
                    </Link>
                    <button
                      type="button"
                      className="button-ghost"
                      onClick={() => {
                        logout()
                        setMenuOpen(false)
                      }}
                    >
                      Sign out
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Link to="/login" className="button-ghost" onClick={() => setMenuOpen(false)}>
                      Sign in
                    </Link>
                    <Link to="/register" className="button-primary" onClick={() => setMenuOpen(false)}>
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
