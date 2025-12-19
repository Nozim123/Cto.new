import { Link, useLocation } from 'react-router-dom'
import { Building2, Home, Info, Phone } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'

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
      label: 'About',
      path: '#about',
      icon: Info
    },
    {
      label: 'Malls',
      path: '#malls',
      icon: Building2
    },
    {
      label: 'Contact',
      path: '#contact',
      icon: Phone
    }
  ]

  return (
    <nav
      className={`md:hidden fixed bottom-0 left-0 right-0 z-50 
                    ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} 
                    border-t shadow-lg safe-area-inset`}
    >
      <div className="grid grid-cols-4 h-16">
        {navItems.map((item) => {
          const active = isActive(item.path)
          const ItemIcon = item.icon

          const cls = `flex flex-col items-center justify-center gap-1 transition-all duration-300
                        ${
                          active
                            ? darkMode
                              ? 'text-gold bg-gray-800'
                              : 'text-gold bg-cream'
                            : darkMode
                              ? 'text-gray-400 hover:text-gold'
                              : 'text-gray-600 hover:text-gold'
                        }`

          return item.path.startsWith('#') ? (
            <a key={item.path} href={item.path} className={cls}>
              <ItemIcon size={20} />
              <span className="text-xs font-medium">{item.label}</span>
            </a>
          ) : (
            <Link key={item.path} to={item.path} className={cls}>
              <ItemIcon size={20} />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
