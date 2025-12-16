import { Link, useParams } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'

import { useRealtimeData } from '../contexts/RealtimeDataContext'
import StoreCard from '../components/StoreCard'

export default function StoreDirectoryPage() {
  const { mallId } = useParams()
  const { malls, stores } = useRealtimeData()

  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedFloor, setSelectedFloor] = useState('all')
  const [sortBy, setSortBy] = useState('name')

  const mall = useMemo(() => malls.find((m) => m.id === mallId) || null, [malls, mallId])
  const mallStores = useMemo(() => stores.filter((s) => s.mall_id === mallId), [stores, mallId])

  const categories = useMemo(() => ['all', ...new Set(mallStores.map((s) => s.category).filter(Boolean))], [mallStores])
  const floors = useMemo(() => {
    const f = mallStores.map((s) => s.floor).filter((x) => x !== null && x !== undefined)
    return ['all', ...new Set(f)].sort((a, b) => {
      if (a === 'all') return -1
      if (b === 'all') return 1
      return Number(a) - Number(b)
    })
  }, [mallStores])

  const filteredStores = useMemo(() => {
    let filtered = [...mallStores]

    if (selectedCategory !== 'all') {
      filtered = filtered.filter((s) => s.category === selectedCategory)
    }

    if (selectedFloor !== 'all') {
      filtered = filtered.filter((s) => String(s.floor) === String(selectedFloor))
    }

    if (sortBy === 'name') {
      filtered.sort((a, b) => String(a.name).localeCompare(String(b.name)))
    } else if (sortBy === 'floor') {
      filtered.sort((a, b) => Number(a.floor ?? 0) - Number(b.floor ?? 0))
    }

    return filtered
  }, [mallStores, selectedCategory, selectedFloor, sortBy])

  useEffect(() => {
    setSelectedCategory('all')
    setSelectedFloor('all')
  }, [mallId])

  if (!mall) {
    return (
      <div className="section-padding text-center">
        <h1 className="heading-large mb-4">Mall Not Found</h1>
        <Link to="/" className="button-primary inline-block">
          Back to Home
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <div className="max-w-6xl mx-auto px-4 lg:px-8 pt-6">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <Link to="/" className="hover:text-gold transition-colors duration-300">
            Home
          </Link>
          <span>/</span>
          <Link to={`/mall/${mallId}`} className="hover:text-gold transition-colors duration-300">
            {mall.name}
          </Link>
          <span>/</span>
          <span className="text-navy font-semibold">Stores</span>
        </div>
      </div>

      {/* Header */}
      <div className="section-padding max-w-6xl mx-auto">
        <h1 className="heading-large mb-2">{mall.name} Stores</h1>
        <p className="text-gray-600 text-lg">{filteredStores.length} store{filteredStores.length !== 1 ? 's' : ''} available</p>
      </div>

      {/* Filters */}
      <section className="bg-navy text-cream py-8">
        <div className="max-w-6xl mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {/* Category Filter */}
            <div>
              <label htmlFor="category" className="block text-sm font-semibold text-gold mb-2">
                Category
              </label>
              <select
                id="category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 rounded-lg text-navy focus:outline-none focus:ring-2 focus:ring-gold"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === 'all' ? 'All Categories' : cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Floor Filter */}
            <div>
              <label htmlFor="floor" className="block text-sm font-semibold text-gold mb-2">
                Floor
              </label>
              <select
                id="floor"
                value={selectedFloor}
                onChange={(e) => setSelectedFloor(e.target.value)}
                className="w-full px-4 py-2 rounded-lg text-navy focus:outline-none focus:ring-2 focus:ring-gold"
              >
                {floors.map((floor) => (
                  <option key={String(floor)} value={String(floor)}>
                    {floor === 'all' ? 'All Floors' : `Floor ${floor}`}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div>
              <label htmlFor="sort" className="block text-sm font-semibold text-gold mb-2">
                Sort By
              </label>
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 rounded-lg text-navy focus:outline-none focus:ring-2 focus:ring-gold"
              >
                <option value="name">Name (A-Z)</option>
                <option value="floor">Floor</option>
              </select>
            </div>
          </div>

          {/* Reset Filters */}
          {(selectedCategory !== 'all' || selectedFloor !== 'all') && (
            <div className="mt-4">
              <button
                onClick={() => {
                  setSelectedCategory('all')
                  setSelectedFloor('all')
                }}
                className="text-cream hover:text-gold transition-colors duration-300 text-sm font-semibold underline"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Stores Grid */}
      <section className="section-padding max-w-6xl mx-auto">
        {filteredStores.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredStores.map((store) => (
              <StoreCard key={store.id} store={store} mallId={mallId} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg mb-6">No stores found matching your filters.</p>
            <button
              onClick={() => {
                setSelectedCategory('all')
                setSelectedFloor('all')
              }}
              className="button-primary inline-block"
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>
    </div>
  )
}
