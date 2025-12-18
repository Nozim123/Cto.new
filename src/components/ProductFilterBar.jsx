import { useState } from 'react'
import { useTheme } from '../contexts/ThemeContext'
import { useLanguage } from '../contexts/LanguageContext'

export default function ProductFilterBar({ 
  categories = [], 
  selectedCategory, 
  onCategoryChange,
  sortOption,
  onSortChange,
  searchQuery,
  onSearchChange,
  priceRange,
  onPriceRangeChange,
  totalProducts
}) {
  const { darkMode } = useTheme()
  const { t } = useLanguage()
  const [showFilters, setShowFilters] = useState(false)

  const sortOptions = [
    { value: 'featured', label: t('sort.featured') || 'Featured' },
    { value: 'new', label: t('sort.new') || 'Newest' },
    { value: 'price-low', label: t('sort.priceLow') || 'Price: Low to High' },
    { value: 'price-high', label: t('sort.priceHigh') || 'Price: High to Low' },
    { value: 'popular', label: t('sort.popular') || 'Popular' },
  ]

  return (
    <div className={`sticky top-32 md:top-36 z-20 transition-all duration-300 ${
      darkMode 
        ? 'bg-gray-900/95 backdrop-blur-xl border-b border-gray-700' 
        : 'bg-white/95 backdrop-blur-xl border-b border-gray-200'
    }`}>
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4">
        {/* Top Row: Search & Sort */}
        <div className="flex items-center gap-3 mb-3">
          {/* Search */}
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder={t('common.searchInStore') || 'Search in store...'}
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className={`w-full px-4 py-2 pl-10 rounded-lg text-sm transition-all duration-300 ${
                darkMode
                  ? 'bg-gray-800 text-white border border-gray-700 focus:border-purple-500'
                  : 'bg-gray-50 text-gray-900 border border-gray-200 focus:border-purple-500'
              } focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          </div>

          {/* Sort Dropdown */}
          <select
            value={sortOption}
            onChange={(e) => onSortChange(e.target.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-all duration-300 ${
              darkMode
                ? 'bg-gray-800 text-white border border-gray-700 hover:border-purple-500'
                : 'bg-gray-50 text-gray-900 border border-gray-200 hover:border-purple-500'
            } focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {/* Filter Toggle (Mobile) */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`md:hidden px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
              darkMode
                ? 'bg-purple-600 text-white hover:bg-purple-700'
                : 'bg-purple-600 text-white hover:bg-purple-700'
            }`}
          >
            🎛️
          </button>
        </div>

        {/* Bottom Row: Category Filters (Desktop Always, Mobile Toggle) */}
        <div className={`${showFilters ? 'block' : 'hidden'} md:block`}>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {/* All Products */}
            <button
              onClick={() => onCategoryChange('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                selectedCategory === 'all'
                  ? 'bg-purple-600 text-white shadow-lg'
                  : darkMode
                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {t('common.all') || 'All'} ({totalProducts})
            </button>

            {/* Category Chips */}
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => onCategoryChange(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-purple-600 text-white shadow-lg'
                    : darkMode
                      ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
