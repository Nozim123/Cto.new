import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useTheme } from '../contexts/ThemeContext'
import mallsData from '../data/malls.json'
import storesData from '../data/stores.json'
import StoreCard from '../components/StoreCard'
import { Layers, ArrowUpDown, Home, Building2 } from 'lucide-react'

export default function StoreDirectoryPage() {
  const { mallId } = useParams()
  const { darkMode } = useTheme()
  const [mall, setMall] = useState(null)
  const [stores, setStores] = useState([])
  const [filteredStores, setFilteredStores] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedFloor, setSelectedFloor] = useState('all')
  const [sortBy, setSortBy] = useState('name')

  useEffect(() => {
    const mallData = mallsData.find((m) => m.id === mallId)
    setMall(mallData)

    const mallStores = storesData.filter((s) => s.mallId === mallId)
    setStores(mallStores)
  }, [mallId])

  useEffect(() => {
    let filtered = [...stores]

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((s) => s.category === selectedCategory)
    }

    // Filter by floor
    if (selectedFloor !== 'all') {
      filtered = filtered.filter((s) => s.floor === parseInt(selectedFloor))
    }

    // Sort
    if (sortBy === 'name') {
      filtered.sort((a, b) => a.name.localeCompare(b.name))
    } else if (sortBy === 'floor') {
      filtered.sort((a, b) => a.floor - b.floor)
    }

    setFilteredStores(filtered)
  }, [stores, selectedCategory, selectedFloor, sortBy])

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

  const categories = ['all', ...new Set(stores.map((s) => s.category))]
  const floors = ['all', ...new Set(stores.map((s) => s.floor)).sort()]

  return (
    <div className="min-h-screen pb-24 md:pb-0">
      {/* Breadcrumb */}
      <div className="max-w-6xl mx-auto px-4 lg:px-8 pt-6">
        <div className={`flex items-center gap-2 text-sm mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          <Link to="/" className="hover:text-purple-500 transition-colors duration-300 flex items-center gap-1">
            <Home size={16} />
            Home
          </Link>
          <span>/</span>
          <Link to={`/mall/${mallId}`} className="hover:text-purple-500 transition-colors duration-300 flex items-center gap-1">
            <Building2 size={16} />
            {mall.name}
          </Link>
          <span>/</span>
          <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Directory</span>
        </div>
      </div>

      {/* Header */}
      <div className="section-padding max-w-6xl mx-auto">
        <h1 className="heading-large mb-2">{mall.name} Directory</h1>
        <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          {filteredStores.length} store{filteredStores.length !== 1 ? 's' : ''} available
        </p>
      </div>

      {/* Filters */}
      <section className={`py-8 ${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-100 border-gray-200'} border-y`}>
        <div className="max-w-6xl mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {/* Category Filter */}
            <div>
              <label htmlFor="category" className="block text-sm font-semibold text-purple-400 mb-2 flex items-center gap-2">
                <Layers size={16} />
                Category
              </label>
              <select
                id="category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
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
              <label htmlFor="floor" className="block text-sm font-semibold text-purple-400 mb-2 flex items-center gap-2">
                <Building2 size={16} />
                Floor Level
              </label>
              <select
                id="floor"
                value={selectedFloor}
                onChange={(e) => setSelectedFloor(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {floors.map((floor) => (
                  <option key={floor} value={floor}>
                    {floor === 'all' ? 'All Floors' : `Floor ${floor}`}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div>
              <label htmlFor="sort" className="block text-sm font-semibold text-purple-400 mb-2 flex items-center gap-2">
                <ArrowUpDown size={16} />
                Sort By
              </label>
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="name">Name (A-Z)</option>
                <option value="floor">Floor Level</option>
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
                className="text-purple-400 hover:text-purple-300 transition-colors duration-300 text-sm font-semibold underline"
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStores.map((store) => (
              <StoreCard key={store.id} store={store} mallId={mallId} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 rounded-3xl border border-white/10 bg-white/5">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-purple-500/20 flex items-center justify-center">
              <Layers size={40} className="text-purple-400" />
            </div>
            <h2 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              No stores found matching your filters.
            </h2>
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
