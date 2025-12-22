import { useParams, Link } from 'react-router-dom'
import { useState, useEffect, useMemo } from 'react'
import { trackBehavior } from '../services/behavior'
import mallsData from '../data/malls.json'
import storesData from '../data/stores.json'
import { useTheme } from '../contexts/ThemeContext'
import { useLanguage } from '../contexts/LanguageContext'
import { useEcosystem } from '../contexts/EcosystemContext'
import StoreHeader from '../components/StoreHeader'
import StoreSubscribeSection from '../components/StoreSubscribeSection'
import ProductFilterBar from '../components/ProductFilterBar'
import ModernProductCard from '../components/ModernProductCard'
import ProductQuickView from '../components/ProductQuickView'
import ReviewsSection from '../components/ReviewsSection'
import SmartRecommendations from '../components/SmartRecommendations'

export default function StoreDetailsPage() {
  const { mallId, storeId } = useParams()
  const [mall, setMall] = useState(null)
  const [store, setStore] = useState(null)
  const [products, setProducts] = useState([])
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [scrolled, setScrolled] = useState(false)
  const { darkMode } = useTheme()
  const { t } = useLanguage()
  const { addRecentlyViewed, awardPoints, getProductsByStore } = useEcosystem()

  // Filter and Sort States
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortOption, setSortOption] = useState('featured')
  const [searchQuery, setSearchQuery] = useState('')
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 })

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    let currentMallId = mallId
    let currentStore = storesData.find((s) => s.id === storeId)
    
    if (currentStore && !currentMallId) {
      currentMallId = currentStore.mallId
    }

    const mallData = mallsData.find((m) => m.id === currentMallId)
    setMall(mallData)
    setStore(currentStore)

    if (currentStore) {
      trackBehavior({ type: 'store', id: storeId, category: currentStore.category })
      addRecentlyViewed('stores', storeId)
      awardPoints(2, 'view_store')
    }

    const storeProducts = getProductsByStore(storeId)
    setProducts(storeProducts)

    window.scrollTo(0, 0)
  }, [mallId, storeId, addRecentlyViewed, awardPoints, getProductsByStore])

  // Get unique categories from products
  const categories = useMemo(() => {
    const cats = [...new Set(products.map(p => p.category))]
    return cats.filter(Boolean)
  }, [products])

  // Filter and Sort Products
  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products]

    // Filter by category
    if (selectedCategory !== 'all') {
      result = result.filter(p => p.category === selectedCategory)
    }

    // Filter by search query
    if (searchQuery) {
      result = result.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    // Filter by price range
    result = result.filter(p => p.price >= priceRange.min && p.price <= priceRange.max)

    // Sort products
    switch (sortOption) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        result.sort((a, b) => b.price - a.price)
        break
      case 'new':
        result.sort((a, b) => (b.tag === 'New' ? 1 : 0) - (a.tag === 'New' ? 1 : 0))
        break
      case 'popular':
        result.sort((a, b) => (b.tag === 'Best Seller' ? 1 : 0) - (a.tag === 'Best Seller' ? 1 : 0))
        break
      default:
        // featured - keep original order
        break
    }

    return result
  }, [products, selectedCategory, searchQuery, priceRange, sortOption])

  const handleQuickView = (product) => {
    trackBehavior({ type: 'product_quick_view', id: product.id, category: product.category })
    addRecentlyViewed('products', product.id)
    awardPoints(1, 'quick_view')
    setSelectedProduct(product)
  }

  if (!store) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        darkMode ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <div className="text-center">
          <h1 className={`text-2xl font-bold mb-4 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Store Not Found
          </h1>
          <p className={`mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            The store you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/" className="inline-block px-6 py-3 bg-gold text-navy rounded-lg hover:bg-gold/90 transition-colors">
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  if (!mall) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        darkMode ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold mx-auto mb-4"></div>
          <p className={darkMode ? 'text-white' : 'text-gray-900'}>Loading store details...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen pb-20 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Hero Banner with Store Info */}
      <div className="relative h-64 md:h-80 w-full overflow-hidden">
        {/* Background Image */}
        <img
          src={store.heroImage || store.interiorImage || store.image}
          alt={store.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
        
        {/* Breadcrumb */}
        <div className="absolute top-24 left-0 w-full px-4 lg:px-8 z-10">
          <div className="max-w-7xl mx-auto text-white/80 text-sm flex items-center gap-2">
            <Link to="/" className="hover:text-white transition-colors">
              {t('nav.home') || 'Home'}
            </Link>
            <span>/</span>
            <Link to={`/mall/${mallId}`} className="hover:text-white transition-colors">
              {mall.name}
            </Link>
            <span>/</span>
            <span className="text-white font-medium">{store.name}</span>
          </div>
        </div>

        {/* Store Info Overlay */}
        <div className="absolute bottom-0 left-0 w-full px-4 lg:px-8 pb-6 z-10">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-end gap-6">
              {/* Store Logo */}
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-white/95 backdrop-blur-sm p-3 shadow-2xl flex-shrink-0 border-4 border-white/50">
                <img 
                  src={store.logo} 
                  alt={store.name} 
                  className="w-full h-full object-contain rounded-lg" 
                />
              </div>

              {/* Store Details */}
              <div className="flex-1 pb-2">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 drop-shadow-lg">
                  {store.name}
                </h1>
                <p className="text-white/90 text-sm md:text-base mb-2">
                  {store.description}
                </p>
                <div className="flex items-center gap-4 text-white/80 text-sm">
                  <span>📍 Floor {store.floor}</span>
                  <span>🕒 {store.hours}</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    store.status === 'open'
                      ? 'bg-green-500/90 text-white'
                      : 'bg-red-500/90 text-white'
                  }`}>
                    {store.status === 'open' ? t('common.open') : t('common.closed')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Store Header */}
      <StoreHeader store={store} mall={mall} scrolled={scrolled} />

      {/* Store Information Section */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 bg-white dark:bg-gray-800 rounded-lg mx-4 lg:mx-8 mt-4 shadow-lg">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold mb-4 dark:text-white">About {store.name}</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {store.about || store.description}
            </p>
            
            {/* Contact Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-xl">📞</span>
                <div>
                  <div className="font-medium dark:text-white">Phone</div>
                  <div className="text-gray-600 dark:text-gray-300">{store.phone}</div>
                </div>
              </div>
              
              {store.email && (
                <div className="flex items-center gap-3">
                  <span className="text-xl">✉️</span>
                  <div>
                    <div className="font-medium dark:text-white">Email</div>
                    <div className="text-gray-600 dark:text-gray-300">{store.email}</div>
                  </div>
                </div>
              )}
              
              <div className="flex items-center gap-3">
                <span className="text-xl">📍</span>
                <div>
                  <div className="font-medium dark:text-white">Location</div>
                  <div className="text-gray-600 dark:text-gray-300">{mall.name} - Floor {store.floor}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <span className="text-xl">🕒</span>
                <div>
                  <div className="font-medium dark:text-white">Hours</div>
                  <div className="text-gray-600 dark:text-gray-300">{store.hours}</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Store Features */}
          <div>
            <h3 className="text-xl font-bold mb-4 dark:text-white">Store Features</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: '🛍️', text: 'Latest Collections' },
                { icon: '💳', text: 'Card Payments' },
                { icon: '🚚', text: 'Delivery Available' },
                { icon: '↩️', text: 'Easy Returns' },
                { icon: '🎁', text: 'Gift Wrapping' },
                { icon: '👥', text: 'Personal Shopping' },
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <span className="text-lg">{feature.icon}</span>
                  <span className="text-sm font-medium dark:text-white">{feature.text}</span>
                </div>
              ))}
            </div>
            
            {/* Promotion Banner */}
            {store.hasPromo && (
              <div className="mt-6 p-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg text-white">
                <h4 className="font-bold text-lg">{store.promoTitle}</h4>
                <p className="text-sm opacity-90">{store.promoDescription}</p>
                {store.promoDiscount && (
                  <div className="mt-2 px-3 py-1 bg-white/20 rounded-full inline-block text-sm font-bold">
                    {store.promoDiscount}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Store Subscribe Section (Top) */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 mt-6 mx-4 lg:mx-8">
        <StoreSubscribeSection storeId={storeId} storeName={store.name} />
      </div>

      {/* Filter Bar */}
      <ProductFilterBar
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        sortOption={sortOption}
        onSortChange={setSortOption}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        priceRange={priceRange}
        onPriceRangeChange={setPriceRange}
        totalProducts={products.length}
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 md:py-12">
        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-lg font-semibold ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            {filteredAndSortedProducts.length === products.length
              ? `${t('products.showing') || 'Showing'} ${filteredAndSortedProducts.length} ${t('products.products') || 'products'}`
              : `${filteredAndSortedProducts.length} ${t('products.of') || 'of'} ${products.length} ${t('products.products') || 'products'}`
            }
          </h2>
        </div>

        {/* Product Grid */}
        {filteredAndSortedProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filteredAndSortedProducts.map((product) => (
              <ModernProductCard
                key={product.id}
                product={product}
                onQuickView={handleQuickView}
              />
            ))}
          </div>
        ) : (
          <div className={`text-center py-20 rounded-2xl ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className="text-6xl mb-4">🔍</div>
            <h3 className={`text-xl font-semibold mb-2 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {t('products.noProducts') || 'No products found'}
            </h3>
            <p className="text-gray-500 mb-6">
              {t('products.tryAdjusting') || 'Try adjusting your filters or search query'}
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all')
                setSearchQuery('')
                setSortOption('featured')
              }}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              {t('buttons.clearFilters') || 'Clear All Filters'}
            </button>
          </div>
        )}
      </div>

      {/* Store Subscribe Section (Bottom) */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 mb-12">
        <StoreSubscribeSection storeId={storeId} storeName={store.name} />
      </div>

      {/* Quick View Modal */}
      {selectedProduct && (
        <ProductQuickView
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      {/* Reviews Section */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 mb-12">
        <ReviewsSection 
          entityType="store" 
          entityId={storeId} 
          entityName={store.name} 
        />
      </div>

      {/* Smart Recommendations */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 mb-12">
        <SmartRecommendations 
          type="store" 
          id={storeId} 
          category={store.category}
          limit={4} 
        />
      </div>
    </div>
  )
}
