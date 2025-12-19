import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Store as StoreIcon } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import { useLanguage } from '../contexts/LanguageContext'
import mallsData from '../data/malls.json'
import storesData from '../data/stores.json'
import StoreCard from '../components/StoreCard'

export default function StoresPage() {
  const { darkMode } = useTheme()
  const { t } = useLanguage()

  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')

  const categories = useMemo(() => {
    return ['all', ...new Set(storesData.map((s) => s.category)).values()]
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()

    return storesData
      .filter((s) => (category === 'all' ? true : s.category === category))
      .filter((s) => {
        if (!q) return true
        const mall = mallsData.find((m) => m.id === s.mallId)
        return (
          s.name.toLowerCase().includes(q) ||
          s.category.toLowerCase().includes(q) ||
          (mall?.name || '').toLowerCase().includes(q)
        )
      })
  }, [query, category])

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-primary'} text-white`}>
      <div className="max-w-7xl mx-auto px-4 lg:px-8 pt-10 pb-20">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              {t('stores.title') || 'Stores'}
            </h1>
            <p className="text-white/70">
              {t('stores.featured') || 'Browse stores across all malls'}
            </p>
          </div>
          <Link
            to="/"
            className="text-sm text-purple-200 hover:text-purple-100 hover:underline"
          >
            {t('buttons.backToHome') || 'Back to Home'}
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <label className="text-xs font-semibold text-white/70">{t('search.search') || 'Search'}</label>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('stores.searchPlaceholder') || 'Search stores…'}
              className="mt-2 w-full bg-transparent border border-white/10 rounded-xl px-4 py-3 outline-none placeholder:text-white/50"
            />
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <label className="text-xs font-semibold text-white/70">{t('stores.categories') || 'Categories'}</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-2 w-full bg-transparent border border-white/10 rounded-xl px-4 py-3 outline-none"
            >
              {categories.map((c) => (
                <option key={c} value={c} className="text-gray-900">
                  {c === 'all' ? t('stores.allCategories') || 'All categories' : c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((store) => (
              <StoreCard key={store.id} store={store} mallId={store.mallId} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 rounded-3xl border border-white/10 bg-white/5">
            <StoreIcon size={56} className="mx-auto mb-4 text-white/50" />
            <h2 className="text-xl font-semibold mb-2">{t('stores.noStores') || 'No stores found'}</h2>
            <p className="text-white/70">{t('search.tryDifferent') || 'Try a different keyword.'}</p>
          </div>
        )}
      </div>
    </div>
  )
}
