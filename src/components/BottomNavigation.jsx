import { Link, useLocation } from 'react-router-dom'
import { useTheme } from '../contexts/ThemeContext'
import { Home, Store, ShoppingBag, Heart, Map, Search } from 'lucide-react'

export default function BottomNavigation() {
  const location = useLocation()
  const { darkMode } = useTheme()

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/'
    }
    return location.pathname.includes(path)
  }

  const navItems = [
    {
      label: 'Home',
      path: '/',
      icon: Home
    },
    {
      label: 'Malls',
      path: '/store-directory',
      icon: Store
    },
    {
      label: 'Stores',
      path: '/stores',
      icon: ShoppingBag
    },
    {
      label: 'Favorites',
      path: '/favorites',
      icon: Heart
    }
  ]

  return (
    <nav className={`md:hidden fixed bottom-0 left-0 right-0 z-50
                    ${darkMode ? 'bg-gray-900/95 backdrop-blur-lg border-gray-700' : 'bg-white/95 backdrop-blur-lg border-gray-200'}
                    border-t shadow-2xl safe-area-inset`}>
      <div className="grid grid-cols-4 h-[70px]">
        {navItems.map((item) => {
          const active = isActive(item.path)
          const Icon = item.icon
          return item.path.startsWith('#') ? (
            <a
              key={item.path}
              href={item.path}
              className={`flex flex-col items-center justify-center gap-1 transition-all duration-300
                        ${active
                          ? 'text-purple-600 dark:text-purple-400'
                          : darkMode
                            ? 'text-gray-400 hover:text-purple-400'
                            : 'text-gray-500 hover:text-purple-600'
                        }`}
            >
              <Icon size={22} strokeWidth={active ? 2.5 : 2} />
              <span className="text-[11px] font-semibold">{item.label}</span>
            </a>
          ) : (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center gap-1 transition-all duration-300
                        ${active
                          ? 'text-purple-600 dark:text-purple-400'
                          : darkMode
                            ? 'text-gray-400 hover:text-purple-400'
                            : 'text-gray-500 hover:text-purple-600'
                        }`}
            >
              <Icon size={22} strokeWidth={active ? 2.5 : 2} />
              <span className="text-[11px] font-semibold">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
