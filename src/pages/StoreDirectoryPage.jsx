import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Filter, Search } from 'lucide-react'

import mallsData from '../data/malls.json'
import storesData from '../data/stores.json'

import StoreCard from '../components/StoreCard'
import GlassCard from '../components/ui/GlassCard'
import SectionHeader from '../components/ui/SectionHeader'

export default function StoreDirectoryPage() {
  const { mallId } = useParams()

  const mall = useMemo(() => mallsData.find((m) => m.id === mallId) || null, [mallId])
  const stores = useMemo(() => storesData.filter((s) => s.mallId === mallId), [mallId])

  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedFloor, setSelectedFloor] = useState('all')
  const [sortBy, setSortBy] = useState('name')

  const filteredStores = useMemo(() => {
    let filtered = [...stores]

    const q = search.trim().toLowerCase()
    if (q) {
      filtered = filtered.filter(
        (s) => s.name.toLowerCase().includes(q) || s.category.toLowerCase().includes(q) || String(s.floor).includes(q)
      )
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter((s) => s.category === selectedCategory)
    }

    if (selectedFloor !== 'all') {
      filtered = filtered.filter((s) => s.floor === Number(selectedFloor))
    }

    if (sortBy === 'name') {
      filtered.sort((a, b) => a.name.localeCompare(b.name))
    } else if (sortBy === 'floor') {
      filtered.sort((a, b) => a.floor - b.floor)
    }

    return filtered
  }, [search, selectedCategory, selectedFloor, sortBy, stores])

  if (!mall) {
    return (
      <div className="section-padding max-w-6xl mx-auto">
        <h1 className="heading-large">Mall not found</h1>
        <Link to="/" className="button-primary inline-block mt-6">
          Back to home
        </Link>
      </div>
    )
  }

  const categories = ['all', ...new Set(stores.map((s) => s.category))]
  const floors = ['all', ...new Set(stores.map((s) => s.floor)).values()].sort((a, b) => {
    if (a === 'all') return -1
    if (b === 'all') return 1
    return Number(a) - Number(b)
  })

  return (
    <div className="min-h-screen">
      <div className="section-padding max-w-6xl mx-auto">
        <div className="flex items-center gap-2 text-sm text-white/50 mb-6 flex-wrap">
          <Link to="/" className="hover:text-white transition">
            Home
          </Link>
          <span>/</span>
          <Link to={`/mall/${mallId}`} className="hover:text-white transition">
            {mall.name}
          </Link>
          <span>/</span>
          <span className="text-white font-semibold">Directory</span>
        </div>

        <SectionHeader
          eyebrow="Directory"
          title={`${mall.name} stores`}
          description={`${filteredStores.length} store${filteredStores.length !== 1 ? 's' : ''} available`}
        />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <GlassCard className="p-6 lg:col-span-1">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-white/60" />
              <p className="font-semibold text-white">Filters</p>
            </div>

            <div className="mt-4">
              <label className="block text-sm text-white/70 mb-2" htmlFor="search">
                Search
              </label>
              <div className="flex items-center gap-2 rounded-2xl bg-white/5 border border-white/10 px-4 py-3">
                <Search className="w-4 h-4 text-white/60" />
                <input
                  id="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Name, category, floor…"
                  className="w-full bg-transparent text-white placeholder:text-white/40 focus:outline-none"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm text-white/70 mb-2" htmlFor="category">
                Category
              </label>
              <select
                id="category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-neonCyan/50"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat} className="bg-midnight">
                    {cat === 'all' ? 'All categories' : cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-4">
              <label className="block text-sm text-white/70 mb-2" htmlFor="floor">
                Floor
              </label>
              <select
                id="floor"
                value={selectedFloor}
                onChange={(e) => setSelectedFloor(e.target.value)}
                className="w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-neonCyan/50"
              >
                {floors.map((floor) => (
                  <option key={floor} value={floor} className="bg-midnight">
                    {floor === 'all' ? 'All floors' : `Floor ${floor}`}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-4">
              <label className="block text-sm text-white/70 mb-2" htmlFor="sort">
                Sort
              </label>
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-neonCyan/50"
              >
                <option value="name" className="bg-midnight">
                  Name (A–Z)
                </option>
                <option value="floor" className="bg-midnight">
                  Floor
                </option>
              </select>
            </div>

            <button
              type="button"
              onClick={() => {
                setSearch('')
                setSelectedCategory('all')
                setSelectedFloor('all')
                setSortBy('name')
              }}
              className="button-secondary w-full mt-6"
            >
              Reset
            </button>
          </GlassCard>

          <div className="lg:col-span-3">
            {filteredStores.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredStores.map((store) => (
                  <StoreCard key={store.id} store={store} mallId={mallId} />
                ))}
              </div>
            ) : (
              <div className="glass rounded-3xl p-10 text-center">
                <p className="text-white/70">No stores found matching your filters.</p>
                <button
                  type="button"
                  className="button-primary mt-6"
                  onClick={() => {
                    setSearch('')
                    setSelectedCategory('all')
                    setSelectedFloor('all')
                    setSortBy('name')
                  }}
                >
                  Reset filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
