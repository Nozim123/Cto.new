import { Link, useLocation } from 'react-router-dom'
import { useTheme } from '../contexts/ThemeContext'

export default function BottomNavigation() {
  const location = useLocation()
  const { darkMode } = useTheme()
  
  const isActive = (to) => {
    const [pathnamePart, hashPart] = to.split('#')
    const pathname = pathnamePart || '/'

    if (hashPart) {
      return location.pathname === pathname && location.hash === `#${hashPart}`
    }

    if (pathname === '/') {
      return location.pathname === '/'
    }

    return location.pathname.startsWith(pathname)
  }

  const navItems = [
    {
      label: 'Home',
      path: '/',
      icon: '🏠'
    },
    {
      label: 'Discover',
      path: '/#discover',
      icon: '✨'
    },
    {
      label: 'Map',
      path: '/#explore-map',
      icon: '🗺️'
    },
    {
      label: 'Profile',
      path: '/profile',
      icon: '👤'
    }
  ]

  return (
    <nav className={`md:hidden fixed bottom-0 left-0 right-0 z-50 
                    ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} 
                    border-t shadow-lg safe-area-inset`}>
      <div className="grid grid-cols-4 h-16">
        {navItems.map((item) => {
          const active = isActive(item.path)

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center gap-1 transition-all duration-300
                        ${active 
                          ? darkMode 
                            ? 'text-gold bg-gray-800' 
                            : 'text-gold bg-cream' 
                          : darkMode
                            ? 'text-gray-400 hover:text-gold'
                            : 'text-gray-600 hover:text-gold'
                        }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
