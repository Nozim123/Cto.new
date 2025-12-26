import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTheme } from '../contexts/ThemeContext'
import { Home, Building2, ShoppingBag, Map, Compass, AlertCircle } from 'lucide-react'

export default function NotFoundPage() {
  const { darkMode } = useTheme()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const popularPages = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Malls', path: '/mall/family-park', icon: Building2 },
    { name: 'Stores', path: '/stores', icon: ShoppingBag },
    { name: 'Map', path: '/map', icon: Map },
  ]

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 pb-24 md:pb-0 ${
      darkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className="max-w-2xl mx-auto text-center">
        {/* Animated 404 */}
        <div className="relative mb-8">
          <div className={`text-8xl md:text-9xl font-bold transition-all duration-1000 ${
            isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
          }`}>
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              404
            </span>
          </div>

          {/* Floating elements - using icons */}
          <div className="absolute -top-4 -left-4 text-4xl animate-bounce text-purple-400" style={{ animationDelay: '0.2s' }}>
            <Compass size={32} />
          </div>
          <div className="absolute -top-2 -right-6 text-3xl animate-bounce text-blue-400" style={{ animationDelay: '0.5s' }}>
            <Building2 size={28} />
          </div>
          <div className="absolute -bottom-4 -left-2 text-3xl animate-bounce text-pink-400" style={{ animationDelay: '0.8s' }}>
            <ShoppingBag size={28} />
          </div>
          <div className="absolute -bottom-2 -right-4 text-4xl animate-bounce text-emerald-400" style={{ animationDelay: '1.1s' }}>
            <AlertCircle size={32} />
          </div>
        </div>

        {/* Message */}
        <div className={`transition-all duration-1000 delay-300 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <h1 className={`text-3xl md:text-4xl font-bold mb-4 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Oops! Page Not Found
          </h1>

          <p className={`text-lg mb-6 ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            The page you're looking for doesn't exist or has been moved.
            Don't worry, we'll help you find what you're looking for!
          </p>

          {/* Coming Soon Animation */}
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-semibold mb-8 animate-pulse">
            <AlertCircle size={18} />
            <span>Coming Soon - We're adding more awesome features!</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className={`flex flex-col sm:flex-row gap-4 justify-center mb-12 transition-all duration-1000 delay-500 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <Link
            to="/"
            className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center gap-2"
          >
            <Home size={20} />
            <span>Back to Home</span>
          </Link>

          <Link
            to="/map"
            className="px-8 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors font-semibold flex items-center justify-center gap-2"
          >
            <Map size={20} />
            <span>View Map</span>
          </Link>
        </div>

        {/* Popular Pages */}
        <div className={`transition-all duration-1000 delay-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <h2 className={`text-xl font-semibold mb-6 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Or try these popular pages:
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {popularPages.map((page, index) => {
              const Icon = page.icon
              return (
                <Link
                  key={page.path}
                  to={page.path}
                  className={`p-4 rounded-xl border transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                    darkMode
                      ? 'bg-gray-800 border-gray-700 hover:border-purple-500'
                      : 'bg-white border-gray-200 hover:border-purple-500'
                  }`}
                  style={{ animationDelay: `${0.9 + index * 0.1}s` }}
                >
                  <div className="text-3xl mb-2 flex items-center justify-center">
                    <Icon size={32} className="text-purple-500" />
                  </div>
                  <div className={`font-medium ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {page.name}
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Fun Animation */}
        <div className={`mt-12 transition-all duration-1000 delay-1000 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className="flex justify-center space-x-2">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-3 h-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full animate-bounce"
                style={{ animationDelay: `${1.2 + i * 0.1}s` }}
              />
            ))}
          </div>

          <p className={`text-sm mt-4 ${
            darkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            While you're here, why not explore our amazing malls?
          </p>
        </div>
      </div>
    </div>
  )
}
