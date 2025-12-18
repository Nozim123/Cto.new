import { Link } from 'react-router-dom'
import { useMemo } from 'react'
import { useTheme } from '../contexts/ThemeContext'
import { getTopCategories, getTopBehaviorIds } from '../services/behavior'
import storesData from '../data/stores.json'

const hours = Array.from({ length: 12 }).map((_, i) => ({
  label: `${i + 10}:00`,
  value: Math.max(5, Math.round(25 + 20 * Math.sin((i / 12) * Math.PI)))
}))

export default function InsightsPage() {
  const { darkMode } = useTheme()

  const popularStores = useMemo(() => {
    const ids = getTopBehaviorIds('store', 5)
    return ids.map((id) => storesData.find((s) => s.id === id)).filter(Boolean)
  }, [])

  const topCategories = useMemo(() => getTopCategories(5), [])

  return (
    <div className={`min-h-screen pt-24 pb-24 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-6xl mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between gap-3 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Traffic & Peak Time Insights</h1>
            <p className={`${darkMode ? 'text-white/70' : 'text-gray-600'} mt-1`}>
              Live-like indicators powered by browsing trends.
            </p>
          </div>
          <Link
            to="/"
            className={`px-4 py-2 rounded-xl text-sm font-semibold border ${
              darkMode ? 'border-white/10 bg-white/5 hover:bg-white/10' : 'border-gray-200 bg-white hover:bg-gray-50'
            }`}
          >
            Back
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className={`p-6 rounded-3xl border lg:col-span-2 ${darkMode ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-white'}`}>
            <h2 className="text-lg font-semibold mb-4">Busy hours (sample)</h2>
            <div className="grid grid-cols-12 gap-2 items-end h-40">
              {hours.map((h) => (
                <div key={h.label} className="flex flex-col items-center gap-2">
                  <div
                    className="w-full rounded-lg bg-gradient-to-t from-purple-600 to-purple-400"
                    style={{ height: `${h.value * 4}px` }}
                    title={`${h.label} • ${h.value}%`}
                  />
                  <span className={`${darkMode ? 'text-white/60' : 'text-gray-500'} text-[10px]`}>{h.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={`p-6 rounded-3xl border ${darkMode ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-white'}`}>
            <h2 className="text-lg font-semibold mb-4">Top categories</h2>
            {topCategories.length === 0 ? (
              <p className={`${darkMode ? 'text-white/70' : 'text-gray-600'} text-sm`}>No data yet. Browse stores and products to generate trends.</p>
            ) : (
              <ul className="space-y-2">
                {topCategories.map((c) => (
                  <li key={c} className="flex items-center justify-between">
                    <span className="text-sm font-semibold">{c}</span>
                    <span className={`${darkMode ? 'text-white/60' : 'text-gray-600'} text-xs`}>Trending</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className={`mt-4 p-6 rounded-3xl border ${darkMode ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-white'}`}>
          <h2 className="text-lg font-semibold mb-4">Popular stores today</h2>
          {popularStores.length === 0 ? (
            <p className={`${darkMode ? 'text-white/70' : 'text-gray-600'} text-sm`}>No data yet. Visit a few stores to populate this list.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {popularStores.map((s) => (
                <Link
                  key={s.id}
                  to={`/mall/${s.mallId}/store/${s.id}`}
                  className={`p-4 rounded-2xl border transition-colors ${
                    darkMode ? 'border-white/10 bg-white/5 hover:bg-white/10' : 'border-gray-200 bg-white hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl overflow-hidden bg-white/10 border border-white/10 flex-shrink-0">
                      <img src={s.logo || s.image} alt="" className="w-full h-full object-cover" loading="lazy" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold truncate">{s.name}</p>
                      <p className={`${darkMode ? 'text-white/60' : 'text-gray-600'} text-xs truncate`}>{s.category}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
