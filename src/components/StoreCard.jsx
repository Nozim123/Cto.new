import { Link } from 'react-router-dom'
import { useTheme } from '../contexts/ThemeContext'

export default function StoreCard({ store, mallId }) {
  const { darkMode } = useTheme()
  const statusColor = store.status === 'open' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
  const statusText = store.status === 'open' ? 'Open' : 'Coming Soon'

  return (
    <Link
      to={`/mall/${mallId}/store/${store.id}`}
      className={`card-shadow rounded-lg overflow-hidden hover:no-underline group h-full transition-all duration-300 ${
        darkMode ? 'bg-gray-800 glass-card-dark' : 'bg-white glass-card'
      }`}
    >
      {/* Logo Container */}
      <div className={`relative overflow-hidden h-48 sm:h-56 md:h-64 ${
        darkMode ? 'bg-gray-700' : 'bg-gray-100'
      }`}>
        <img
          src={store.logo}
          alt={store.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 lazy"
          loading="lazy"
        />
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex justify-between items-start gap-2 mb-3">
          <div>
            <h3 className={`font-display text-lg lg:text-xl font-bold group-hover:text-gold transition-colors duration-300 ${
              darkMode ? 'text-cream' : 'text-navy'
            }`}>
              {store.name}
            </h3>
            <p className={`text-sm ${
              darkMode ? 'text-gray-400' : 'text-sage'
            }`}>
              {store.category}
            </p>
          </div>
          <span className={`text-xs font-semibold px-2 py-1 rounded-full whitespace-nowrap ${statusColor}`}>
            {statusText}
          </span>
        </div>

        {/* Meta Info */}
        <div className={`space-y-2 text-sm ${
          darkMode ? 'text-gray-400' : 'text-gray-600'
        }`}>
          <p>
           <span className="font-semibold">Floor:</span> {store.floor ?? '—'}
          </p>
          <p>
           <span className="font-semibold">Hours:</span> {store.work_time || '—'}
          </p>
        </div>

        {/* CTA */}
        <div className="mt-4 text-gold font-semibold group-hover:translate-x-1 transition-transform duration-300 inline-flex items-center">
          View Store →
        </div>
      </div>
    </Link>
  )
}
