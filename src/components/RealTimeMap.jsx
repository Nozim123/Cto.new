import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Building2, Construction } from 'lucide-react'

import { useTheme } from '../contexts/ThemeContext'
import { useLanguage } from '../contexts/LanguageContext'
import { useRealtimeData } from '../contexts/RealtimeDataContext'
import RealisticIcon from './RealisticIcon'

export default function RealTimeMap() {
  const { darkMode } = useTheme()
  const { t } = useLanguage()
  const navigate = useNavigate()
  const { malls, stores, products } = useRealtimeData()

  const [selectedMall, setSelectedMall] = useState(null)
  const [selectedStore, setSelectedStore] = useState(null)
  const [mapCenter, setMapCenter] = useState([39.6542, 66.9597])
  const [userLocation, setUserLocation] = useState(null)
  const [liveEvents, setLiveEvents] = useState([])
  const mapRef = useRef(null)

  const openMalls = useMemo(() => malls.filter((mall) => mall.status === 'open'), [malls])
  const comingSoonMalls = useMemo(() => malls.filter((mall) => mall.status === 'coming_soon'), [malls])

  // Simulate real-time events (demo)
  useEffect(() => {
    const interval = setInterval(() => {
      if (malls.length === 0) return

      const mall = malls[Math.floor(Math.random() * malls.length)]
      const templates = [
        { type: 'crowd', message: `Live crowd update at ${mall.name}` },
        { type: 'promotion', message: `New promotion published in ${mall.name}` },
        { type: 'event', message: `Live event announced in ${mall.name}` },
        { type: 'maintenance', message: `Maintenance notice at ${mall.name}` }
      ]

      if (Math.random() < 0.3) {
        const newEvent = templates[Math.floor(Math.random() * templates.length)]
        setLiveEvents((prev) => [{ ...newEvent, mallId: mall.id, time: new Date() }, ...prev.slice(0, 4)])
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [malls])

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude])
        },
        () => {}
      )
    }
  }, [])

  const getLatLng = (mall) => {
    const lat = mall.location?.lat ?? 0
    const lng = mall.location?.lng ?? 0
    return [lat, lng]
  }

  const getMarkerStyle = (mall) => {
    const isSelected = selectedMall?.id === mall.id
    const [lat, lng] = getLatLng(mall)

    return {
      left: `${50 + (lng - mapCenter[1]) * 1000}%`,
      top: `${50 - (lat - mapCenter[0]) * 1000}%`,
      transform: isSelected ? 'scale(1.5)' : 'scale(1)',
      boxShadow: isSelected ? `0 0 20px var(--accent-primary)` : '0 2px 10px rgba(0,0,0,0.3)'
    }
  }

  const selectedMallStores = useMemo(() => {
    if (!selectedMall) return []
    return stores.filter((s) => s.mall_id === selectedMall.id)
  }, [selectedMall, stores])

  const selectedStoreProducts = useMemo(() => {
    if (!selectedStore) return []
    return products.filter((p) => p.store_id === selectedStore.id)
  }, [products, selectedStore])

  return (
    <section className="relative section-padding max-w-7xl mx-auto">
      <div className="text-center mb-12 animate-fade-in-up">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30 text-purple-700 dark:text-purple-300 text-sm font-medium mb-6">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          {t('map.liveUpdates')}
        </div>

        <h2 className="text-4xl lg:text-5xl font-bold mb-6">
          <span className="bg-gradient-to-r from-purple-500 to-purple-700 bg-clip-text text-transparent">{t('map.title')}</span>
        </h2>

        <p className={`text-xl max-w-3xl mx-auto leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Explore malls and stores with live updates. Pins and lists refresh automatically.
        </p>
      </div>

      <div className="grid lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
        {/* Map Container */}
        <div className="lg:col-span-3 order-2 lg:order-1">
          <div className="relative">
            <div
              ref={mapRef}
              className="relative h-96 lg:h-[600px] rounded-3xl overflow-hidden bg-gradient-to-br from-purple-100 via-purple-50 to-white dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 border border-purple-200/30 dark:border-purple-700/30 shadow-2xl"
            >
              {/* Map Background Grid */}
              <div className="absolute inset-0 opacity-20">
                <div
                  className="w-full h-full"
                  style={{
                    backgroundImage: `
                      radial-gradient(circle at 1px 1px, rgba(139, 92, 246, 0.3) 1px, transparent 0),
                      linear-gradient(rgba(139, 92, 246, 0.1) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(139, 92, 246, 0.1) 1px, transparent 1px)
                    `,
                    backgroundSize: '20px 20px, 40px 40px, 40px 40px'
                  }}
                ></div>
              </div>

              {/* Mall Markers */}
              {malls.map((mall) => (
                <button
                  key={mall.id}
                  type="button"
                  className={`absolute w-6 h-6 rounded-full border-2 border-white dark:border-gray-800 cursor-pointer transition-all duration-300 hover:scale-125 animate-pulse-glow ${
                    mall.status === 'open' ? 'bg-green-500' : 'bg-gray-400'
                  }`}
                  style={getMarkerStyle(mall)}
                  onClick={() => {
                    setSelectedStore(null)
                    setSelectedMall(mall)
                    if (mall.location?.lat && mall.location?.lng) {
                      setMapCenter([mall.location.lat, mall.location.lng])
                    }
                  }}
                  aria-label={mall.name}
                >
                  <span className="sr-only">{mall.name}</span>
                </button>
              ))}

              {/* User Location */}
              {userLocation && (
                <div
                  className="absolute w-4 h-4 bg-blue-500 rounded-full border-2 border-white animate-ping"
                  style={{
                    left: `${50 + (userLocation[1] - mapCenter[1]) * 1000}%`,
                    top: `${50 - (userLocation[0] - mapCenter[0]) * 1000}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                >
                  <div className="absolute inset-0 bg-blue-500 rounded-full opacity-75"></div>
                </div>
              )}

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
                  <span>Open ({openMalls.length})</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                  <span>Coming Soon ({comingSoonMalls.length})</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-ping"></div>
                  <span>Your Location</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Info Panel */}
        <div className="lg:col-span-1 order-1 lg:order-2">
          <div className="space-y-4 sm:space-y-6">
            {/* Selected Mall */}
            {selectedMall && !selectedStore ? (
              <div className="p-4 sm:p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg rounded-2xl border border-purple-200/30 dark:border-purple-700/30 shadow-lg animate-slide-in-right">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">{selectedMall.name}</h3>
                  <button
                    type="button"
                    onClick={() => setSelectedMall(null)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    aria-label="Close"
                  >
                    ×
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${selectedMall.status === 'open' ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                    <span className="text-sm capitalize">{selectedMall.status?.replace('_', ' ')}</span>
                  </div>

                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <p>{selectedMallStores.length} stores</p>
                    <p>{selectedMall.work_time}</p>
                  </div>

                  <div className="mt-4">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">{t('map.storesInMall')}</h4>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {selectedMallStores.slice(0, 10).map((store) => (
                        <button
                          key={store.id}
                          type="button"
                          onClick={() => setSelectedStore(store)}
                          className="w-full text-left p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg cursor-pointer hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-all"
                        >
                          <div className="flex items-center gap-3">
                            <img src={store.logo} alt={store.name} className="w-10 h-10 rounded-lg object-cover" />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900 dark:text-white">{store.name}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">{store.category}</p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => navigate(`/mall/${selectedMall.id}`)}
                    className="w-full mt-4 button-3d bg-gradient-to-r from-purple-500 to-purple-700 text-white py-2 px-4 rounded-lg font-medium hover:from-purple-600 hover:to-purple-800 transition-all"
                  >
                    {t('map.viewMallDetails')}
                  </button>
                </div>
              </div>
            ) : null}

            {/* Selected Store */}
            {selectedStore ? (
              <div className="p-4 sm:p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg rounded-2xl border border-purple-200/30 dark:border-purple-700/30 shadow-lg animate-slide-in-right">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">{selectedStore.name}</h3>
                  <button
                    type="button"
                    onClick={() => setSelectedStore(null)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    aria-label="Close"
                  >
                    ×
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <p>{selectedStore.category}</p>
                    <p>
                      {t('map.floor')} {selectedStore.floor ?? '—'}
                    </p>
                    <p>{selectedStore.work_time}</p>
                  </div>

                  {selectedStore.description_short ? (
                    <p className="text-sm text-gray-600 dark:text-gray-400">{selectedStore.description_short}</p>
                  ) : null}

                  <div className="mt-4">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">{t('map.products')}:</h4>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {selectedStoreProducts.slice(0, 10).map((product) => (
                        <div key={product.id} className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                          <div className="flex items-center gap-3">
                            <img
                              src={product.gallery?.[0] || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=120'}
                              alt={product.name}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900 dark:text-white">{product.name}</p>
                              <div className="flex items-center justify-between mt-1">
                                <p className="text-xs text-gray-500 dark:text-gray-400">{product.category}</p>
                                {product.price ? (
                                  <p className="text-sm font-bold text-purple-600 dark:text-purple-400">{product.price}</p>
                                ) : null}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => navigate(`/mall/${selectedStore.mall_id}/store/${selectedStore.id}`)}
                    className="w-full mt-4 button-3d bg-gradient-to-r from-purple-500 to-purple-700 text-white py-2 px-4 rounded-lg font-medium hover:from-purple-600 hover:to-purple-800 transition-all"
                  >
                    {t('map.viewStoreDetails')}
                  </button>
                </div>
              </div>
            ) : null}

            {/* Live Events Feed */}
            <div className="p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg rounded-2xl border border-purple-200/30 dark:border-purple-700/30 shadow-lg">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
                {t('map.liveEvents')}
              </h3>

              <div className="space-y-3 max-h-64 overflow-y-auto">
                {liveEvents.length === 0 ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">No live events at the moment</p>
                ) : (
                  liveEvents.map((event, index) => (
                    <button
                      key={`${event.type}-${index}`}
                      type="button"
                      onClick={() => {
                        if (event.mallId) {
                          const mall = malls.find((m) => m.id === event.mallId)
                          if (mall) {
                            setSelectedMall(mall)
                            setSelectedStore(null)
                          }
                        }
                      }}
                      className="w-full text-left p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border-l-4 border-purple-500 animate-slide-in-left"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{event.message}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{event.time.toLocaleTimeString()}</p>
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: t('map.openNow'), value: openMalls.length, Icon: Building2, variant: 'green' },
                { label: t('common.comingSoon'), value: comingSoonMalls.length, Icon: Construction, variant: 'gold' }
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="p-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg rounded-xl border border-purple-200/30 dark:border-purple-700/30 text-center hover:scale-105 transition-transform"
                >
                  <div className="flex justify-center mb-2">
                    <RealisticIcon Icon={stat.Icon} size={18} padding={8} variant={stat.variant} />
                  </div>
                  <div className="text-xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
