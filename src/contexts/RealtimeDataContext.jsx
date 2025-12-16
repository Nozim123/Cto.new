import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'

import fallbackMalls from '../data/malls.json'
import fallbackStores from '../data/stores.json'
import fallbackProducts from '../data/products.json'

const API_BASE_URL = process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:5000/api'

const RealtimeDataContext = createContext(null)

const normalizeFallbackSnapshot = () => {
  const now = new Date().toISOString()

  const malls = (fallbackMalls || []).map((m) => ({
    id: m.id,
    name: m.name,
    description_short: m.description || '',
    description_full: m.description || '',
    address: m.address || m.location || '',
    work_time: m.hours || '',
    opened_date: m.openedDate ? String(m.openedDate) : '',
    location: Array.isArray(m.coordinates)
      ? { lat: Number(m.coordinates[0]) || 0, lng: Number(m.coordinates[1]) || 0 }
      : { lat: 0, lng: 0 },
    banner: m.bannerImage || m.image || '',
    gallery: [m.bannerImage, m.image].filter(Boolean),
    phone: m.phone || '',
    categories: m.id === 'family-park' ? ['fashion', 'electronics', 'food', 'entertainment'] : [],
    featured: Boolean(m.featured),
    social: {
      instagram: '',
      telegram: '',
      website: m.website || ''
    },
    status: m.status || 'open',
    createdAt: now,
    updatedAt: now
  }))

  const stores = (fallbackStores || []).map((s) => ({
    id: s.id,
    mall_id: s.mallId,
    name: s.name,
    logo: s.logo,
    banner: s.heroImage || s.image,
    category: s.category,
    description_short: s.description || '',
    description_full: s.about || '',
    work_time: s.hours || '',
    opened_date: '',
    floor: s.floor ?? null,
    phone: s.phone || '',
    email: s.email || '',
    social: {
      instagram: '',
      website: ''
    },
    gallery: [s.image, s.interiorImage].filter(Boolean),
    status: s.status || 'open',
    hasPromo: Boolean(s.hasPromo),
    promoTitle: s.promoTitle || '',
    promoDescription: s.promoDescription || '',
    promoDiscount: s.promoDiscount || '',
    createdAt: now,
    updatedAt: now
  }))

  const products = (fallbackProducts || []).map((p) => ({
    id: p.id,
    store_id: p.storeId,
    name: p.name,
    description: p.description || '',
    category: p.category || '',
    price: p.price !== undefined && p.price !== null ? String(p.price) : '',
    gallery: p.image ? [p.image] : [],
    stock: 'available',
    tag: p.tag || '',
    specifications: '',
    createdAt: now,
    updatedAt: now
  }))

  return {
    malls,
    stores,
    products,
    banners: [],
    settings: null
  }
}

export function RealtimeDataProvider({ children }) {
  const [snapshot, setSnapshot] = useState(() => normalizeFallbackSnapshot())
  const [loading, setLoading] = useState(true)
  const [live, setLive] = useState(false)
  const [connected, setConnected] = useState(false)

  const debounceRef = useRef(null)

  const fetchSnapshot = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/public/snapshot`, {
        headers: { 'Content-Type': 'application/json' }
      })

      if (!response.ok) {
        throw new Error(`Snapshot request failed: ${response.status}`)
      }

      const data = await response.json()
      setSnapshot(data)
      setLive(true)
    } catch {
      setSnapshot(normalizeFallbackSnapshot())
      setLive(false)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSnapshot()
  }, [fetchSnapshot])

  useEffect(() => {
    if (!live || typeof window === 'undefined' || !('EventSource' in window)) return undefined

    const sseUrl = `${API_BASE_URL}/public/events`
    const es = new EventSource(sseUrl)

    const scheduleRefresh = () => {
      window.clearTimeout(debounceRef.current)
      debounceRef.current = window.setTimeout(() => {
        fetchSnapshot()
      }, 250)
    }

    const onConnected = () => setConnected(true)
    const onDisconnected = () => setConnected(false)

    es.addEventListener('connected', onConnected)
    es.addEventListener('update', scheduleRefresh)
    es.addEventListener('ping', () => {})

    es.onerror = () => {
      onDisconnected()
    }

    return () => {
      window.clearTimeout(debounceRef.current)
      es.close()
    }
  }, [fetchSnapshot, live])

  const value = useMemo(
    () => ({
      ...snapshot,
      loading,
      live,
      connected,
      refresh: fetchSnapshot
    }),
    [snapshot, loading, live, connected, fetchSnapshot]
  )

  return <RealtimeDataContext.Provider value={value}>{children}</RealtimeDataContext.Provider>
}

export function useRealtimeData() {
  const ctx = useContext(RealtimeDataContext)
  if (!ctx) {
    throw new Error('useRealtimeData must be used within RealtimeDataProvider')
  }
  return ctx
}
