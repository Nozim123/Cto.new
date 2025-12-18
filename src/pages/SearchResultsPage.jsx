import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useTheme } from '../contexts/ThemeContext'
import { useLanguage } from '../contexts/LanguageContext'
import { useEcosystem } from '../contexts/EcosystemContext'
import mallsData from '../data/malls.json'
import storesData from '../data/stores.json'
import { SEARCH_TYPES, searchMarketplace } from '../utils/search'
import ModernProductCard from '../components/ModernProductCard'
import ProductQuickView from '../components/ProductQuickView'

const TypeTab = ({ active, children, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all border ${
      active
        ? 'bg-purple-600 text-white border-purple-500 shadow-lg shadow-purple-500/20'
        : 'bg-white/5 text-white/80 border-white/10 hover:bg-white/10'
    }`}
  >
    {children}
  </button>
)

const ResultCard = ({ title, subtitle, image, href, badge }) => (
  <Link
    to={href}
    className="group flex items-center gap-4 p-4 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all"
  >
    <div className="w-14 h-14 rounded-2xl overflow-hidden bg-white/10 border border-white/10 flex-shrink-0">
      {image ? <img src={image} alt="" className="w-full h-full object-cover" loading="lazy" /> : null}
    </div>
    <div className="min-w-0 flex-1">
      <div className="flex items-center gap-2">
        <p className="text-white font-semibold truncate group-hover:text-purple-300 transition-colors">
          {title}
        </p>
        {badge ? (
          <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-200">
            {badge}
          </span>
        ) : null}
      </div>
      {subtitle ? <p className="text-sm text-white/60 truncate">{subtitle}</p> : null}
    </div>
    <span className="text-white/40 group-hover:text-white/70 transition-colors">→</span>
  </Link>
)

export default function SearchResultsPage() {
  const [params, setParams] = useSearchParams()
  const { darkMode } = useTheme()
  const { t } = useLanguage()
  const { getAllProducts } = useEcosystem()

  const query = (params.get('q') || '').trim()
  const type = params.get('type') || SEARCH_TYPES.all

  const [selectedProduct, setSelectedProduct] = useState(null)

  const results = useMemo(() => {
    return searchMarketplace({
      query,
      type,
      malls: mallsData,
      stores: storesData,
      products: getAllProducts(),
      limit: 100
    })
  }, [query, type, getAllProducts])

  const total = results.malls.length + results.stores.length + results.products.length

  const setTypeParam = (nextType) => {
    const next = new URLSearchParams(params)
    next.set('type', nextType)
    setParams(next)
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-primary'} text-white`}> 
      <div className="max-w-7xl mx-auto px-4 lg:px-8 pt-10 pb-20">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            {t('search.resultsTitle') || 'Search results'}
          </h1>
          <p className="text-white/70">
            {query ? (
              <>
                <span className="font-semibold text-white">{total}</span>{' '}
                {t('search.resultsFor') || 'results for'}{' '}
                <span className="font-semibold text-white">“{query}”</span>
              </>
            ) : (
              t('search.typeToSearch') || 'Type something to search…'
            )}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mb-10">
          <TypeTab
            active={type === SEARCH_TYPES.all}
            onClick={() => setTypeParam(SEARCH_TYPES.all)}
          >
            {t('search.all') || 'All'}
          </TypeTab>
          <TypeTab
            active={type === SEARCH_TYPES.malls}
            onClick={() => setTypeParam(SEARCH_TYPES.malls)}
          >
            {t('search.malls') || 'Malls'}
          </TypeTab>
          <TypeTab
            active={type === SEARCH_TYPES.stores}
            onClick={() => setTypeParam(SEARCH_TYPES.stores)}
          >
            {t('search.stores') || 'Stores'}
          </TypeTab>
          <TypeTab
            active={type === SEARCH_TYPES.products}
            onClick={() => setTypeParam(SEARCH_TYPES.products)}
          >
            {t('search.products') || 'Products'}
          </TypeTab>
        </div>

        {query && total === 0 ? (
          <div className="text-center py-20 rounded-3xl border border-white/10 bg-white/5">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-xl font-semibold mb-2">
              {t('search.noResults') || 'No results'}
            </h2>
            <p className="text-white/70 max-w-xl mx-auto">
              {t('search.tryDifferent') || 'Try a different keyword or switch categories.'}
            </p>
          </div>
        ) : null}

        {results.malls.length > 0 ? (
          <div className="mb-10">
            <h2 className="text-lg font-semibold mb-4">{t('search.malls') || 'Malls'}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {results.malls.map(({ mall }) => (
                <ResultCard
                  key={mall.id}
                  title={mall.name}
                  subtitle={mall.location}
                  image={mall.image}
                  href={`/mall/${mall.id}`}
                  badge="Mall"
                />
              ))}
            </div>
          </div>
        ) : null}

        {results.stores.length > 0 ? (
          <div className="mb-10">
            <h2 className="text-lg font-semibold mb-4">{t('search.stores') || 'Stores'}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {results.stores.map(({ store, mall }) => (
                <ResultCard
                  key={store.id}
                  title={store.name}
                  subtitle={`${mall?.name || ''} • ${store.category}`}
                  image={store.logo || store.image}
                  href={`/mall/${store.mallId}/store/${store.id}`}
                  badge="Store"
                />
              ))}
            </div>
          </div>
        ) : null}

        {results.products.length > 0 ? (
          <div className="mb-10">
            <div className="flex items-center justify-between gap-4 mb-4">
              <h2 className="text-lg font-semibold">{t('search.products') || 'Products'}</h2>
              <Link to="/" className="text-sm text-purple-200 hover:text-purple-100 hover:underline">
                {t('buttons.backToHome') || 'Back to Home'}
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {results.products.map(({ product }) => (
                <ModernProductCard
                  key={product.id}
                  product={product}
                  onQuickView={(p) => setSelectedProduct(p)}
                />
              ))}
            </div>
          </div>
        ) : null}

        {(type === SEARCH_TYPES.products || type === SEARCH_TYPES.all) && results.products.length > 0 ? (
          <div className="mt-12 p-6 rounded-3xl border border-white/10 bg-white/5">
            <h3 className="text-base font-semibold mb-2">
              {t('search.tipTitle') || 'Tip'}
            </h3>
            <p className="text-sm text-white/70">
              {t('search.tipText') || 'Use Quick View to compare products without leaving the page.'}
            </p>
          </div>
        ) : null}
      </div>

      {selectedProduct ? (
        <ProductQuickView product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      ) : null}
    </div>
  )
}
