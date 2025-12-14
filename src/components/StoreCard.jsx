import { Link } from 'react-router-dom'

export default function StoreCard({ store, mallId }) {
  const statusColor = store.status === 'open' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
  const statusText = store.status === 'open' ? 'Open' : 'Coming Soon'

  return (
    <Link
      to={`/mall/${mallId}/store/${store.id}`}
      className="card-shadow rounded-lg overflow-hidden bg-white hover:no-underline group h-full"
    >
      {/* Logo Container */}
      <div className="relative overflow-hidden bg-gray-100 h-48 sm:h-56 md:h-64">
        <img
          src={store.logo}
          alt={store.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 lazy"
          loading="lazy"
        />
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex justify-between items-start gap-2 mb-3">
          <div>
            <h3 className="font-display text-lg lg:text-xl font-bold text-navy group-hover:text-gold transition-colors duration-300">
              {store.name}
            </h3>
            <p className="text-sage text-sm">
              {store.category}
            </p>
          </div>
          <span className={`text-xs font-semibold px-2 py-1 rounded-full whitespace-nowrap ${statusColor}`}>
            {statusText}
          </span>
        </div>

        {/* Meta Info */}
        <div className="space-y-2 text-sm text-gray-600">
          <p>
            <span className="font-semibold">Floor:</span> {store.floor}
          </p>
          <p>
            <span className="font-semibold">Hours:</span> {store.hours}
          </p>
        </div>

        {/* CTA */}
        <div className="mt-4 text-gold font-semibold group-hover:translate-x-1 transition-transform duration-300">
          View Store →
        </div>
      </div>
    </Link>
  )
}
