import { useState, useEffect, useRef } from 'react'
import { useTheme } from '../contexts/ThemeContext'
import { useLanguage } from '../contexts/LanguageContext'
import mallsData from '../data/malls.json'

export default function RealTimeMap() {
  const { darkMode, accentColor } = useTheme()
  const { t } = useLanguage()
  const [selectedMall, setSelectedMall] = useState(null)
  const [mapCenter, setMapCenter] = useState([39.6542, 66.9597])
  const [userLocation, setUserLocation] = useState(null)
  const [liveEvents, setLiveEvents] = useState([])
  const mapRef = useRef(null)

  // Simulate real-time events
  useEffect(() => {
    const interval = setInterval(() => {
      const events = [
        { type: 'crowd', message: 'Heavy crowd at Family Park Mall', mall: 'family-park', time: new Date() },
        { type: 'promotion', message: '50% off at Samarkand Central', mall: 'samarkand-central', time: new Date() },
        { type: 'event', message: 'Cultural event at Orient Bazaar', mall: 'orient-bazaar', time: new Date() },
        { type: 'maintenance', message: 'Elevator maintenance at Golden Gate', mall: 'golden-gate', time: new Date() }
      ]
      
      // Randomly add an event
      if (Math.random() < 0.3) {
        const newEvent = events[Math.floor(Math.random() * events.length)]
        setLiveEvents(prev => [newEvent, ...prev.slice(0, 4)])
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude])
        },
        (error) => console.log('Error getting location:', error)
      )
    }
  }, [])

  const openMalls = mallsData.filter(mall => mall.status === 'open')
  const comingSoonMalls = mallsData.filter(mall => mall.status === 'coming_soon')

  const getMarkerStyle = (mall) => {
    const isSelected = selectedMall?.id === mall.id
    const isOpen = mall.status === 'open'
    
    return {
      left: `${50 + (mall.coordinates[1] - 66.9) * 1000}%`,
      top: `${50 - (mall.coordinates[0] - 39.6) * 1000}%`,
      transform: isSelected ? 'scale(1.5)' : 'scale(1)',
      backgroundColor: isOpen ? 'var(--accent-primary)' : '#6B7280',
      boxShadow: isSelected ? `0 0 20px var(--accent-primary)` : '0 2px 10px rgba(0,0,0,0.3)'
    }
  }

  return (
    <section className="relative section-padding max-w-7xl mx-auto">
      <div className="text-center mb-12 animate-fade-in-up">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30 text-purple-700 dark:text-purple-300 text-sm font-medium mb-6">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          Live Map - Real-time Updates
        </div>
        
        <h2 className="text-4xl lg:text-5xl font-bold mb-6">
          <span className="bg-gradient-to-r from-purple-500 to-purple-700 bg-clip-text text-transparent">
            Interactive Mall Map
          </span>
        </h2>

        <p className={`text-xl max-w-3xl mx-auto leading-relaxed ${
          darkMode ? 'text-gray-300' : 'text-gray-600'
        }`}>
          Explore Samarkand's shopping destinations with real-time information, live events, and interactive features
        </p>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Map Container */}
        <div className="lg:col-span-3">
          <div className="relative">
            {/* Map */}
            <div 
              ref={mapRef}
              className="relative h-96 lg:h-[600px] rounded-3xl overflow-hidden bg-gradient-to-br from-purple-100 via-purple-50 to-white dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 border border-purple-200/30 dark:border-purple-700/30 shadow-2xl"
            >
              {/* Map Background Grid */}
              <div className="absolute inset-0 opacity-20">
                <div className="w-full h-full" style={{
                  backgroundImage: `
                    radial-gradient(circle at 1px 1px, rgba(139, 92, 246, 0.3) 1px, transparent 0),
                    linear-gradient(rgba(139, 92, 246, 0.1) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(139, 92, 246, 0.1) 1px, transparent 1px)
                  `,
                  backgroundSize: '20px 20px, 40px 40px, 40px 40px'
                }}></div>
              </div>

              {/* Mall Markers */}
              {mallsData.map((mall) => (
                <div
                  key={mall.id}
                  className={`absolute w-6 h-6 rounded-full border-2 border-white dark:border-gray-800 cursor-pointer transition-all duration-300 hover:scale-125 animate-pulse-glow ${mall.status === 'open' ? 'bg-green-500' : 'bg-gray-400'}`}
                  style={getMarkerStyle(mall)}
                  onClick={() => setSelectedMall(mall)}
                >
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 hover:opacity-100 transition-opacity whitespace-nowrap">
                    {mall.name}
                  </div>
                </div>
              ))}

              {/* User Location */}
              {userLocation && (
                <div
                  className="absolute w-4 h-4 bg-blue-500 rounded-full border-2 border-white animate-ping"
                  style={{
                    left: `${50 + (userLocation[1] - 66.9) * 1000}%`,
                    top: `${50 - (userLocation[0] - 39.6) * 1000}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                >
                  <div className="absolute inset-0 bg-blue-500 rounded-full opacity-75"></div>
                </div>
              )}

              {/* Map Controls */}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                <button className="w-10 h-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg shadow-lg hover:bg-white dark:hover:bg-gray-800 transition-all flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </button>
                <button className="w-10 h-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg shadow-lg hover:bg-white dark:hover:bg-gray-800 transition-all flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>
              </div>

              {/* Live Indicator */}
              <div className="absolute top-4 left-4">
                <div className="flex items-center gap-2 px-3 py-2 bg-red-500/90 backdrop-blur-sm text-white text-sm font-medium rounded-lg">
                  <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                  LIVE
                </div>
              </div>
            </div>

            {/* Map Legend */}
            <div className="mt-4 p-4 bg-white/60 dark:bg-gray-900/60 backdrop-blur-lg rounded-2xl border border-purple-200/30 dark:border-purple-700/30">
              <div className="flex flex-wrap gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>Open Malls ({openMalls.length})</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                  <span>Coming Soon ({comingSoonMalls.length})</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-ping"></div>
                  <span>Your Location</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
                  <span>Selected Mall</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mall Info Panel */}
        <div className="lg:col-span-1">
          <div className="space-y-6">
            {/* Selected Mall Info */}
            {selectedMall && (
              <div className="p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg rounded-2xl border border-purple-200/30 dark:border-purple-700/30 shadow-lg animate-slide-in-right">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    {selectedMall.name}
                  </h3>
                  <button 
                    onClick={() => setSelectedMall(null)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${selectedMall.status === 'open' ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                    <span className="text-sm capitalize">{selectedMall.status.replace('_', ' ')}</span>
                  </div>
                  
                  {selectedMall.rating > 0 && (
                    <div className="flex items-center gap-2">
                      <div className="flex text-yellow-400">
                        {'★'.repeat(Math.floor(selectedMall.rating))}
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {selectedMall.rating} ({selectedMall.reviews} reviews)
                      </span>
                    </div>
                  )}

                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <p>{selectedMall.storeCount} stores</p>
                    <p>{selectedMall.hours}</p>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-3">
                    {selectedMall.features?.slice(0, 3).map((feature, index) => (
                      <span 
                        key={index}
                        className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs rounded-full"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>

                  <button className="w-full mt-4 button-3d bg-gradient-to-r from-purple-500 to-purple-700 text-white py-2 px-4 rounded-lg font-medium hover:from-purple-600 hover:to-purple-800 transition-all">
                    View Details
                  </button>
                </div>
              </div>
            )}

            {/* Live Events Feed */}
            <div className="p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg rounded-2xl border border-purple-200/30 dark:border-purple-700/30 shadow-lg">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
                Live Events
              </h3>
              
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {liveEvents.length === 0 ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                    No live events at the moment
                  </p>
                ) : (
                  liveEvents.map((event, index) => (
                    <div 
                      key={index}
                      className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border-l-4 border-purple-500 animate-slide-in-left"
                      style={{animationDelay: `${index * 0.1}s`}}
                    >
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {event.message}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {event.time.toLocaleTimeString()}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Open Now', value: openMalls.length, icon: '🏢', color: 'from-green-400 to-green-600' },
                { label: 'Coming Soon', value: comingSoonMalls.length, icon: '🚧', color: 'from-orange-400 to-orange-600' }
              ].map((stat, index) => (
                <div 
                  key={index}
                  className="p-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg rounded-xl border border-purple-200/30 dark:border-purple-700/30 text-center hover:scale-105 transition-transform"
                >
                  <div className="text-2xl mb-1">{stat.icon}</div>
                  <div className="text-xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}