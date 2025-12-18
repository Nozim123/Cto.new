import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../contexts/ThemeContext'
import { useLanguage } from '../contexts/LanguageContext'
import { useEcosystem } from '../contexts/EcosystemContext'
import mallsData from '../data/malls.json'
import storesData from '../data/stores.json'
import { SEARCH_TYPES, searchMarketplace } from '../utils/search'

const TYPE_OPTIONS = [
  { key: SEARCH_TYPES.all, labelKey: 'search.all' },
  { key: SEARCH_TYPES.malls, labelKey: 'search.malls' },
  { key: SEARCH_TYPES.stores, labelKey: 'search.stores' },
  { key: SEARCH_TYPES.products, labelKey: 'search.products' }
]

const getTargetRoute = (type, item) => {
  if (type === SEARCH_TYPES.malls) return `/mall/${item.id}`
  if (type === SEARCH_TYPES.stores) return `/mall/${item.mallId}/store/${item.id}`
  if (type === SEARCH_TYPES.products) return `/product/${item.id}`
  return null
}

const SearchRow = ({ type, item, meta, active, onSelect, darkMode }) => {
  const base =
    'w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-colors'

  const activeCls = active
    ? darkMode
      ? 'bg-purple-500/15 ring-1 ring-purple-500/30'
      : 'bg-purple-500/10 ring-1 ring-purple-500/20'
    : darkMode
      ? 'hover:bg-white/10'
      : 'hover:bg-gray-50'

  const icon =
    type === SEARCH_TYPES.malls ? '🏢' : type === SEARCH_TYPES.stores ? '🏪' : '🛍️'

  const image =
    type === SEARCH_TYPES.malls
      ? item.image
      : type === SEARCH_TYPES.stores
        ? item.logo || item.image
        : item.image

  return (
    <button type="button" className={`${base} ${activeCls}`} onClick={onSelect}>
      <div
        className={`w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 border ${
          darkMode ? 'bg-white/10 border-white/10' : 'bg-gray-50 border-gray-200'
        }`}
      >
        {image ? (
          <img src={image} alt="" className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <div className={`w-full h-full flex items-center justify-center text-lg ${darkMode ? 'text-white' : 'text-gray-700'}`}>{icon}</div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className={`text-sm font-semibold truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>{item.name}</p>
          <span className={`text-xs flex-shrink-0 ${darkMode ? 'text-white/60' : 'text-gray-500'}`}>{icon}</span>
        </div>
        {meta ? <p className={`text-xs truncate ${darkMode ? 'text-white/60' : 'text-gray-600'}`}>{meta}</p> : null}
      </div>
    </button>
  )
}

export default function GlobalSearch() {
  const navigate = useNavigate()
  const { darkMode } = useTheme()
  const { t } = useLanguage()
  const { getAllProducts } = useEcosystem()

  const [query, setQuery] = useState('')
  const [type, setType] = useState(SEARCH_TYPES.all)
  const [open, setOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)

  const rootRef = useRef(null)
  const inputRef = useRef(null)
  const mobileInputRef = useRef(null)

  const results = useMemo(() => {
    return searchMarketplace({
      query,
      type,
      malls: mallsData,
      stores: storesData,
      products: getAllProducts(),
      limit: 10
    })
  }, [query, type, getAllProducts])

  const suggestions = results.flat

  const handleSelect = (suggestion) => {
    const target = getTargetRoute(suggestion.type, suggestion.item)
    if (target) {
      navigate(target)
      setOpen(false)
      setMobileOpen(false)
      setQuery('')
      setActiveIndex(-1)
    }
  }

  const handleSubmit = () => {
    const trimmed = query.trim()
    if (!trimmed) return

    navigate(`/search?q=${encodeURIComponent(trimmed)}&type=${encodeURIComponent(type)}`)
    setOpen(false)
    setMobileOpen(false)
    setActiveIndex(-1)
  }

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!rootRef.current) return
      if (!rootRef.current.contains(e.target)) {
        setOpen(false)
        setActiveIndex(-1)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (!mobileOpen) return

    document.body.style.overflow = 'hidden'
    const t = window.setTimeout(() => {
      mobileInputRef.current?.focus()
    }, 0)

    return () => {
      window.clearTimeout(t)
      document.body.style.overflow = 'unset'
    }
  }, [mobileOpen])

  const onKeyDown = (e, inModal = false) => {
    if (e.key === 'Escape') {
      setOpen(false)
      setMobileOpen(false)
      setActiveIndex(-1)
      return
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      const next = Math.min(activeIndex + 1, suggestions.length - 1)
      setActiveIndex(next)
      if (!inModal) setOpen(true)
      return
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault()
      const next = Math.max(activeIndex - 1, 0)
      setActiveIndex(next)
      return
    }

    if (e.key === 'Enter') {
      e.preventDefault()
      if (activeIndex >= 0 && suggestions[activeIndex]) {
        handleSelect(suggestions[activeIndex])
      } else {
        handleSubmit()
      }
    }
  }

  const Shell = ({ children }) => (
    <div
      ref={rootRef}
      className={`relative w-full max-w-3xl mx-auto ${darkMode ? 'text-white' : 'text-gray-900'}`}
    >
      {children}
    </div>
  )

  const TypeChips = () => (
    <div className="flex gap-2 overflow-x-auto scrollbar-hide py-2">
      {TYPE_OPTIONS.map((o) => (
        <button
          key={o.key}
          type="button"
          onClick={() => setType(o.key)}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all border whitespace-nowrap ${
            type === o.key
              ? 'bg-purple-600 text-white border-purple-500 shadow-lg shadow-purple-500/20'
              : darkMode
                ? 'bg-white/10 text-white/80 border-white/10 hover:bg-white/15'
                : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'
          }`}
        >
          {t(o.labelKey) || o.key}
        </button>
      ))}
    </div>
  )

  const Suggestions = () => (
    <div className="mt-3">
      <div className="px-2">
        <TypeChips />
      </div>

      {query.trim() && suggestions.length === 0 ? (
        <div className={`px-4 py-8 text-center text-sm ${darkMode ? 'text-white/70' : 'text-gray-600'}`}>
          {t('search.noResults') || 'No results'}
        </div>
      ) : null}

      <div className="max-h-[50vh] overflow-auto px-2 pb-2">
        {suggestions.map((s, idx) => {
          let meta = ''
          if (s.type === SEARCH_TYPES.malls) meta = s.item.location
          if (s.type === SEARCH_TYPES.stores) {
            const mall = mallsData.find((m) => m.id === s.item.mallId)
            meta = mall ? `${mall.name} • ${s.item.category}` : s.item.category
          }
          if (s.type === SEARCH_TYPES.products) {
            const store = storesData.find((st) => st.id === s.item.storeId)
            const mall = store ? mallsData.find((m) => m.id === store.mallId) : null
            meta = store ? `${store.name}${mall ? ` • ${mall.name}` : ''}` : s.item.category
          }

          return (
            <SearchRow
              key={`${s.type}-${s.item.id}`}
              type={s.type}
              item={s.item}
              meta={meta}
              active={idx === activeIndex}
              onSelect={() => handleSelect(s)}
              darkMode={darkMode}
            />
          )
        })}
      </div>

      {query.trim() ? (
        <div className={`p-2 border-t ${darkMode ? 'border-white/10' : 'border-gray-200'}`}>
          <button
            type="button"
            onClick={handleSubmit}
            className={`w-full px-4 py-3 rounded-xl border text-sm font-semibold transition-colors ${
              darkMode
                ? 'bg-white/10 hover:bg-white/15 border-white/10 text-white'
                : 'bg-gray-100 hover:bg-gray-200 border-gray-200 text-gray-900'
            }`}
          >
            {t('search.viewAll') || 'View all results'}
          </button>
        </div>
      ) : null}
    </div>
  )

  return (
    <Shell>
      {/* Desktop / tablet search bar */}
      <div className="hidden sm:block">
        <div
          className={`relative flex items-center gap-3 rounded-2xl border px-4 py-3 shadow-xl backdrop-blur-xl transition-all ${
            darkMode
              ? 'bg-white/5 border-white/10'
              : 'bg-gray-50 border-gray-200'
          }`}
        >
          <span className={darkMode ? 'text-white/70' : 'text-gray-500'}>🔎</span>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setOpen(true)
              setActiveIndex(-1)
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={(e) => onKeyDown(e)}
            placeholder={t('search.placeholder') || 'Search malls, stores, products…'}
            className={`flex-1 bg-transparent outline-none text-sm md:text-base ${
              darkMode ? 'text-white placeholder:text-white/60' : 'text-gray-900 placeholder:text-gray-400'
            }`}
            aria-label={t('search.placeholder') || 'Search'}
          />
          {query ? (
            <button
              type="button"
              onClick={() => {
                setQuery('')
                setActiveIndex(-1)
                inputRef.current?.focus()
              }}
              className={`transition-colors ${darkMode ? 'text-white/60 hover:text-white' : 'text-gray-500 hover:text-gray-700'}`}
              aria-label={t('common.close') || 'Clear'}
            >
              ✕
            </button>
          ) : null}
          <button
            type="button"
            onClick={handleSubmit}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-500 to-purple-700 text-white text-sm font-semibold hover:from-purple-400 hover:to-purple-600 transition-all"
          >
            {t('search.search') || 'Search'}
          </button>
        </div>

        {open ? (
          <div
            className={`absolute left-0 right-0 mt-3 rounded-2xl border backdrop-blur-xl shadow-2xl overflow-hidden ${
              darkMode ? 'border-white/10 bg-gray-950/70' : 'border-gray-200 bg-white'
            }`}
          >
            <Suggestions />
          </div>
        ) : null}
      </div>

      {/* Mobile trigger */}
      <div className="sm:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className={`w-full flex items-center gap-3 rounded-2xl border px-4 py-3 backdrop-blur-xl shadow-xl ${
            darkMode ? 'border-white/10 bg-white/10' : 'border-gray-200 bg-white'
          }`}
        >
          <span className={darkMode ? 'text-white/70' : 'text-gray-500'}>🔎</span>
          <span className={`text-sm truncate ${darkMode ? 'text-white/70' : 'text-gray-600'}`}>
            {t('search.placeholder') || 'Search malls, stores, products…'}
          </span>
        </button>
      </div>

      {/* Mobile full-screen modal */}
      {mobileOpen ? (
        <div className="fixed inset-0 z-[60] bg-primary/95 backdrop-blur-xl">
          <div className="max-w-2xl mx-auto px-4 pt-4 pb-6 h-full flex flex-col">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false)
                  setActiveIndex(-1)
                }}
                className="w-10 h-10 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center text-white"
                aria-label={t('common.close') || 'Close'}
              >
                ✕
              </button>

              <div className="flex-1 relative">
                <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-4 py-3">
                  <span className="text-white/70">🔎</span>
                  <input
                    ref={mobileInputRef}
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value)
                      setActiveIndex(-1)
                    }}
                    onKeyDown={(e) => onKeyDown(e, true)}
                    placeholder={t('search.placeholder') || 'Search…'}
                    className="flex-1 bg-transparent outline-none text-white placeholder:text-white/60"
                    aria-label={t('search.placeholder') || 'Search'}
                  />
                  {query ? (
                    <button
                      type="button"
                      onClick={() => {
                        setQuery('')
                        setActiveIndex(-1)
                        mobileInputRef.current?.focus()
                      }}
                      className="text-white/60 hover:text-white transition-colors"
                      aria-label={t('common.close') || 'Clear'}
                    >
                      ✕
                    </button>
                  ) : null}
                </div>

                <div className="mt-3 rounded-2xl border border-white/10 bg-black/30 backdrop-blur-xl shadow-2xl overflow-hidden flex-1">
                  <Suggestions />
                </div>
              </div>
            </div>

            <div className="mt-auto pt-4">
              <button
                type="button"
                onClick={handleSubmit}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-500 to-purple-700 text-white font-semibold shadow-lg"
              >
                {t('search.search') || 'Search'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </Shell>
  )
}
