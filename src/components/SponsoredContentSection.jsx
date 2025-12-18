import { Link } from 'react-router-dom'
import { useTheme } from '../contexts/ThemeContext'
import { useEcosystem } from '../contexts/EcosystemContext'
import ads from '../data/ads.json'

export default function SponsoredContentSection() {
  const { darkMode } = useTheme()
  const { getStoreById, getProductById } = useEcosystem()

  const sponsoredStores = (ads.sponsoredStores || []).map((a) => ({
    ad: a,
    store: getStoreById(a.storeId)
  }))

  const featuredProducts = (ads.featuredProducts || []).map((a) => ({
    ad: a,
    product: getProductById(a.productId)
  }))

  return (
    <section className="relative z-10 py-12">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex items-end justify-between gap-4 mb-6">
          <div>
            <h2 className={`text-2xl md:text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Sponsored & Featured
            </h2>
            <p className={`${darkMode ? 'text-white/70' : 'text-gray-600'} text-sm mt-1`}>
              Native placements that feel like content.
            </p>
          </div>
          <Link
            to="/promotions"
            className={`${darkMode ? 'text-purple-300' : 'text-purple-700'} text-sm font-semibold hover:underline`}
          >
            View all
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className={`p-5 rounded-3xl border ${darkMode ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-white'}`}>
            <div className="flex items-center justify-between mb-3">
              <p className="font-semibold">Sponsored stores</p>
              <span className="text-[10px] px-2 py-1 rounded-full bg-yellow-500/10 text-yellow-800 border border-yellow-500/20 dark:bg-yellow-500/20 dark:text-yellow-200 dark:border-yellow-500/30">
                Sponsored
              </span>
            </div>
            <div className="grid gap-3">
              {sponsoredStores.map(({ ad, store }) => (
                <Link
                  key={ad.id}
                  to={store ? `/mall/${store.mallId}/store/${store.id}` : '/stores'}
                  className={`group p-4 rounded-2xl border transition-all ${
                    darkMode ? 'border-white/10 bg-white/5 hover:bg-white/10' : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl overflow-hidden bg-white/10 border border-white/10 flex-shrink-0">
                      {store?.logo || store?.image ? (
                        <img src={store.logo || store.image} alt="" className="w-full h-full object-cover" loading="lazy" />
                      ) : null}
                    </div>
                    <div className="min-w-0">
                      <p className={`font-semibold truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>{store?.name || ad.storeId}</p>
                      <p className={`${darkMode ? 'text-white/70' : 'text-gray-600'} text-xs truncate`}>{ad.copy}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className={`p-5 rounded-3xl border lg:col-span-2 ${darkMode ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-white'}`}>
            <div className="flex items-center justify-between mb-3">
              <p className="font-semibold">Featured products</p>
              <span className="text-[10px] px-2 py-1 rounded-full bg-purple-500/10 text-purple-700 border border-purple-500/20 dark:bg-purple-500/20 dark:text-purple-200 dark:border-purple-500/30">
                Featured
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {featuredProducts.map(({ ad, product }) => (
                <Link
                  key={ad.id}
                  to={product ? `/product/${product.id}` : '/stores'}
                  className={`group p-4 rounded-2xl border transition-all ${
                    darkMode ? 'border-white/10 bg-white/5 hover:bg-white/10' : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden bg-white/10 border border-white/10 flex-shrink-0">
                      {product?.image ? (
                        <img src={product.image} alt="" className="w-full h-full object-cover" loading="lazy" />
                      ) : null}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 border border-gray-200 dark:bg-white/10 dark:border-white/10">
                          {ad.headline}
                        </span>
                        <span className={`${darkMode ? 'text-white/60' : 'text-gray-600'} text-xs`}>{ad.copy}</span>
                      </div>
                      <p className={`font-semibold truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>{product?.name || ad.productId}</p>
                      <p className={`${darkMode ? 'text-white/70' : 'text-gray-600'} text-sm font-semibold mt-1`}>
                        ${product ? Number(product.price).toFixed(2) : '—'}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
