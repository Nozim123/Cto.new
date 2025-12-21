import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import InteractiveMap from '../components/InteractiveMap'
import mallsData from '../data/malls.json'

export default function MapPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [selectedMallId, setSelectedMallId] = useState(null)

  useEffect(() => {
    window.scrollTo(0, 0)
    
    // Check for mall ID in URL params
    const mallParam = searchParams.get('mall')
    if (mallParam && mallsData.find(m => m.id === mallParam)) {
      setSelectedMallId(mallParam)
    }
  }, [searchParams])

  const handleMallSelect = (mallId) => {
    setSelectedMallId(mallId)
    // Navigate to mall details
    navigate(`/mall/${mallId}`)
  }

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Interactive Mall Map
          </h1>
          <p className="text-xl opacity-90 mb-6">
            Find malls, get directions, and navigate like a pro
          </p>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg">
              <span>📍</span>
              <span>Your Location</span>
            </div>
            <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg">
              <span>🏢</span>
              <span>Mall Locations</span>
            </div>
            <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg">
              <span>🗺️</span>
              <span>Turn-by-Turn Directions</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Map */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2 dark:text-white">
              Find Your Way
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Click on mall markers to view details or get directions. 
              Enable location access for the best experience.
            </p>
          </div>
          
          <InteractiveMap 
            selectedMallId={selectedMallId}
            onMallSelect={handleMallSelect}
            showDirections={true}
            className="w-full"
          />
        </div>

        {/* Quick Mall List */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="md:col-span-2 lg:col-span-3 mb-4">
            <h3 className="text-xl font-bold dark:text-white mb-4">Quick Access</h3>
          </div>
          {mallsData.filter(mall => mall.status !== 'coming_soon').map((mall) => (
            <div
              key={mall.id}
              onClick={() => handleMallSelect(mall.id)}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-all border border-gray-200 dark:border-gray-700 hover:border-blue-500"
            >
              <div className="flex items-start gap-4">
                <img 
                  src={mall.image} 
                  alt={mall.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h4 className="font-bold text-lg dark:text-white">{mall.name}</h4>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">{mall.location}</p>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      mall.status === 'open' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {mall.status === 'open' ? 'Open' : 'Closed'}
                    </span>
                    <span className="text-xs text-gray-500">{mall.hours}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
