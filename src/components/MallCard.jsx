import { Link } from 'react-router-dom'

export default function MallCard({ mall }) {
  const isComingSoon = mall.status === 'coming_soon'

  return (
    <div className="card-shadow rounded-lg overflow-hidden bg-white h-full flex flex-col">
      {/* Image Container */}
      <div className="relative overflow-hidden bg-gray-200 h-48 sm:h-56 md:h-64">
        <img
          src={mall.image}
          alt={mall.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 lazy"
          loading="lazy"
        />
        {isComingSoon && (
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <div className="text-center">
              <p className="text-white font-display text-2xl font-bold">Coming Soon</p>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 flex-grow flex flex-col justify-between">
        <div>
          <h3 className="font-display text-xl lg:text-2xl font-bold text-navy mb-2">
            {mall.name}
          </h3>
          <p className="text-sage mb-2 text-sm md:text-base">
            📍 {mall.location}
          </p>
          {!isComingSoon && (
            <p className="text-gray-600 text-sm md:text-base mb-4">
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
            View Details
          </Link>
        ) : (
          <button
            disabled
            className="w-full px-6 py-3 bg-gray-300 text-gray-600 font-semibold rounded-lg opacity-60 cursor-not-allowed mt-4"
          >
            Coming Soon
          </button>
        )}
      </div>
    </div>
  )
}
