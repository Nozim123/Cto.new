import { Link } from 'react-router-dom'
import { useTheme } from '../contexts/ThemeContext'
import { useLanguage } from '../contexts/LanguageContext'

export default function MallCard({ mall, index = 0 }) {
  const isComingSoon = mall.status === 'coming_soon'
  const { darkMode, seasonalColors } = useTheme()
  const { t } = useLanguage()

  const delayClass = `fade-in-up-delay-${Math.min(index % 3, 3)}`

  return (
    <div className={`card-shadow card-3d rounded-lg overflow-hidden h-full flex flex-col transition-all duration-300 ${
      darkMode 
        ? 'bg-gray-800 glass-card-dark' 
        : 'bg-white glass-card'
    } ${delayClass}`}>
      {/* Image Container */}
      <div className="relative overflow-hidden bg-gray-200 dark:bg-gray-700 h-48 sm:h-56 md:h-64 group">
        <img
          src={mall.image}
          alt={mall.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 lazy"
          loading="lazy"
        />
        {isComingSoon && (
          <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center">
            <div className="text-center">
              <p className="text-white font-display text-2xl font-bold mb-2">{t('common.comingSoon')}</p>
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
            <p className={`text-sm md:text-base mb-4 ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              {mall.description}
            </p>
          )}
        </div>

        {/* Button */}
        {!isComingSoon ? (
          <Link
            to={`/mall/${mall.id}`}
            className="button-primary inline-block text-center mt-4 w-full"
          >
            {t('common.viewDetails')}
          </Link>
        ) : (
          <button
            disabled
            className={`w-full px-6 py-3 font-semibold rounded-lg opacity-60 cursor-not-allowed mt-4 ${
              darkMode 
                ? 'bg-gray-700 text-gray-500' 
                : 'bg-gray-300 text-gray-600'
            }`}
          >
            {t('common.comingSoon')}
          </button>
        )}
      </div>
    </div>
  )
}
