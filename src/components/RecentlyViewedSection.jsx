import { Link } from 'react-router-dom'
import { useTheme } from '../contexts/ThemeContext'
import { useEcosystem } from '../contexts/EcosystemContext'

export default function RecentlyViewedSection() {
  const { darkMode } = useTheme()
  const { recentlyViewed, getStoreById, getProductById } = useEcosystem()

  const stores = (recentlyViewed.stores || []).map((x) => getStoreById(x.id)).filter(Boolean)
  const products = (recentlyViewed.products || []).map((x) => getProductById(x.id)).filter(Boolean)

  if (stores.length === 0 && products.length === 0) return null

  return (
    <section className="relative z-10 py-12">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex items-end justify-between gap-4 mb-6">
          <div>
            <h2 className={`text-2xl md:text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Recently viewed
            </h2>
            <p className={`${darkMode ? 'text-white/70' : 'text-gray-600'} text-sm mt-1`}>
              Jump back in where you left off.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {stores.length > 0 ? (
            <div className={`p-5 rounded-3xl border ${darkMode ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-white'}`}>
              <p className="font-semibold mb-3">Stores</p>
              <div className="grid gap-3">
                {stores.slice(0, 4).map((s) => (
                  <Link
                    key={s.id}
                    to={`/mall/${s.mallId}/store/${s.id}`}
                    className={`p-4 rounded-2xl border transition-colors ${
                      darkMode ? 'border-white/10 bg-white/5 hover:bg-white/10' : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl overflow-hidden bg-white/10 border border-white/10 flex-shrink-0">
                        <img src={s.logo || s.image} alt="" className="w-full h-full object-cover" loading="lazy" />
                      </div>
                      <div className="min-w-0">
                        <p className={`font-semibold truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>{s.name}</p>
                        <p className={`${darkMode ? 'text-white/60' : 'text-gray-600'} text-xs truncate`}>{s.category}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ) : null}

          {products.length > 0 ? (
            <div className={`p-5 rounded-3xl border ${darkMode ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-white'}`}>
              <p className="font-semibold mb-3">Products</p>
              <div className="grid gap-3">
                {products.slice(0, 4).map((p) => (
                  <Link
                    key={p.id}
                    to={`/product/${p.id}`}
                    className={`p-4 rounded-2xl border transition-colors ${
                      darkMode ? 'border-white/10 bg-white/5 hover:bg-white/10' : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl overflow-hidden bg-white/10 border border-white/10 flex-shrink-0">
                        <img src={p.image} alt="" className="w-full h-full object-cover" loading="lazy" />
                      </div>
                      <div className="min-w-0">
                        <p className={`font-semibold truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>{p.name}</p>
                        <p className={`${darkMode ? 'text-white/60' : 'text-gray-600'} text-xs truncate`}>${Number(p.price).toFixed(2)}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}
