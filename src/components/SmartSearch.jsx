import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../contexts/ThemeContext'
import mallsData from '../data/malls.json'
import storesData from '../data/stores.json'
import productsData from '../data/products.json'
import { getTopBehaviorIds, trackBehavior } from '../services/behavior'

const normalize = (value) => String(value || '').trim().toLowerCase()

const buildSuggestions = (query) => {
  const q = normalize(query)

  const match = (value) => normalize(value).includes(q)

  const malls = q
    ? mallsData.filter((m) => match(m.name) || match(m.location)).slice(0, 5)
    : []

  const stores = q
    ? storesData
        .filter((s) => match(s.name) || match(s.category))
        .slice(0, 6)
    : []

  const products = q
    ? productsData
        .filter((p) => match(p.name) || match(p.category) || match(p.tag))
        .slice(0, 6)
    : []

  return { malls, stores, products }
}

export default function SmartSearch({ placeholder = 'Search malls, stores, products…', onNavigate }) {
  const { darkMode } = useTheme()
  const navigate = useNavigate()
  const inputRef = useRef(null)

  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)

  const suggestions = useMemo(() => buildSuggestions(query), [query])

  const trending = useMemo(() => {
    const mallIds = getTopBehaviorIds('mall', 3)
    const storeIds = getTopBehaviorIds('store', 3)

    return {
      malls: mallsData.filter((m) => mallIds.includes(m.id)).slice(0, 3),
      stores: storesData.filter((s) => storeIds.includes(s.id)).slice(0, 3)
    }
  }, [])

  const flatItems = useMemo(() => {
    const list = []

    if (query.trim()) {
      suggestions.malls.forEach((m) => list.push({ kind: 'mall', item: m }))
      suggestions.stores.forEach((s) => list.push({ kind: 'store', item: s }))
      suggestions.products.forEach((p) => list.push({ kind: 'product', item: p }))
    } else {
      trending.malls.forEach((m) => list.push({ kind: 'mall', item: m }))
      trending.stores.forEach((s) => list.push({ kind: 'store', item: s }))
    }

    return list
  }, [query, suggestions, trending])

  const go = (kind, item) => {
    if (kind === 'mall') {
      trackBehavior({ type: 'mall', id: item.id })
      navigate(`/mall/${item.id}`)
    }

    if (kind === 'store') {
      trackBehavior({ type: 'store', id: item.id, category: item.category })
      navigate(`/mall/${item.mallId}/store/${item.id}`)
    }

    if (kind === 'product') {
      trackBehavior({ type: 'product', id: item.id, category: item.category })
      const store = storesData.find((s) => s.id === item.storeId)
      if (store) {
        navigate(`/mall/${store.mallId}/store/${store.id}`)
      }
    }

    setOpen(false)
    setActiveIndex(-1)
    onNavigate?.()
  }

  const onSubmit = (e) => {
    e.preventDefault()

    const item = flatItems[activeIndex] || flatItems[0]
    if (item) {
      go(item.kind, item.item)
      return
    }

    if (query.trim()) {
      window.location.hash = 'malls'
      setOpen(false)
    }
  }

  useEffect(() => {
    const onDocClick = (e) => {
      if (!inputRef.current) return
      if (inputRef.current.contains(e.target)) return
      setOpen(false)
    }

    document.addEventListener('click', onDocClick)
    return () => document.removeEventListener('click', onDocClick)
  }, [])

  return (
    <div ref={inputRef} className="relative">
      <form onSubmit={onSubmit} className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setOpen(true)
            setActiveIndex(-1)
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (!open) return

            if (e.key === 'ArrowDown') {
              e.preventDefault()
              setActiveIndex((idx) => Math.min(flatItems.length - 1, idx + 1))
            }

            if (e.key === 'ArrowUp') {
              e.preventDefault()
              setActiveIndex((idx) => Math.max(-1, idx - 1))
            }

            if (e.key === 'Escape') {
              setOpen(false)
            }
          }}
          placeholder={placeholder}
          className={`w-full px-4 py-3 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold transition-all duration-300 ${
            darkMode
              ? 'bg-gray-800/70 text-cream backdrop-blur-sm'
              : 'bg-white text-navy'
          }`}
          aria-label="Smart search"
        />

        <button type="submit" className="button-primary px-6 py-3 rounded-lg">
          Search
        </button>
      </form>

      {open && flatItems.length ? (
        <div
          className={`absolute left-0 right-0 mt-2 rounded-2xl overflow-hidden shadow-2xl border z-40 ${
            darkMode
              ? 'border-gray-700 bg-gray-900/80 backdrop-blur-xl'
              : 'border-gray-200 bg-white/90 backdrop-blur-xl'
          }`}
          role="listbox"
        >
          <div className="max-h-80 overflow-auto">
            {flatItems.map((x, idx) => {
              const active = idx === activeIndex
              const label =
                x.kind === 'mall'
                  ? x.item.location
                  : x.kind === 'store'
                    ? x.item.category
                    : x.item.category

              return (
                <button
                  key={`${x.kind}-${x.item.id}`}
                  type="button"
                  onMouseEnter={() => setActiveIndex(idx)}
                  onClick={() => go(x.kind, x.item)}
                  className={`w-full text-left px-4 py-3 transition-colors ${
                    active
                      ? darkMode
                        ? 'bg-gray-800 text-cream'
                        : 'bg-cream text-navy'
                      : darkMode
                        ? 'text-gray-200 hover:bg-gray-800'
                        : 'text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <p className="font-semibold">
                      {x.item.name}
                      <span className="ml-2 text-xs text-gold font-bold uppercase">{x.kind}</span>
                    </p>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{label}</p>
                  </div>
                </button>
              )
            })}
          </div>

          {!query.trim() ? (
            <div className={`px-4 py-3 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Trending based on your browsing (demo)
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
