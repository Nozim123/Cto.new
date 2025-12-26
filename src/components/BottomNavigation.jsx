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
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 mtc-glass border-t border-white/10 safe-area-inset">
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
                          ? 'text-blue-400'
                          : 'text-white/60 hover:text-white/90'
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
                          ? 'text-blue-400'
                          : 'text-white/60 hover:text-white/90'
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
