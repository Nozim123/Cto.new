import { Link } from 'react-router-dom'
import { useTheme } from '../contexts/ThemeContext'
import { useLanguage } from '../contexts/LanguageContext'
import Button3D from './Button3D'

export default function StoreHeader({ store, mall, scrolled = false }) {
  const { darkMode } = useTheme()
  const { t } = useLanguage()

  return (
    <div className={`sticky top-16 md:top-20 z-30 transition-all duration-300 ${
      scrolled 
        ? darkMode 
          ? 'bg-gray-900/95 backdrop-blur-xl shadow-lg py-3' 
          : 'bg-white/95 backdrop-blur-xl shadow-lg py-3'
        : darkMode
          ? 'bg-gray-900/80 backdrop-blur-lg py-6'
          : 'bg-white/80 backdrop-blur-lg py-6'
    }`}>
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          {/* Left: Store Info */}
          <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
            {/* Store Logo */}
            <div className={`relative flex-shrink-0 transition-all duration-300 ${
              scrolled ? 'w-10 h-10' : 'w-12 h-12 md:w-14 md:h-14'
            }`}>
              <img 
                src={store.logo} 
                alt={store.name} 
                className="w-full h-full rounded-lg object-cover border-2 border-purple-500/30"
              />
              <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 ${
                darkMode ? 'border-gray-900' : 'border-white'
              } ${store.status === 'open' ? 'bg-green-500' : 'bg-red-500'}`}></div>
            </div>

            {/* Store Details */}
            <div className="flex-1 min-w-0">
              <h1 className={`font-bold transition-all duration-300 truncate ${
                scrolled 
                  ? 'text-base md:text-lg' 
                  : 'text-lg md:text-xl lg:text-2xl'
              } ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {store.name}
              </h1>
              
              {!scrolled && (
                <div className="flex items-center gap-2 text-xs md:text-sm text-gray-500 mt-0.5">
                  <span className="truncate">{store.category}</span>
                  <span className="hidden sm:inline">•</span>
                  <span className="hidden sm:inline">{store.hours}</span>
                  <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${
                    store.status === 'open'
                      ? 'bg-green-500/20 text-green-500'
                      : 'bg-red-500/20 text-red-500'
                  }`}>
                    {store.status === 'open' ? t('common.open') : t('common.closed')}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <Link to={`/mall/${mall.id}`}>
              <Button3D 
                variant="outline" 
                className={`transition-all duration-300 ${
                  scrolled ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm'
                }`}
              >
                <span className="hidden sm:inline">{t('buttons.backToMall')}</span>
                <span className="sm:hidden">←</span>
              </Button3D>
            </Link>
            
            {!scrolled && (
              <Button3D 
                variant="primary" 
                className="hidden md:flex px-4 py-2 text-sm"
              >
                {t('buttons.follow')}
              </Button3D>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
