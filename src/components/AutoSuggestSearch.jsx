import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'
import GlassCard from './ui/GlassCard'

const normalize = (s) => String(s || '').toLowerCase().trim()

export default function AutoSuggestSearch({
  placeholder = 'Search malls, stores, products…',
  malls = [],
  stores = [],
  products = [],
  className = '',
  onResultPicked,
}) {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const containerRef = useRef(null)

  const results = useMemo(() => {
    const q = normalize(query)
    if (!q) return []

    const mallHits = malls
      .filter((m) => normalize(m.name).includes(q))
      .slice(0, 4)
      .map((m) => ({ kind: 'mall', id: m.id, title: m.name, subtitle: 'Mall', to: `/mall/${m.id}` }))

    const storeHits = stores
      .filter((s) => normalize(s.name).includes(q) || normalize(s.category).includes(q))
      .slice(0, 5)
      .map((s) => ({
        kind: 'store',
        id: s.id,
        title: s.name,
        subtitle: `${s.category} • ${s.mallId === 'family-park' ? 'Family Park' : 'Mall'}`,
        to: `/mall/${s.mallId}/store/${s.id}`,
      }))

    const storeById = new Map(stores.map((s) => [s.id, s]))

    const productHits = products
      .filter((p) => normalize(p.name).includes(q) || normalize(p.category).includes(q))
      .slice(0, 5)
      .map((p) => {
        const store = storeById.get(p.storeId)
        return {
          kind: 'product',
          id: p.id,
          title: p.name,
          subtitle: `${p.category}${store ? ` • ${store.name}` : ''}`,
          to: store ? `/mall/${store.mallId}/store/${store.id}` : '/'
        }
      })

    return [...mallHits, ...storeHits, ...productHits].slice(0, 10)
  }, [malls, products, query, stores])

  const pick = (item) => {
    if (!item) return
    setOpen(false)
    setQuery('')
    onResultPicked?.(item)
    navigate(item.to)
  }

  useEffect(() => {
    const onDocClick = (e) => {
      if (!containerRef.current?.contains(e.target)) setOpen(false)
    }

    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [])

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className="glass-strong rounded-2xl px-4 py-3 flex items-center gap-3 border border-borderGlass">
        <Search className="w-5 h-5 text-white/70" aria-hidden="true" />
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setOpen(true)
            setActiveIndex(0)
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (!open || results.length === 0) return

            if (e.key === 'ArrowDown') {
              e.preventDefault()
              setActiveIndex((i) => Math.min(i + 1, results.length - 1))
            }
            if (e.key === 'ArrowUp') {
              e.preventDefault()
              setActiveIndex((i) => Math.max(i - 1, 0))
            }
            if (e.key === 'Enter') {
              e.preventDefault()
              pick(results[activeIndex])
            }
            if (e.key === 'Escape') {
              setOpen(false)
            }
          }}
          placeholder={placeholder}
          className="w-full bg-transparent text-white placeholder:text-white/40 focus:outline-none"
          aria-label="Search"
          autoComplete="off"
        />
      </div>

      {open && results.length > 0 && (
        <GlassCard
          className="absolute z-20 mt-3 w-full overflow-hidden"
          role="listbox"
          aria-label="Search suggestions"
        >
          <ul className="divide-y divide-white/10">
            {results.map((item, idx) => (
              <li key={`${item.kind}-${item.id}`}
                role="option"
                aria-selected={idx === activeIndex}
              >
                <button
                  type="button"
                  onMouseEnter={() => setActiveIndex(idx)}
                  onClick={() => pick(item)}
                  className={`w-full text-left px-4 py-3 transition ${
                    idx === activeIndex ? 'bg-white/10' : 'hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-white font-semibold">{item.title}</p>
                      <p className="text-white/60 text-sm">{item.subtitle}</p>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full bg-white/5 border border-borderGlass text-white/70">
                      {item.kind}
                    </span>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </GlassCard>
      )}
    </div>
  )
}
