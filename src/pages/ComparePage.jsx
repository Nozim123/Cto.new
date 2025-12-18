import { Link } from 'react-router-dom'
import { useMemo } from 'react'
import { useTheme } from '../contexts/ThemeContext'
import { useEcosystem } from '../contexts/EcosystemContext'

export default function ComparePage() {
  const { darkMode } = useTheme()
  const { compareProductIds, clearCompare, toggleCompare, getProductById, getStoreById, getMallById } = useEcosystem()

  const products = useMemo(() => {
    return (compareProductIds || []).map((id) => getProductById(id)).filter(Boolean)
  }, [compareProductIds, getProductById])

  const allSpecKeys = useMemo(() => {
    const keys = new Set()
    products.forEach((p) => {
      const specs = p?.specifications || {}
      Object.keys(specs).forEach((k) => keys.add(k))
    })
    return Array.from(keys)
  }, [products])

  return (
    <div className={`min-h-screen pt-24 pb-24 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Compare</h1>
            <p className={`${darkMode ? 'text-white/70' : 'text-gray-600'} mt-1`}>
              Side-by-side specs, price, and store comparison.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className={`px-4 py-2 rounded-xl text-sm font-semibold border ${
                darkMode ? 'border-white/10 bg-white/5 hover:bg-white/10' : 'border-gray-200 bg-white hover:bg-gray-50'
              }`}
            >
              Back
            </Link>
            <button
              type="button"
              onClick={clearCompare}
              className="px-4 py-2 rounded-xl text-sm font-semibold bg-red-500/90 hover:bg-red-500 text-white"
            >
              Clear
            </button>
          </div>
        </div>

        {products.length === 0 ? (
          <div className={`p-10 rounded-3xl border ${darkMode ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-white'}`}>
            <p className={`${darkMode ? 'text-white/70' : 'text-gray-600'}`}>
              Select up to 4 products to compare.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className={`min-w-[900px] w-full border-separate border-spacing-0 rounded-3xl overflow-hidden ${
              darkMode ? 'bg-white/5 border border-white/10' : 'bg-white border border-gray-200'
            }`}>
              <thead>
                <tr>
                  <th className={`text-left p-4 w-52 ${darkMode ? 'text-white/70' : 'text-gray-600'}`}>Field</th>
                  {products.map((p) => (
                    <th key={p.id} className="p-4 align-top">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="font-semibold line-clamp-2">{p.name}</p>
                          <p className={`${darkMode ? 'text-white/60' : 'text-gray-600'} text-xs mt-1`}>{p.category}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => toggleCompare(p.id)}
                          className={`px-3 py-2 rounded-xl text-xs font-semibold border ${
                            darkMode ? 'border-white/10 bg-white/5 hover:bg-white/10' : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                          }`}
                        >
                          Remove
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className={`p-4 font-semibold ${darkMode ? 'text-white/70' : 'text-gray-600'}`}>Price</td>
                  {products.map((p) => (
                    <td key={p.id} className="p-4">
                      <span className="font-bold">${Number(p.price).toFixed(2)}</span>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className={`p-4 font-semibold ${darkMode ? 'text-white/70' : 'text-gray-600'}`}>Availability</td>
                  {products.map((p) => (
                    <td key={p.id} className="p-4">
                      <span
                        className={`text-sm font-semibold ${
                          p.availability === 'Out of Stock' ? 'text-red-400' : 'text-green-400'
                        }`}
                      >
                        {p.availability || 'In Stock'}
                      </span>
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className={`p-4 font-semibold ${darkMode ? 'text-white/70' : 'text-gray-600'}`}>Store</td>
                  {products.map((p) => {
                    const store = getStoreById(p.storeId)
                    const mall = store ? getMallById(store.mallId) : null
                    return (
                      <td key={p.id} className="p-4">
                        {store ? (
                          <div>
                            <Link
                              to={`/mall/${store.mallId}/store/${store.id}`}
                              className="font-semibold text-purple-400 hover:underline"
                            >
                              {store.name}
                            </Link>
                            <p className={`${darkMode ? 'text-white/60' : 'text-gray-600'} text-xs mt-1`}>
                              {mall?.name || ''}
                            </p>
                          </div>
                        ) : (
                          <span className={`${darkMode ? 'text-white/60' : 'text-gray-500'} text-sm`}>—</span>
                        )}
                      </td>
                    )
                  })}
                </tr>

                {allSpecKeys.map((key) => (
                  <tr key={key}>
                    <td className={`p-4 font-semibold ${darkMode ? 'text-white/70' : 'text-gray-600'}`}>{key}</td>
                    {products.map((p) => (
                      <td key={p.id} className="p-4">
                        <span className="text-sm">{p?.specifications?.[key] || '—'}</span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
