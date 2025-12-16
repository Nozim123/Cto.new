import { useState } from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Phone } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import RealisticIcon from './RealisticIcon'

export default function InteractiveFloorPlan({ stores, mallId }) {
  const [selectedStore, setSelectedStore] = useState(null)
  const { darkMode } = useTheme()

  const storesByFloor = stores.reduce((acc, store) => {
    const floor = store.floor || 1
    if (!acc[floor]) acc[floor] = []
    acc[floor].push(store)
    return acc
  }, {})

  const floors = Object.keys(storesByFloor).sort((a, b) => b - a)

  return (
    <div className={`relative ${darkMode ? 'bg-gray-800' : 'bg-cream'} rounded-lg p-6 card-shadow`}>
      <h3 className="heading-small mb-6 text-center">Interactive Floor Plan</h3>
      
      <div className="space-y-8">
        {floors.map((floor) => (
          <div key={floor} className="relative">
            <div className="text-center mb-4">
              <span className={`inline-block px-4 py-2 rounded-full font-bold ${
                darkMode 
                  ? 'bg-gray-700 text-gold' 
                  : 'bg-navy text-gold'
              }`}>
                Floor {floor}
              </span>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {storesByFloor[floor].map((store) => (
                <button
                  key={store.id}
                  onClick={() => setSelectedStore(store)}
                  className={`relative p-4 rounded-lg border-2 transition-all duration-300 
                            transform hover:scale-105 hover:shadow-lg group
                            ${darkMode 
                              ? 'bg-gray-700 border-gray-600 hover:border-gold' 
                              : 'bg-white border-gray-300 hover:border-gold'
                            }
                            ${selectedStore?.id === store.id ? 'border-gold ring-2 ring-gold ring-opacity-50' : ''}`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-600">
                      <img
                        src={store.logo}
                        alt={store.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className={`text-xs font-medium text-center line-clamp-2 ${
                      darkMode ? 'text-cream' : 'text-navy'
                    }`}>
                      {store.name}
                    </span>
                    <span className={`text-xs ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      {store.category}
                    </span>
                  </div>
                  
                  <div className="absolute inset-0 bg-gold bg-opacity-0 group-hover:bg-opacity-5 
                                rounded-lg transition-all duration-300"></div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {selectedStore && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
          onClick={() => setSelectedStore(null)}
        >
          <div 
            className={`max-w-md w-full rounded-lg p-6 transform transition-all duration-300 scale-100
                       ${darkMode ? 'bg-gray-800' : 'bg-white'} card-shadow`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <img
                  src={selectedStore.logo}
                  alt={selectedStore.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div>
                  <h4 className={`font-display text-xl font-bold ${
                    darkMode ? 'text-cream' : 'text-navy'
                  }`}>
                    {selectedStore.name}
                  </h4>
                  <p className={`text-sm ${
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {selectedStore.category}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedStore(null)}
                className={`text-2xl hover:opacity-70 transition-opacity ${
                  darkMode ? 'text-cream' : 'text-navy'
                }`}
              >
                ✕
              </button>
            </div>

            <div className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <p className="mb-2">{selectedStore.description_short || selectedStore.description_full || ''}</p>
              <div className="flex items-center gap-4 text-sm mt-4">
                <span className="flex items-center gap-2">
                  <RealisticIcon Icon={MapPin} size={14} padding={6} radius={12} className="!shadow-none" />
                  Floor {selectedStore.floor ?? '—'}
                </span>
                {selectedStore.phone && (
                  <span className="flex items-center gap-2">
                    <RealisticIcon Icon={Phone} size={14} padding={6} radius={12} className="!shadow-none" />
                    {selectedStore.phone}
                  </span>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <Link
                to={`/mall/${mallId}/store/${selectedStore.id}`}
                className="flex-1 button-primary text-center"
                onClick={() => setSelectedStore(null)}
              >
                View Store
              </Link>
              <button
                onClick={() => setSelectedStore(null)}
                className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-colors ${
                  darkMode
                    ? 'bg-gray-700 text-cream hover:bg-gray-600'
                    : 'bg-gray-200 text-navy hover:bg-gray-300'
                }`}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
