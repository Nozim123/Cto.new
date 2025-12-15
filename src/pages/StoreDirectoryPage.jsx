import { useParams, Link } from 'react-router-dom'
import { useMemo, useState } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import { usePublicData } from '../contexts/PublicDataContext'
import StoreCard from '../components/StoreCard'

export default function StoreDirectoryPage() {
  const { mallId } = useParams()
  const { malls, stores, loading } = usePublicData()
  const { t } = useLanguage()

  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedFloor, setSelectedFloor] = useState('all')
  const [sortBy, setSortBy] = useState('name')

  const mall = useMemo(() => malls.find((m) => m.id === mallId), [malls, mallId])

  const mallStores = useMemo(() => stores.filter((s) => s.mallId === mallId), [stores, mallId])

  const filteredStores = useMemo(() => {
    let filtered = [...mallStores]

    if (selectedCategory !== 'all') {
      filtered = filtered.filter((s) => s.category === selectedCategory)
    }

    if (selectedFloor !== 'all') {
      filtered = filtered.filter((s) => String(s.floor) === String(selectedFloor))
    }

    if (sortBy === 'name') {
      filtered.sort((a, b) => a.name.localeCompare(b.name))
    } else if (sortBy === 'floor') {
      filtered.sort((a, b) => Number(a.floor) - Number(b.floor))
    }

    return filtered
  }, [mallStores, selectedCategory, selectedFloor, sortBy])

  const categories = useMemo(
    () => ['all', ...new Set(mallStores.map((s) => s.category).filter(Boolean))],
    [mallStores]
  )

  const floors = useMemo(() => {
    const values = [...new Set(mallStores.map((s) => Number(s.floor)).filter((x) => Number.isFinite(x) && x > 0))]
    values.sort((a, b) => a - b)
    return ['all', ...values]
  }, [mallStores])

  if (loading && !mall) {
    return (
      <div className="section-padding text-center">
        <h1 className="heading-large mb-4">{t('common.loading')}</h1>
      </div>
    )
  }

  if (!mall) {
    return (
      <div className="section-padding text-center">
        <h1 className="heading-large mb-4">{t('mallPage.notFoundTitle')}</h1>
        <Link to="/" className="button-primary inline-block">
          {t('mallPage.backToHome')}
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 lg:px-8 pt-6">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-6 flex-wrap">
          <Link to="/" className="hover:text-gold transition-colors duration-300">
            {t('nav.home')}
          </Link>
          <span>/</span>
          <Link to={`/mall/${mallId}`} className="hover:text-gold transition-colors duration-300">
            {mall.name}
          </Link>
          <span>/</span>
          <span className="text-navy font-semibold">{t('directoryPage.directory')}</span>
        </div>
      </div>

      <div className="section-padding max-w-6xl mx-auto">
        <h1 className="heading-large mb-2">{mall.name}</h1>
        <p className="text-gray-600 text-lg">{t('directoryPage.available', { count: filteredStores.length })}</p>
      </div>

      <section className="bg-navy text-cream py-8">
        <div className="max-w-6xl mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <div>
              <label htmlFor="category" className="block text-sm font-semibold text-gold mb-2">
                {t('directoryPage.category')}
              </label>
              <select
                id="category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 rounded-lg text-navy focus:outline-none focus:ring-2 focus:ring-gold"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === 'all' ? t('map.allCategories') : cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="floor" className="block text-sm font-semibold text-gold mb-2">
                {t('directoryPage.floor')}
              </label>
              <select
                id="floor"
                value={selectedFloor}
                onChange={(e) => setSelectedFloor(e.target.value)}
                className="w-full px-4 py-2 rounded-lg text-navy focus:outline-none focus:ring-2 focus:ring-gold"
              >
                {floors.map((floor) => (
                  <option key={floor} value={floor}>
                    {floor === 'all' ? t('directoryPage.allFloors') : `${t('common.floor')} ${floor}`}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="sort" className="block text-sm font-semibold text-gold mb-2">
                {t('directoryPage.sortBy')}
              </label>
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 rounded-lg text-navy focus:outline-none focus:ring-2 focus:ring-gold"
              >
                <option value="name">{t('directoryPage.nameAz')}</option>
                <option value="floor">{t('directoryPage.floorLevel')}</option>
              </select>
            </div>
          </div>

          {(selectedCategory !== 'all' || selectedFloor !== 'all') && (
            <div className="mt-4">
              <button
                onClick={() => {
                  setSelectedCategory('all')
                  setSelectedFloor('all')
                }}
                className="text-cream hover:text-gold transition-colors duration-300 text-sm font-semibold underline"
              >
                {t('directoryPage.resetFilters')}
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="section-padding max-w-6xl mx-auto">
        {filteredStores.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredStores.map((store) => (
              <StoreCard key={store.id} store={store} mallId={mallId} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg mb-6">{t('directoryPage.noStores')}</p>
            <button
              onClick={() => {
                setSelectedCategory('all')
                setSelectedFloor('all')
              }}
              className="button-primary inline-block"
            >
              {t('common.reset')}
            </button>
          </div>
        )}
      </section>
    </div>
  )
}
