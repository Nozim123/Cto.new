import { Link } from 'react-router-dom'
import { useTheme } from '../contexts/ThemeContext'
import { useLanguage } from '../contexts/LanguageContext'
import { useState, useEffect } from 'react'
import Button3D from './Button3D'
import { checkMallStatus } from '../utils/mallStatus'

export default function MallCard({ mall, index = 0 }) {
  const isComingSoon = mall.status === 'coming_soon'
  const { darkMode, seasonalColors } = useTheme()
  const { t } = useLanguage()
  const [realTimeStatus, setRealTimeStatus] = useState(checkMallStatus(mall))

  // Update status every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeStatus(checkMallStatus(mall))
    }, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [mall])

  const delayClass = `fade-in-up-delay-${Math.min(index % 3, 3)}`

  return (
    <div className={`premium-card rounded-2xl overflow-hidden h-full flex flex-col ${
      darkMode 
        ? 'bg-gray-800 frosted-glass-dark' 
        : 'bg-white frosted-glass'
    } ${delayClass}`}>
      {/* Image Container */}
      <div className="relative overflow-hidden bg-gray-200 dark:bg-gray-700 h-48 sm:h-56 md:h-64 group">
        <img
          src={mall.image}
          alt={mall.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 lazy"
          loading="lazy"
        />
        {/* Real-time Status Badge */}
        {!isComingSoon && (
          <div className={`absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-md text-xs font-medium ${
            realTimeStatus.isOpen
              ? 'bg-green-500/90 text-white'
              : 'bg-red-500/90 text-white'
          }`}>
            <div className={`w-2 h-2 rounded-full ${
              realTimeStatus.isOpen ? 'bg-white animate-pulse' : 'bg-white'
            }`}></div>
            {realTimeStatus.isOpen ? t('common.open') : t('common.closed')}
          </div>
        )}
        {isComingSoon && (
          <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center">
            <div className="text-center">
              <p className="text-white font-display text-2xl font-bold mb-2">Coming Soon</p>
              <div className="w-16 h-1 mx-auto rounded-full" 
                   style={{ backgroundColor: seasonalColors.primary }}></div>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 flex-grow flex flex-col justify-between">
        <div>
          <h3 className={`font-display text-xl lg:text-2xl font-bold mb-2 ${
            darkMode ? 'text-cream' : 'text-navy'
          }`}>
            {mall.name}
          </h3>
          <p className={`mb-2 text-sm md:text-base flex items-center gap-1 ${
            darkMode ? 'text-gray-400' : 'text-sage'
          }`}>
            <span style={{ color: seasonalColors.primary }}>📍</span> {mall.location}
          </p>
          {!isComingSoon && (
            <>
              {/* Real-time Hours */}
              <div className={`flex items-center gap-2 mb-3 text-sm ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                <span>🕐</span>
                <span className="font-medium">{mall.hours}</span>
                {realTimeStatus.message && (
                  <span className={`ml-auto px-2 py-1 rounded-full text-xs ${
                    realTimeStatus.isOpen
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                      : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                  }`}>
                    {realTimeStatus.message}
                  </span>
                )}
              </div>
              <p className={`text-sm md:text-base mb-4 ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {mall.description}
              </p>
            </>
          )}
        </div>

        {/* Button */}
        {!isComingSoon ? (
          <Link to={`/mall/${mall.id}`} className="mt-4 block">
            <Button3D variant="primary" fullWidth>
              View Details →
            </Button3D>
          </Link>
        ) : (
          <Button3D variant="outline" fullWidth disabled className="mt-4 opacity-60">
            Coming Soon
          </Button3D>
        )}
      </div>
    </div>
  )
}
