import { useMemo, useState, useEffect } from 'react'
import { Search, Store, Filter, TrendingUp, Clock, Tag, ChevronDown } from 'lucide-react'
import storesData from '../data/stores.json'
import mallsData from '../data/malls.json'
import MTCStoreCard from '../components/MTCStoreCard'

export default function StoresPage() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [sortBy, setSortBy] = useState('popular')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(timer)
  }, [])

  const categories = useMemo(() => {
    return ['all', ...new Set(storesData.map((s) => s.category))]
  }, [])

  const filteredStores = useMemo(() => {
    let result = storesData.filter((s) => (category === 'all' ? true : s.category === category))
    
    if (query.trim()) {
      const q = query.toLowerCase()
      result = result.filter(s => 
        s.name.toLowerCase().includes(q) || 
        s.category.toLowerCase().includes(q)
      )
    }

    if (sortBy === 'new') {
      result = [...result].sort((a, b) => (b.isNew ? 1 : -1))
    } else if (sortBy === 'popular') {
      result = [...result].sort((a, b) => (b.rating || 0) - (a.rating || 0))
    } else if (sortBy === 'discount') {
      result = result.filter(s => s.hasPromo)
    }

    return result
  }, [query, category, sortBy])

  return (
    <div className="min-h-screen bg-mtc-bg text-white pb-24">
      {/* Header Section */}
      <div className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 via-transparent to-transparent" />
        <div className="mtc-container relative z-10">
          <h1 className="mtc-heading-xl mb-4 animate-mtc-slide-up">Shop Directory</h1>
          <p className="mtc-body-lg text-white/60 max-w-2xl animate-mtc-slide-up" style={{ animationDelay: '0.1s' }}>
            Discover hundreds of premium brands and local boutiques across all our malls. 
            From luxury fashion to the latest electronics.
          </p>
        </div>
      </div>

      {/* Filters & Search Bar */}
      <section className="mtc-container mb-12 animate-mtc-slide-up" style={{ animationDelay: '0.2s' }}>
        <div className="mtc-glass p-4 rounded-3xl flex flex-col lg:flex-row gap-4 items-center">
          {/* Search */}
          <div className="relative flex-grow w-full lg:w-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search stores, brands, categories..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 outline-none focus:border-blue-500 transition-all"
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 w-full lg:w-auto">
            {['all', 'Fashion', 'Electronics', 'Food', 'Entertainment'].map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  category === cat 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-white/5 text-white/60 hover:bg-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="h-8 w-px bg-white/10 hidden lg:block" />

          {/* Sort By */}
          <div className="flex gap-2 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0">
            <SortButton 
              active={sortBy === 'popular'} 
              onClick={() => setSortBy('popular')} 
              icon={<TrendingUp size={16} />} 
              label="Popular" 
            />
            <SortButton 
              active={sortBy === 'new'} 
              onClick={() => setSortBy('new')} 
              icon={<Clock size={16} />} 
              label="New" 
            />
            <SortButton 
              active={sortBy === 'discount'} 
              onClick={() => setSortBy('discount')} 
              icon={<Tag size={16} />} 
              label="Discounts" 
            />
          </div>
        </div>
      </section>

      {/* Results Grid */}
      <section className="mtc-container">
        {filteredStores.length > 0 ? (
          <div className="mtc-grid mtc-grid-3 lg:mtc-grid-4 gap-6">
            {filteredStores.map((store, index) => (
              <MTCStoreCard key={store.id} store={store} delay={index * 0.02} />
            ))}
          </div>
        ) : (
          <div className="text-center py-32 mtc-glass rounded-[3rem]">
            <Store size={64} className="mx-auto mb-6 text-white/10" />
            <h2 className="mtc-heading-md mb-2">No Stores Found</h2>
            <p className="mtc-body text-white/50">Try adjusting your filters or search terms.</p>
            <button 
              onClick={() => {setQuery(''); setCategory('all'); setSortBy('popular');}}
              className="mtc-button-primary mt-8"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </section>
    </div>
  )
}

function SortButton({ active, onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
        active 
          ? 'bg-white/20 text-white' 
          : 'bg-white/5 text-white/40 hover:bg-white/10'
      }`}
    >
      {icon}
      {label}
    </button>
  )
}
