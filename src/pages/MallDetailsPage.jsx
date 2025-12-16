import { Link, useParams } from 'react-router-dom'
import { useEffect, useMemo } from 'react'
import { Calendar, Clock, MapPin, Store } from 'lucide-react'

import { useTheme } from '../contexts/ThemeContext'
import { useRealtimeData } from '../contexts/RealtimeDataContext'
import { trackBehavior } from '../services/behavior'

import Button3D from '../components/Button3D'
import RealisticIcon from '../components/RealisticIcon'
import StoreCard from '../components/StoreCard'
import StoriesCarousel from '../components/StoriesCarousel'
import InteractiveFloorPlan from '../components/InteractiveFloorPlan'

export default function MallDetailsPage() {
  const { mallId } = useParams()
  const { darkMode } = useTheme()
  const { malls, stores } = useRealtimeData()

  const mall = useMemo(() => malls.find((m) => m.id === mallId) || null, [malls, mallId])
  const mallStores = useMemo(() => stores.filter((s) => s.mall_id === mallId), [stores, mallId])
  const featuredStores = useMemo(() => mallStores.slice(0, 3), [mallStores])

  useEffect(() => {
    if (mall) {
      trackBehavior({ type: 'mall', id: mallId })
    }
  }, [mall, mallId])

  if (!mall) {
    return (
      <div className="section-padding text-center">
        <h1 className="heading-large mb-4">Mall Not Found</h1>
        <p className="text-gray-600 mb-6">The mall you're looking for doesn't exist.</p>
        <Link to="/" className="button-primary inline-block">
          Back to Home
        </Link>
      </div>
    )
  }

  const isComingSoon = mall.status === 'coming_soon'
  const banner = mall.banner || mall.gallery?.[0] || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200'

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <div className="max-w-6xl mx-auto px-4 lg:px-8 pt-6">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-6 flex-wrap">
          <Link to="/" className="hover:text-gold transition-colors duration-300">
            Home
          </Link>
          <span>/</span>
          <span className="text-navy font-semibold">{mall.name}</span>
        </div>
      </div>

      {/* Hero Banner */}
      <section className="relative w-full overflow-hidden">
        <div className="relative h-72 md:h-[520px] bg-gray-200 dark:bg-gray-800">
          <img src={banner} alt={mall.name} className="w-full h-full object-cover" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          <div className="absolute bottom-0 left-0 right-0">
            <div className="max-w-6xl mx-auto px-4 lg:px-8 pb-10">
              <div className="max-w-3xl">
                <h1 className="font-display text-4xl md:text-6xl font-bold text-white mb-4">{mall.name}</h1>
                <p className="text-white/90 text-lg md:text-xl leading-relaxed">
                  {mall.description_short || mall.description_full}
                </p>

                {!isComingSoon ? (
                  <div className="mt-8 flex flex-col sm:flex-row gap-3">
                    <Link to={`/mall/${mallId}/stores`}>
                      <Button3D variant="primary" size="lg">
                        <span className="inline-flex items-center gap-2">
                          <Store className="w-5 h-5" />
                          Explore Stores
                        </span>
                      </Button3D>
                    </Link>

                    <Link to={`/mall/${mallId}/stores`}>
                      <Button3D variant="outline" size="lg">
                        View Directory →
                      </Button3D>
                    </Link>
                  </div>
                ) : (
                  <div className="mt-8">
                    <Button3D variant="outline" size="lg" disabled>
                      Coming Soon
                    </Button3D>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Glass info panels */}
        <div className={`${darkMode ? 'bg-gray-900' : 'bg-cream'} transition-colors duration-300`}
        >
          <div className="max-w-6xl mx-auto px-4 lg:px-8 py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className={`p-6 rounded-2xl ${darkMode ? 'bg-gray-800/60' : 'bg-white/60'} backdrop-blur-lg border border-purple-200/20 dark:border-purple-700/20`}>
                <div className="flex items-center gap-3 mb-2">
                  <RealisticIcon Icon={Clock} size={18} padding={8} />
                  <p className="text-gold text-sm font-semibold">WORKING HOURS</p>
                </div>
                <p className={`${darkMode ? 'text-cream' : 'text-navy'} text-lg font-semibold`}>{mall.work_time || '—'}</p>
              </div>

              <div className={`p-6 rounded-2xl ${darkMode ? 'bg-gray-800/60' : 'bg-white/60'} backdrop-blur-lg border border-purple-200/20 dark:border-purple-700/20`}>
                <div className="flex items-center gap-3 mb-2">
                  <RealisticIcon Icon={MapPin} size={18} padding={8} />
                  <p className="text-gold text-sm font-semibold">LOCATION</p>
                </div>
                <p className={`${darkMode ? 'text-cream' : 'text-navy'} text-lg font-semibold`}>{mall.address || '—'}</p>
              </div>

              <div className={`p-6 rounded-2xl ${darkMode ? 'bg-gray-800/60' : 'bg-white/60'} backdrop-blur-lg border border-purple-200/20 dark:border-purple-700/20`}>
                <div className="flex items-center gap-3 mb-2">
                  <RealisticIcon Icon={Calendar} size={18} padding={8} />
                  <p className="text-gold text-sm font-semibold">OPENED</p>
                </div>
                <p className={`${darkMode ? 'text-cream' : 'text-navy'} text-lg font-semibold`}>{mall.opened_date || '—'}</p>
              </div>
            </div>

            {mall.categories?.length ? (
              <div className="mt-6 flex flex-wrap gap-2">
                {mall.categories.map((c) => (
                  <span key={c} className="px-3 py-1 rounded-full bg-gold/15 text-gold text-sm font-semibold">
                    {c}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {/* Highlights */}
      {mallStores.length > 0 ? (
        <div className={`py-6 border-b ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
          <div className="max-w-6xl mx-auto">
            <h3 className={`px-4 lg:px-8 mb-4 font-display text-xl font-bold ${darkMode ? 'text-cream' : 'text-navy'}`}>
              Store Highlights
            </h3>
            <StoriesCarousel stores={mallStores} />
          </div>
        </div>
      ) : null}

      {/* About + Gallery */}
      <section className="section-padding max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="fade-in-up">
            <h2 className="heading-medium mb-6">About {mall.name}</h2>
            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} text-lg leading-relaxed`}>{mall.description_full || mall.description_short}</p>

            <div className={`mt-8 p-6 rounded-2xl ${darkMode ? 'bg-gray-800 glass-card-dark' : 'bg-white glass-card'} card-shadow`}>
              <h4 className={`font-semibold mb-3 ${darkMode ? 'text-cream' : 'text-navy'}`}>Contact Information</h4>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                <span className="font-semibold">Phone:</span> {mall.phone || '—'}
              </p>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                <span className="font-semibold">Website:</span> {mall.social?.website || '—'}
              </p>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <span className="font-semibold">Status:</span>{' '}
                <span className="capitalize">{mall.status?.replace('_', ' ')}</span>
              </p>
            </div>
          </div>

          <div className="fade-in-up-delay-1">
            <h3 className="heading-small mb-4">Gallery</h3>
            <div className="grid grid-cols-2 gap-4">
              {(mall.gallery?.length ? mall.gallery : [banner]).slice(0, 6).map((src, idx) => (
                <div key={src + idx} className={`rounded-2xl overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-gray-100'} card-shadow`}>
                  <img src={src} alt={`${mall.name} ${idx + 1}`} className="w-full h-40 object-cover" loading="lazy" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Floor Plan */}
      {mallStores.length > 0 ? (
        <section className="section-padding max-w-6xl mx-auto">
          <InteractiveFloorPlan stores={mallStores} mallId={mallId} />
        </section>
      ) : null}

      {/* Store Directory Preview */}
      {featuredStores.length > 0 ? (
        <section className={`section-padding max-w-6xl mx-auto rounded-2xl ${darkMode ? 'bg-gray-900/50' : 'bg-cream/70'} backdrop-blur`}
        >
          <div className="flex justify-between items-center mb-8 fade-in-up">
            <h2 className="heading-medium">Featured Stores</h2>
            <Link to={`/mall/${mallId}/stores`} className="text-gold hover:text-gold/80 font-semibold transition-all duration-300 hover:scale-105">
              View All →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {featuredStores.map((store, index) => (
              <div key={store.id} className={`fade-in-up-delay-${Math.min(index + 1, 3)}`}>
                <StoreCard store={store} mallId={mallId} />
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link to={`/mall/${mallId}/stores`} className="inline-block">
              <Button3D variant="primary" size="lg">
                Explore All Stores
              </Button3D>
            </Link>
          </div>
        </section>
      ) : null}
    </div>
  )
}
