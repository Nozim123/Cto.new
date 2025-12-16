import { Link } from 'react-router-dom'
import { MapPin } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import Button3D from './Button3D'
import RealisticIcon from './RealisticIcon'

export default function MallCard({ mall, index = 0 }) {
  const isComingSoon = mall.status === 'coming_soon'
  const { darkMode, seasonalColors } = useTheme()

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
          src={mall.banner || mall.gallery?.[0]}
          alt={mall.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 lazy"
          loading="lazy"
        />
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
          <p className={`mb-2 text-sm md:text-base flex items-center gap-2 ${
            darkMode ? 'text-gray-400' : 'text-sage'
          }`}>
            <RealisticIcon Icon={MapPin} size={14} padding={6} radius={12} className="!shadow-none" />
            <span className="truncate">{mall.address}</span>
          </p>
          {!isComingSoon && (
            <p className={`text-sm md:text-base mb-4 ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              {mall.description_short}
            </p>
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
