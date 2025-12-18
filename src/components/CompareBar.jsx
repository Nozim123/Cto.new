import { Link, useLocation } from 'react-router-dom'
import { useTheme } from '../contexts/ThemeContext'
import { useEcosystem } from '../contexts/EcosystemContext'

export default function CompareBar() {
  const { darkMode } = useTheme()
  const { compareProductIds, clearCompare } = useEcosystem()
  const location = useLocation()

  if (!compareProductIds || compareProductIds.length === 0) return null
  if (location.pathname === '/compare') return null

  return (
    <div className="fixed bottom-20 md:bottom-6 left-0 right-0 z-[60] px-4">
      <div
        className={`max-w-3xl mx-auto flex items-center justify-between gap-3 rounded-2xl border px-4 py-3 shadow-2xl backdrop-blur-xl ${
          darkMode
            ? 'bg-gray-900/80 border-white/10 text-white'
            : 'bg-white/80 border-gray-200 text-gray-900'
        }`}
      >
        <div className="min-w-0">
          <p className="text-sm font-semibold truncate">Compare products</p>
          <p className={`${darkMode ? 'text-white/70' : 'text-gray-600'} text-xs`}>
            {compareProductIds.length} selected (max 4)
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={clearCompare}
            className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-colors ${
              darkMode
                ? 'border-white/10 bg-white/5 hover:bg-white/10'
                : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
            }`}
          >
            Clear
          </button>
          <Link
            to="/compare"
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-purple-500 to-purple-700 text-white shadow-lg"
          >
            Compare
          </Link>
        </div>
      </div>
    </div>
  )
}
