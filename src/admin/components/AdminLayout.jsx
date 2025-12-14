import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import {
  Building2,
  Image,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  PanelTop,
  Settings,
  Store,
  Users,
  X,
} from 'lucide-react'

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Content Studio', href: '/admin/content', icon: PanelTop },
    { name: 'Malls', href: '/admin/malls', icon: Building2 },
    { name: "Stores", href: '/admin/stores', icon: Store },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Banners', href: '/admin/banners', icon: Image },
    { name: 'Media', href: '/admin/media', icon: Image },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ]

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  const isActive = (path) => location.pathname.startsWith(path)

  return (
    <div className="flex h-screen bg-midnight text-white">
      {/* Sidebar */}
      <div
        className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-50 w-72 bg-midnight/80 backdrop-blur-xl border-r border-white/10 shadow-glass transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-white/10">
          <div>
            <h1 className="text-white font-semibold">Admin Panel</h1>
            <p className="text-white/50 text-xs">Samarkand Mall Explorer</p>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden button-ghost" aria-label="Close sidebar">
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="mt-4 px-4">
          <div className="space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`${isActive(item.href)
                    ? 'bg-white/10 text-white border border-white/10'
                    : 'text-white/70 hover:bg-white/5 hover:text-white'
                    } group flex items-center px-4 py-3 text-sm font-semibold rounded-2xl transition-all duration-200`}
                >
                  <Icon className="mr-3 h-5 w-5 flex-shrink-0 text-white/70 group-hover:text-white" />
                  {item.name}
                </Link>
              )
            })}
          </div>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="rounded-2xl bg-white/5 border border-white/10 p-4 mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10">
                <span className="text-white font-semibold text-sm">{user?.name?.charAt(0) || 'A'}</span>
              </div>
              <div>
                <p className="text-white text-sm font-semibold">{user?.name}</p>
                <p className="text-white/50 text-xs">{user?.role}</p>
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-3 text-sm font-semibold text-white/80 rounded-2xl hover:bg-neonPink/15 hover:text-white transition-all duration-200 border border-white/10"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Sign out
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 px-6 flex items-center justify-between border-b border-white/10 bg-midnight/70 backdrop-blur-xl">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden button-ghost" aria-label="Open sidebar">
            <Menu className="w-6 h-6" />
          </button>

          <div className="flex items-center space-x-4">
            <h2 className="text-xl md:text-2xl font-semibold text-white">
              {navigation.find((item) => isActive(item.href))?.name || 'Admin'}
            </h2>
          </div>

          <div className="flex items-center space-x-4">
            <span className="hidden md:inline text-sm text-white/60">Welcome, {user?.name}</span>
            <Link to="/" target="_blank" rel="noopener noreferrer" className="text-sm text-white/70 hover:text-white font-semibold">
              View site →
            </Link>
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6 bg-midnight">{children}</main>
      </div>

      {sidebarOpen && <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={() => setSidebarOpen(false)} />}
    </div>
  )
}

export default AdminLayout
