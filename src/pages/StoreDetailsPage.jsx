import { Link, useParams } from 'react-router-dom'
import { useEffect, useMemo } from 'react'
import { Clock, Mail, MapPin, Phone, Store as StoreIcon } from 'lucide-react'

import { trackBehavior } from '../services/behavior'
import { useRealtimeData } from '../contexts/RealtimeDataContext'
import { useTheme } from '../contexts/ThemeContext'

import Button3D from '../components/Button3D'
import ProductCard from '../components/ProductCard'
import RealisticIcon from '../components/RealisticIcon'

export default function StoreDetailsPage() {
  const { mallId, storeId } = useParams()
  const { darkMode } = useTheme()
  const { malls, stores, products } = useRealtimeData()

  const mall = useMemo(() => malls.find((m) => m.id === mallId) || null, [malls, mallId])
  const store = useMemo(
    () => stores.find((s) => s.id === storeId && s.mall_id === mallId) || null,
    [stores, storeId, mallId]
  )
  const storeProducts = useMemo(() => products.filter((p) => p.store_id === storeId), [products, storeId])

  useEffect(() => {
    if (store) {
      trackBehavior({ type: 'store', id: storeId, category: store.category })
    }
  }, [store, storeId])

  if (!mall || !store) {
    return (
      <div className="section-padding text-center">
        <h1 className="heading-large mb-4">Store Not Found</h1>
        <Link to="/" className="button-primary inline-block">
          Back to Home
        </Link>
      </div>
    )
  }

  const banner = store.banner || store.logo || 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200'

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <div className="max-w-6xl mx-auto px-4 lg:px-8 pt-6">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-6 flex-wrap">
          <Link to="/" className="hover:text-gold transition-colors duration-300">
            Home
          </Link>
          <span>/</span>
          <Link to={`/mall/${mallId}`} className="hover:text-gold transition-colors duration-300">
            {mall.name}
          </Link>
          <span>/</span>
          <Link to={`/mall/${mallId}/stores`} className="hover:text-gold transition-colors duration-300">
            Stores
          </Link>
          <span>/</span>
          <span className="text-navy font-semibold">{store.name}</span>
        </div>
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="relative h-72 md:h-[480px]">
          <img src={banner} alt={store.name} className="w-full h-full object-cover" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

          <div className="absolute bottom-0 left-0 right-0">
            <div className="max-w-6xl mx-auto px-4 lg:px-8 pb-10">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
                <div className="max-w-3xl">
                  <p className="text-gold text-sm font-semibold mb-2">{store.category}</p>
                  <h1 className="font-display text-4xl md:text-6xl font-bold text-white">{store.name}</h1>
                  {store.description_short ? (
                    <p className="text-white/90 text-lg mt-4 leading-relaxed">{store.description_short}</p>
                  ) : null}
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <a href="#products" className="inline-block">
                    <Button3D variant="primary" size="lg">
                      <span className="inline-flex items-center gap-2">
                        <StoreIcon className="w-5 h-5" />
                        View Products
                      </span>
                    </Button3D>
                  </a>
                  <Link to={`/mall/${mallId}/stores`}>
                    <Button3D variant="outline" size="lg">
                      Back to Stores
                    </Button3D>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Info strip */}
        <div className={`${darkMode ? 'bg-gray-900' : 'bg-cream'} transition-colors duration-300`}
        >
          <div className="max-w-6xl mx-auto px-4 lg:px-8 py-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className={`p-5 rounded-2xl ${darkMode ? 'bg-gray-800/60' : 'bg-white/60'} backdrop-blur-lg border border-purple-200/20 dark:border-purple-700/20`}>
                <div className="flex items-center gap-3 mb-2">
                  <RealisticIcon Icon={MapPin} size={18} padding={8} />
                  <p className="text-gold text-sm font-semibold">FLOOR</p>
                </div>
                <p className={`${darkMode ? 'text-cream' : 'text-navy'} font-semibold`}>{store.floor ?? '—'}</p>
              </div>

              <div className={`p-5 rounded-2xl ${darkMode ? 'bg-gray-800/60' : 'bg-white/60'} backdrop-blur-lg border border-purple-200/20 dark:border-purple-700/20`}>
                <div className="flex items-center gap-3 mb-2">
                  <RealisticIcon Icon={Clock} size={18} padding={8} />
                  <p className="text-gold text-sm font-semibold">HOURS</p>
                </div>
                <p className={`${darkMode ? 'text-cream' : 'text-navy'} font-semibold`}>{store.work_time || '—'}</p>
              </div>

              <div className={`p-5 rounded-2xl ${darkMode ? 'bg-gray-800/60' : 'bg-white/60'} backdrop-blur-lg border border-purple-200/20 dark:border-purple-700/20`}>
                <div className="flex items-center gap-3 mb-2">
                  <RealisticIcon Icon={Phone} size={18} padding={8} />
                  <p className="text-gold text-sm font-semibold">PHONE</p>
                </div>
                <p className={`${darkMode ? 'text-cream' : 'text-navy'} font-semibold`}>{store.phone || '—'}</p>
              </div>

              <div className={`p-5 rounded-2xl ${darkMode ? 'bg-gray-800/60' : 'bg-white/60'} backdrop-blur-lg border border-purple-200/20 dark:border-purple-700/20`}>
                <div className="flex items-center gap-3 mb-2">
                  <RealisticIcon Icon={Mail} size={18} padding={8} />
                  <p className="text-gold text-sm font-semibold">EMAIL</p>
                </div>
                <p className={`${darkMode ? 'text-cream' : 'text-navy'} font-semibold break-words`}>{store.email || '—'}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="section-padding max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div>
            <h2 className="heading-medium mb-6">About {store.name}</h2>
            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} text-lg leading-relaxed`}>{store.description_full || store.description_short}</p>
          </div>

          <div className={`rounded-2xl p-8 ${darkMode ? 'bg-gray-800 glass-card-dark' : 'bg-white glass-card'} card-shadow`}>
            <h3 className={`font-display text-2xl font-bold mb-6 ${darkMode ? 'text-cream' : 'text-navy'}`}>Store Information</h3>
            <div className={`space-y-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <p>
                <span className="font-semibold">Mall:</span> {mall.name}
              </p>
              <p>
                <span className="font-semibold">Category:</span> {store.category || '—'}
              </p>
              <p>
                <span className="font-semibold">Status:</span> <span className="capitalize">{store.status || 'open'}</span>
              </p>
              <p>
                <span className="font-semibold">Hours:</span> {store.work_time || '—'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Products */}
      <section id="products" className="section-padding max-w-6xl mx-auto">
        <div className="flex items-center justify-between gap-6 mb-10">
          <h2 className="heading-medium">Products</h2>
          <span className="text-sm text-gray-600">{storeProducts.length} items</span>
        </div>

        {storeProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {storeProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                to={`/mall/${mallId}/store/${storeId}/product/${product.id}`}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} text-lg`}>No products available yet.</p>
          </div>
        )}
      </section>
    </div>
  )
}
