import { Link, useParams } from 'react-router-dom'
import { useMemo, useState } from 'react'
import { MapPin, Package, Tag } from 'lucide-react'

import { useTheme } from '../contexts/ThemeContext'
import { useRealtimeData } from '../contexts/RealtimeDataContext'
import Button3D from '../components/Button3D'

const parsePrice = (raw) => {
  if (raw === null || raw === undefined) return null
  const str = String(raw).trim()
  if (!str) return null

  const normalized = str.replace(/,/g, '')
  const n = Number(normalized)
  if (Number.isNaN(n)) return str
  return n
}

const formatPrice = (raw) => {
  const value = parsePrice(raw)
  if (value === null) return null
  if (typeof value === 'number') {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(value)
  }
  return value
}

export default function ProductDetailsPage() {
  const { mallId, storeId, productId } = useParams()
  const { darkMode } = useTheme()
  const { malls, stores, products } = useRealtimeData()

  const mall = useMemo(() => malls.find((m) => m.id === mallId) || null, [malls, mallId])
  const store = useMemo(
    () => stores.find((s) => s.id === storeId && s.mall_id === mallId) || null,
    [stores, storeId, mallId]
  )
  const product = useMemo(
    () => products.find((p) => p.id === productId && p.store_id === storeId) || null,
    [products, productId, storeId]
  )

  const [activeImage, setActiveImage] = useState(0)

  const related = useMemo(() => {
    if (!product) return []
    return products
      .filter((p) => p.id !== product.id && p.store_id === storeId)
      .slice(0, 6)
  }, [product, products, storeId])

  if (!mall || !store || !product) {
    return (
      <div className="section-padding text-center">
        <h1 className="heading-large mb-4">Product Not Found</h1>
        <Link to="/" className="button-primary inline-block">
          Back to Home
        </Link>
      </div>
    )
  }

  const gallery = product.gallery?.length ? product.gallery : ['https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800']

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
          <Link to={`/mall/${mallId}/store/${storeId}`} className="hover:text-gold transition-colors duration-300">
            {store.name}
          </Link>
          <span>/</span>
          <span className="text-navy font-semibold">{product.name}</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 lg:px-8 pb-16">
        <div className={`rounded-2xl overflow-hidden ${darkMode ? 'bg-gray-800 glass-card-dark' : 'bg-white glass-card'} card-shadow`}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Gallery */}
            <div className={`${darkMode ? 'bg-gray-900/40' : 'bg-gray-50'} p-6`}
            >
              <div className="rounded-xl overflow-hidden h-72 sm:h-96">
                <img src={gallery[activeImage]} alt={product.name} className="w-full h-full object-cover" loading="lazy" />
              </div>

              {gallery.length > 1 && (
                <div className="mt-4 grid grid-cols-5 gap-3">
                  {gallery.slice(0, 5).map((src, idx) => (
                    <button
                      key={src + idx}
                      type="button"
                      onClick={() => setActiveImage(idx)}
                      className={`rounded-lg overflow-hidden border transition-all ${
                        idx === activeImage
                          ? 'border-gold shadow-[0_0_0_2px_rgba(212,175,55,0.25)]'
                          : darkMode
                            ? 'border-gray-700 hover:border-gray-500'
                            : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <img src={src} alt={`${product.name} ${idx + 1}`} className="w-full h-14 object-cover" loading="lazy" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div className="p-6 sm:p-10">
              <div className="flex items-start justify-between gap-6">
                <div>
                  <p className="text-sm text-gold font-semibold flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    {product.category}
                  </p>
                  <h1 className={`font-display text-3xl sm:text-4xl font-bold mt-2 ${darkMode ? 'text-cream' : 'text-navy'}`}>
                    {product.name}
                  </h1>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Package className="w-4 h-4" />
                  <span className="capitalize">{product.stock || 'available'}</span>
                </div>
              </div>

              {formatPrice(product.price) && (
                <div className="mt-6">
                  <p className="text-3xl font-bold text-gold">{formatPrice(product.price)}</p>
                </div>
              )}

              <div className="mt-6 space-y-4">
                <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>{product.description}</p>

                {product.specifications ? (
                  <div className={`rounded-xl p-5 border ${darkMode ? 'border-gray-700 bg-gray-900/30' : 'border-gray-200 bg-cream/60'}`}>
                    <h3 className={`font-display text-xl font-bold mb-2 ${darkMode ? 'text-cream' : 'text-navy'}`}>
                      Specifications
                    </h3>
                    <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} whitespace-pre-line`}>{product.specifications}</p>
                  </div>
                ) : null}

                <div className={`rounded-xl p-5 border ${darkMode ? 'border-gray-700 bg-gray-900/30' : 'border-gray-200 bg-cream/60'}`}>
                  <h3 className={`font-display text-xl font-bold mb-2 ${darkMode ? 'text-cream' : 'text-navy'}`}>
                    Location
                  </h3>
                  <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} flex items-center gap-2`}>
                    <MapPin className="w-4 h-4 text-gold" />
                    {mall.name} • {store.name}
                  </p>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  <Button3D variant="primary" fullWidth>
                    Add to Favorites
                  </Button3D>
                  <Link to={`/mall/${mallId}/store/${storeId}`} className="w-full">
                    <Button3D variant="outline" fullWidth>
                      Back to Store
                    </Button3D>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-10">
            <h2 className="heading-small mb-6">More from {store.name}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((p) => (
                <Link
                  key={p.id}
                  to={`/mall/${mallId}/store/${storeId}/product/${p.id}`}
                  className={`rounded-xl overflow-hidden ${darkMode ? 'bg-gray-800 glass-card-dark' : 'bg-white glass-card'} card-shadow`}
                >
                  <div className="h-40 bg-gray-100 dark:bg-gray-700">
                    <img
                      src={p.gallery?.[0] || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400'}
                      alt={p.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-5">
                    <p className="text-xs text-gold font-semibold">{p.category}</p>
                    <p className={`font-display text-lg font-bold mt-1 ${darkMode ? 'text-cream' : 'text-navy'}`}>{p.name}</p>
                    {formatPrice(p.price) ? (
                      <p className="text-gold font-bold mt-2">{formatPrice(p.price)}</p>
                    ) : null}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
