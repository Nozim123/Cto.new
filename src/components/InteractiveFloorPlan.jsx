import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTheme } from '../contexts/ThemeContext'
import { useLanguage } from '../contexts/LanguageContext'
import { Users, Clock } from 'lucide-react'

export default function InteractiveFloorPlan({ stores, mallId }) {
  const [selectedStore, setSelectedStore] = useState(null)
  const { darkMode } = useTheme()
  const { t } = useLanguage()
  const [storeStatus, setStoreStatus] = useState({})

  // Simulate real-time updates
  useEffect(() => {
    // Initial generation
    const generateStatus = () => {
      const newStatus = {}
      stores.forEach(store => {
        const crowdLevel = Math.floor(Math.random() * 3) // 0: Low, 1: Med, 2: High
        newStatus[store.id] = {
          crowd: crowdLevel,
          visitors: Math.floor(Math.random() * 50) + 5
        }
      })
      setStoreStatus(newStatus)
    }

    generateStatus()

    const interval = setInterval(() => {
      // Update a random store's status every 2 seconds to simulate live data
      const randomStore = stores[Math.floor(Math.random() * stores.length)]
      if (randomStore) {
        setStoreStatus(prev => ({
          ...prev,
          [randomStore.id]: {
            crowd: Math.floor(Math.random() * 3),
            visitors: Math.floor(Math.random() * 50) + 5
          }
        }))
      }
    }, 2000)

    return () => clearInterval(interval)
  }, [stores])

  const storesByFloor = stores.reduce((acc, store) => {
    const floor = store.floor || 1
    if (!acc[floor]) acc[floor] = []
    acc[floor].push(store)
    return acc
  }, {})

  const floors = Object.keys(storesByFloor).sort((a, b) => b - a)

  const getCrowdColor = (level) => {
    switch(level) {
      case 0: return 'bg-green-500'
      case 1: return 'bg-yellow-500'
      case 2: return 'bg-red-500'
      default: return 'bg-green-500'
    }
  }

  const getCrowdLabel = (level) => {
    switch(level) {
      case 0: return 'Quiet'
      case 1: return 'Moderate'
      case 2: return 'Busy'
      default: return 'Quiet'
    }
  }

  return (
    <div className={`relative ${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-6 shadow-2xl overflow-hidden`}>
      <div className="absolute top-0 right-0 p-4">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-green-500 animate-pulse">
          <span className="w-2 h-2 rounded-full bg-green-500"></span>
          Live View
        </div>
      </div>

      <h3 className="heading-small mb-8 text-center">{t('map')}</h3>
      
      <div className="space-y-12">
        {floors.map((floor) => (
          <div key={floor} className="relative perspective-1000">
            <div className="flex items-center gap-4 mb-6">
              <span className={`inline-block px-6 py-2 rounded-lg font-bold shadow-lg transform -skew-x-12 ${
                darkMode 
                  ? 'bg-slate-700 text-cyan-400' 
                  : 'bg-slate-100 text-cyan-600'
              }`}>
                Floor {floor}
              </span>
              <div className="h-px flex-grow bg-gradient-to-r from-cyan-500/50 to-transparent"></div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 transform rotate-x-10 transition-transform duration-500 hover:rotate-x-0">
              {storesByFloor[floor].map((store) => (
                <button
                  key={store.id}
                  onClick={() => setSelectedStore(store)}
                  className={`group relative p-4 rounded-xl border transition-all duration-300 
                            hover:scale-105 hover:-translate-y-2 hover:shadow-xl
                            ${darkMode 
                              ? 'bg-slate-700/50 border-slate-600 hover:border-cyan-400' 
                              : 'bg-slate-50 border-slate-200 hover:border-cyan-500'
                            }
                            ${selectedStore?.id === store.id ? 'border-cyan-500 ring-2 ring-cyan-500/50' : ''}`}
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden bg-white shadow-md p-1 group-hover:rotate-12 transition-transform duration-300">
                      <img
                        src={store.logo}
                        alt={store.name}
                        className="w-full h-full object-cover rounded-full"
                      />
                      {storeStatus[store.id] && (
                        <div className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white ${getCrowdColor(storeStatus[store.id].crowd)}`} title="Crowd Level" />
                      )}
                    </div>
                    <span className={`text-sm font-bold text-center line-clamp-1 ${
                      darkMode ? 'text-white' : 'text-slate-800'
                    }`}>
                      {store.name}
                    </span>
                    <span className={`text-xs ${
                      darkMode ? 'text-slate-400' : 'text-slate-500'
                    }`}>
                      {store.category}
                    </span>
                    
                    {storeStatus[store.id] && (
                      <div className={`text-xs px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center gap-1 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                        <Users className="w-3 h-3" />
                        {storeStatus[store.id].visitors}
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {selectedStore && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setSelectedStore(null)}
        >
          <div 
            className={`max-w-lg w-full rounded-2xl p-8 transform transition-all duration-300 scale-100 shadow-2xl
                       ${darkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white'}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <img
                  src={selectedStore.logo}
                  alt={selectedStore.name}
                  className="w-20 h-20 rounded-2xl object-cover shadow-lg"
                />
                <div>
                  <h4 className={`font-display text-2xl font-bold ${
                    darkMode ? 'text-white' : 'text-slate-800'
                  }`}>
                    {selectedStore.name}
                  </h4>
                  <p className={`text-sm ${
                    darkMode ? 'text-slate-400' : 'text-slate-500'
                  }`}>
                    {selectedStore.category}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                      storeStatus[selectedStore.id]?.crowd === 2 ? 'bg-red-100 text-red-600' :
                      storeStatus[selectedStore.id]?.crowd === 1 ? 'bg-yellow-100 text-yellow-600' :
                      'bg-green-100 text-green-600'
                    }`}>
                      {getCrowdLabel(storeStatus[selectedStore.id]?.crowd)}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Live Updates
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedStore(null)}
                className={`p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors ${
                  darkMode ? 'text-white' : 'text-slate-800'
                }`}
              >
                ✕
              </button>
            </div>

            <div className={`mb-8 ${darkMode ? 'text-slate-300' : 'text-slate-600'} leading-relaxed`}>
              <p>{selectedStore.description}</p>
            </div>

            <div className="flex gap-4">
              <Link
                to={`/mall/${mallId}/store/${selectedStore.id}`}
                className="flex-1 button-primary text-center flex items-center justify-center gap-2 group"
                onClick={() => setSelectedStore(null)}
              >
                {t('viewDetails')}
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
