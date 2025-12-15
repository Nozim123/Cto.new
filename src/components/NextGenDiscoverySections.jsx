import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useTheme } from '../contexts/ThemeContext'
import { useUserAuth } from '../contexts/UserAuthContext'
import useFavorites from '../hooks/useFavorites'
import useCountUp from '../hooks/useCountUp'
import { getUserPreferences } from '../services/preferences'
import { pushNotification } from '../services/notifications'
import mallsData from '../data/malls.json'
import storesData from '../data/stores.json'
import productsData from '../data/products.json'
import ProductModal from './ProductModal'
import { getBehaviorState, getTopBehaviorIds, getTopCategories, trackBehavior } from '../services/behavior'

const stableNumberFromString = (value) => {
  const str = String(value)
  let hash = 0
  for (let i = 0; i < str.length; i += 1) {
    hash = (hash << 5) - hash + str.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

const formatCountdown = (ms) => {
  if (ms <= 0) return 'Ended'

  const totalSeconds = Math.floor(ms / 1000)
  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)

  if (days > 0) return `${days}d ${hours}h ${minutes}m`
  if (hours > 0) return `${hours}h ${minutes}m`
  return `${minutes}m`
}

const SectionShell = ({ id, title, subtitle, children }) => {
  const { darkMode } = useTheme()

  return (
    <section id={id} className="section-padding max-w-6xl mx-auto">
      <div className="mb-10 fade-in-up">
        <h2 className="heading-medium mb-3">{title}</h2>
        {subtitle ? (
          <p className={`text-lg max-w-3xl ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            {subtitle}
          </p>
        ) : null}
      </div>
      {children}
    </section>
  )
}

export default function NextGenDiscoverySections() {
  const { darkMode } = useTheme()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useUserAuth()
  const favorites = useFavorites(user?.id)
  const preferences = useMemo(() => getUserPreferences(user?.id), [user?.id])

  const [now, setNow] = useState(Date.now())
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [reviewMallId, setReviewMallId] = useState('family-park')
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewText, setReviewText] = useState('')
  const [reviewPhotoUrl, setReviewPhotoUrl] = useState('')
  const [reviewsVersion, setReviewsVersion] = useState(0)
  const [chatMessages, setChatMessages] = useState([
    {
      role: 'assistant',
      text: 'Hi! I\'m the Mall Explorer assistant. Ask me about malls, stores, categories, or deals.'
    }
  ])
  const [chatInput, setChatInput] = useState('')
  const [geoStatus, setGeoStatus] = useState({ state: 'idle', lat: null, lng: null })

  useEffect(() => {
    const t = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(t)
  }, [])

  const promosWithCountdown = useMemo(() => {
    const base = storesData
      .filter((s) => s.hasPromo)
      .map((store) => {
        const seed = stableNumberFromString(store.id)
        const endsInDays = 1 + (seed % 9)
        const endsAt = new Date(now + endsInDays * 24 * 60 * 60 * 1000).getTime()

        return {
          id: store.id,
          title: store.promoTitle,
          description: store.promoDescription,
          discount: store.promoDiscount,
          store,
          mallId: store.mallId,
          endsAt
        }
      })

    return base.sort((a, b) => a.endsAt - b.endsAt).slice(0, 6)
  }, [now])

  const comingSoonMalls = useMemo(
    () => mallsData.filter((m) => m.status === 'coming_soon'),
    []
  )

  const openingCards = useMemo(() => {
    return comingSoonMalls.map((mall) => {
      const seed = stableNumberFromString(mall.id)
      const days = 10 + (seed % 60)
      const openingDate = new Date(now + days * 24 * 60 * 60 * 1000)

      return {
        mall,
        openingDate
      }
    })
  }, [comingSoonMalls, now])

  const mallInsights = useMemo(() => {
    const byMall = new Map()

    for (const store of storesData) {
      const current = byMall.get(store.mallId) || { categoryCounts: {} }
      current.categoryCounts[store.category] = (current.categoryCounts[store.category] || 0) + 1
      byMall.set(store.mallId, current)
    }

    return mallsData
      .filter((m) => m.status !== 'coming_soon')
      .slice(0, 3)
      .map((mall) => {
        const seed = stableNumberFromString(mall.id)
        const peakStart = 12 + (seed % 5)
        const peakEnd = peakStart + 3
        const categoryCounts = byMall.get(mall.id)?.categoryCounts || {}
        const top = Object.entries(categoryCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3)
          .map(([category]) => category)

        return {
          mall,
          peakHours: `${peakStart}:00–${peakEnd}:00`,
          popularCategories: top,
          crowdTrend: ['Low', 'Medium', 'High'][seed % 3]
        }
      })
  }, [now])

  const [virtualTourOpen, setVirtualTourOpen] = useState(false)

  const reviewStorageKey = 'sme_reviews_v1'

  const reviews = useMemo(() => {
    const raw = window.localStorage.getItem(reviewStorageKey)
    if (!raw) return []

    try {
      const parsed = JSON.parse(raw)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  }, [reviewsVersion])

  const reviewsForMall = useMemo(
    () => reviews.filter((r) => r.mallId === reviewMallId).slice(0, 6),
    [reviews, reviewMallId]
  )

  const averageRating = useMemo(() => {
    const mallReviews = reviews.filter((r) => r.mallId === reviewMallId)
    if (mallReviews.length === 0) return null
    const total = mallReviews.reduce((acc, r) => acc + Number(r.rating || 0), 0)
    return total / mallReviews.length
  }, [reviews, reviewMallId])

  const addReview = (e) => {
    e.preventDefault()

    if (!reviewText.trim()) {
      toast.error('Please write a review')
      return
    }

    const next = [
      {
        id: `${Date.now()}`,
        mallId: reviewMallId,
        rating: reviewRating,
        text: reviewText.trim(),
        photoUrl: reviewPhotoUrl.trim() || null,
        createdAt: Date.now()
      },
      ...reviews
    ]

    window.localStorage.setItem(reviewStorageKey, JSON.stringify(next))
    setReviewText('')
    setReviewPhotoUrl('')
    setReviewsVersion((v) => v + 1)
    toast.success('Thanks! Your review was added.')
  }

  const assistantReply = (message) => {
    const text = message.toLowerCase()

    if (text.includes('deal') || text.includes('discount') || text.includes('promo')) {
      return 'Try the "Events & Promotions" section — it updates with limited-time offers and countdowns.'
    }
    if (text.includes('family') || text.includes('kid')) {
      return 'Looking for family-friendly spots? Check our mall directory for family zones and entertainment.'
    }
    if (text.includes('fashion')) {
      return 'For fashion, browse our store directory and filter by Fashion category.'
    }
    if (text.includes('map') || text.includes('location')) {
      return 'Open "Interactive Map" to browse malls and store pinpoints with category filters.'
    }

    return 'I can help you discover malls, stores, categories, and deals. Try: "Show me trending stores" or "Any promos this week?"'
  }

  const sendChat = (e) => {
    e.preventDefault()

    const message = chatInput.trim()
    if (!message) return

    setChatMessages((prev) => [...prev, { role: 'user', text: message }])
    setChatInput('')

    window.setTimeout(() => {
      setChatMessages((prev) => [...prev, { role: 'assistant', text: assistantReply(message) }])
    }, 300)
  }

  const requestLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported in this browser')
      return
    }

    setGeoStatus({ state: 'loading', lat: null, lng: null })
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGeoStatus({
          state: 'ready',
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        })
      },
      () => {
        setGeoStatus({ state: 'denied', lat: null, lng: null })
        toast.error('Location permission was denied')
      },
      { enableHighAccuracy: false, timeout: 8000 }
    )
  }

  const mapMallPositions = useMemo(
    () => ({
      'family-park': { x: 28, y: 35 },
      'makon-mall': { x: 55, y: 30 },
      'festival-mall': { x: 70, y: 55 },
      'next-mall': { x: 40, y: 62 },
      'samarkand-plaza': { x: 18, y: 58 }
    }),
    []
  )

  const storeCategories = useMemo(
    () => ['all', ...new Set(storesData.map((s) => s.category))],
    []
  )

  const [mapCategory, setMapCategory] = useState('all')
  const [selectedMapMallId, setSelectedMapMallId] = useState('family-park')

  const selectedMapMall = useMemo(
    () => mallsData.find((m) => m.id === selectedMapMallId) || mallsData[0],
    [selectedMapMallId]
  )

  const mapStores = useMemo(() => {
    let list = storesData.filter((s) => s.mallId === selectedMapMallId)
    if (mapCategory !== 'all') list = list.filter((s) => s.category === mapCategory)
    return list
  }, [selectedMapMallId, mapCategory])

  const baseCard = darkMode ? 'bg-gray-800 glass-card-dark' : 'bg-white glass-card'

  const discoverData = useMemo(() => {
    const interestCategories = preferences.interests?.length
      ? preferences.interests
      : getTopCategories(3)

    const trendingMallIds = getTopBehaviorIds('mall', 4)
    const trendingStoreIds = getTopBehaviorIds('store', 6)
    const popularProductIds = getTopBehaviorIds('product', 6)

    const recommendedStores = storesData
      .filter((s) => interestCategories.length === 0 || interestCategories.includes(s.category))
      .filter((s) => !favorites.stores.includes(s.id))
      .slice(0, 6)

    const trendingStores = (trendingStoreIds.length
      ? trendingStoreIds
          .map((id) => storesData.find((s) => s.id === id))
          .filter(Boolean)
      : storesData.filter((s) => s.hasPromo)
    ).slice(0, 6)

    const trendingMalls = (trendingMallIds.length
      ? trendingMallIds
          .map((id) => mallsData.find((m) => m.id === id))
          .filter(Boolean)
      : mallsData.filter((m) => m.featured)
    ).slice(0, 4)

    const popularProducts = (popularProductIds.length
      ? popularProductIds
          .map((id) => productsData.find((p) => p.id === id))
          .filter(Boolean)
      : productsData.filter((p) => String(p.tag || '').toLowerCase().includes('best'))
    ).slice(0, 6)

    return {
      interestCategories,
      trendingMalls,
      trendingStores,
      popularProducts,
      recommendedStores
    }
  }, [favorites.malls, favorites.stores, favorites.products, preferences.interests])

  const behaviorState = useMemo(() => getBehaviorState(), [now])

  const totalInteractions = useMemo(() => {
    const sum = (obj) => Object.values(obj || {}).reduce((acc, n) => acc + Number(n || 0), 0)
    return sum(behaviorState.counts?.mall) + sum(behaviorState.counts?.store) + sum(behaviorState.counts?.product)
  }, [behaviorState])

  const savedTotal = favorites.malls.length + favorites.stores.length + favorites.products.length

  const interactionsCount = useCountUp(totalInteractions)
  const savedCount = useCountUp(savedTotal)

  const editorChoiceMall = mallsData.find((m) => m.featured) || mallsData[0]
  const fashionStore = storesData.find((s) => s.category === 'Fashion') || storesData[0]
  const familyExperienceStore = storesData.find((s) => String(s.category).toLowerCase().includes('home')) || storesData[0]

  return (
    <div>
      <SectionShell
        id="discover"
        title="Discover"
        subtitle="A smart discovery hub powered by your behavior and preferences — recommended malls, trending stores, popular products, and personalized suggestions."
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className={`rounded-2xl p-6 card-shadow ${baseCard}`}>
            <p className="text-gold text-sm font-semibold">Recommended malls</p>
            <div className="mt-4 space-y-3">
              {discoverData.trendingMalls.map((mall) => (
                <button
                  key={mall.id}
                  type="button"
                  onClick={() => {
                    trackBehavior({ type: 'mall', id: mall.id })
                    navigate(`/mall/${mall.id}`)
                  }}
                  className={`w-full text-left rounded-xl p-4 border transition-colors ${
                    darkMode
                      ? 'border-gray-700 hover:bg-gray-900/40'
                      : 'border-gray-200 hover:bg-cream'
                  }`}
                >
                  <p className={`font-semibold ${darkMode ? 'text-cream' : 'text-navy'}`}>{mall.name}</p>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{mall.location}</p>
                </button>
              ))}
              {discoverData.trendingMalls.length === 0 ? (
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Browse a few malls to unlock suggestions.</p>
              ) : null}
            </div>
          </div>

          <div className={`rounded-2xl p-6 card-shadow ${baseCard}`}>
            <p className="text-gold text-sm font-semibold">Trending stores</p>
            <div className="mt-4 space-y-3">
              {discoverData.trendingStores.map((store) => (
                <button
                  key={store.id}
                  type="button"
                  onClick={() => {
                    trackBehavior({ type: 'store', id: store.id, category: store.category })
                    navigate(`/mall/${store.mallId}/store/${store.id}`)
                  }}
                  className={`w-full text-left rounded-xl p-4 border transition-colors ${
                    darkMode
                      ? 'border-gray-700 hover:bg-gray-900/40'
                      : 'border-gray-200 hover:bg-cream'
                  }`}
                >
                  <p className={`font-semibold ${darkMode ? 'text-cream' : 'text-navy'}`}>{store.name}</p>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{store.category}</p>
                </button>
              ))}
            </div>
          </div>

          <div className={`rounded-2xl p-6 card-shadow ${baseCard}`}>
            <p className="text-gold text-sm font-semibold">Popular products</p>
            <div className="mt-4 space-y-3">
              {discoverData.popularProducts.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    trackBehavior({ type: 'product', id: p.id, category: p.category })
                    setSelectedProduct(p)
                  }}
                  className={`w-full text-left rounded-xl p-4 border transition-colors ${
                    darkMode
                      ? 'border-gray-700 hover:bg-gray-900/40'
                      : 'border-gray-200 hover:bg-cream'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className={`font-semibold ${darkMode ? 'text-cream' : 'text-navy'}`}>{p.name}</p>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{p.category}</p>
                    </div>
                    <p className="text-gold font-bold">${Number(p.price).toFixed(0)}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className={`mt-8 rounded-2xl p-6 md:p-8 ${baseCard}`}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <p className="text-gold text-sm font-semibold">Your dashboard</p>
              <h3 className={`font-display text-2xl font-bold ${darkMode ? 'text-cream' : 'text-navy'}`}>
                Personalized discovery, favorites, and history
              </h3>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} mt-2`}>
                Interactions: <span className="text-gold font-bold">{interactionsCount}</span> • Saved: <span className="text-gold font-bold">{savedCount}</span>
              </p>
            </div>

            <div className="flex gap-3 flex-wrap">
              {isAuthenticated ? (
                <>
                  <button type="button" className="button-primary button-3d" onClick={() => navigate('/profile')}>
                    Open profile →
                  </button>
                  <button type="button" className="button-secondary button-3d" onClick={() => navigate('/onboarding')}>
                    Preferences
                  </button>
                </>
              ) : (
                <>
                  <button type="button" className="button-primary button-3d" onClick={() => navigate('/register')}>
                    Create profile
                  </button>
                  <button type="button" className="button-secondary button-3d" onClick={() => navigate('/login')}>
                    Sign in
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="mt-6">
            <p className={`text-sm font-semibold mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Personalized store picks
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {discoverData.recommendedStores.slice(0, 3).map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => {
                    trackBehavior({ type: 'store', id: s.id, category: s.category })
                    navigate(`/mall/${s.mallId}/store/${s.id}`)
                  }}
                  className={`rounded-xl p-5 border text-left transition-colors button-3d ${
                    darkMode
                      ? 'border-gray-700 hover:bg-gray-900/40'
                      : 'border-gray-200 hover:bg-cream'
                  }`}
                >
                  <p className={`font-semibold ${darkMode ? 'text-cream' : 'text-navy'}`}>{s.name}</p>
                  <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{s.category}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </SectionShell>

      <SectionShell
        id="explore-map"
        title="Interactive Map"
        subtitle="Browse shopping destinations like a digital experience: mall clusters, store pinpoints, and category filtering."
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className={`rounded-2xl p-6 ${baseCard}`}>
            <h3 className={`font-display text-xl font-bold mb-4 ${darkMode ? 'text-cream' : 'text-navy'}`}>
              Filters
            </h3>

            <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Category
            </label>
            <select
              value={mapCategory}
              onChange={(e) => setMapCategory(e.target.value)}
              className="w-full px-4 py-2 rounded-lg text-navy focus:outline-none focus:ring-2 focus:ring-gold"
            >
              {storeCategories.map((c) => (
                <option key={c} value={c}>
                  {c === 'all' ? 'All categories' : c}
                </option>
              ))}
            </select>

            <label className={`block text-sm font-semibold mb-2 mt-5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Mall cluster
            </label>
            <div className="space-y-2">
              {mallsData.map((mall) => (
                <button
                  key={mall.id}
                  type="button"
                  onClick={() => setSelectedMapMallId(mall.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg border transition-all duration-200 button-3d ${
                    selectedMapMallId === mall.id
                      ? 'border-gold bg-gold/10'
                      : darkMode
                        ? 'border-gray-700 hover:border-gray-600'
                        : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <p className={`font-semibold ${darkMode ? 'text-cream' : 'text-navy'}`}>{mall.name}</p>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{mall.status === 'coming_soon' ? 'Coming soon' : 'Open'}</p>
                </button>
              ))}
            </div>
          </div>

          <div className={`lg:col-span-2 rounded-2xl p-6 ${baseCard}`}>
            <div className="flex items-start justify-between gap-6 flex-wrap mb-4">
              <div>
                <h3 className={`font-display text-xl font-bold ${darkMode ? 'text-cream' : 'text-navy'}`}>
                  City map
                </h3>
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Selected: <span className="text-gold font-semibold">{selectedMapMall?.name}</span>
                </p>
              </div>
              <button
                type="button"
                className="button-primary button-3d"
                onClick={() => {
                  trackBehavior({ type: 'mall', id: selectedMapMallId })
                  navigate(`/mall/${selectedMapMallId}`)
                }}
              >
                Open mall →
              </button>
            </div>

            <div
              className={`relative w-full h-[420px] rounded-xl overflow-hidden border ${
                darkMode ? 'border-gray-700 bg-gray-900/40' : 'border-gray-200 bg-cream/60'
              }`}
            >
              <div className="absolute inset-0 opacity-60" style={{
                backgroundImage:
                  'radial-gradient(circle at 20% 20%, rgba(212, 175, 55, 0.25), transparent 45%), radial-gradient(circle at 80% 50%, rgba(143, 168, 154, 0.25), transparent 45%)'
              }} />

              {mallsData.map((mall) => {
                const pos = mapMallPositions[mall.id] || { x: 50, y: 50 }
                const active = mall.id === selectedMapMallId
                return (
                  <button
                    key={mall.id}
                    type="button"
                    onClick={() => setSelectedMapMallId(mall.id)}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 shadow-md transition-all duration-300 ${
                      active ? 'border-gold bg-gold text-navy scale-110' : 'border-navy bg-white/80 text-navy hover:scale-105'
                    }`}
                    style={{ left: `${pos.x}%`, top: `${pos.y}%`, width: active ? 56 : 44, height: active ? 56 : 44 }}
                    aria-label={`Map pin: ${mall.name}`}
                  >
                    <span className="text-xs font-bold">{mall.name.split(' ')[0]}</span>
                  </button>
                )
              })}

              {mapStores.map((store) => {
                const basePos = mapMallPositions[selectedMapMallId] || { x: 50, y: 50 }
                const seed = stableNumberFromString(store.id)
                const radius = 7 + (seed % 10)
                const angle = (seed % 360) * (Math.PI / 180)
                const x = basePos.x + Math.cos(angle) * (radius / 2)
                const y = basePos.y + Math.sin(angle) * (radius / 2)

                return (
                  <button
                    key={store.id}
                    type="button"
                    onClick={() => {
                      trackBehavior({ type: 'store', id: store.id, category: store.category })
                      navigate(`/mall/${store.mallId}/store/${store.id}`)
                    }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-accent border-2 border-white shadow-md hover:scale-125 transition-transform"
                    style={{ left: `${x}%`, top: `${y}%` }}
                    title={`${store.name} • ${store.category}`}
                    aria-label={`Store pin: ${store.name}`}
                  />
                )
              })}
            </div>

            <div className="mt-5">
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Store pinpoints: <span className="font-semibold">{mapStores.length}</span>
              </p>
            </div>
          </div>
        </div>
      </SectionShell>

      <SectionShell
        id="experiences"
        title="Experiences"
        subtitle="Mall life beyond shopping — cinemas, kids zones, food courts, and festivals to make every visit memorable."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: 'Cinemas', desc: 'Showtimes and trailers (future-ready)', icon: '🎬' },
            { title: 'Kids zones', desc: 'Family-friendly play areas and activities', icon: '🧸' },
            { title: 'Food courts', desc: 'Trending dishes and places to eat', icon: '🍜' },
            { title: 'Events', desc: 'Festivals, pop-ups, and live performances', icon: '🎉' }
          ].map((x) => (
            <div key={x.title} className={`rounded-2xl p-6 card-shadow ${baseCard}`}>
              <div className="text-3xl mb-3">{x.icon}</div>
              <h3 className={`font-display text-xl font-bold mb-2 ${darkMode ? 'text-cream' : 'text-navy'}`}>
                {x.title}
              </h3>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{x.desc}</p>
            </div>
          ))}
        </div>
      </SectionShell>

      <SectionShell
        id="events-promotions"
        title="Events & Promotions"
        subtitle="A centralized hub for seasonal discounts and limited-time offers — with real countdown timers and promo highlights."
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {promosWithCountdown.map((promo) => (
            <div key={promo.id} className={`rounded-2xl p-6 card-shadow ${baseCard}`}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-gold text-sm font-semibold">Limited-time offer</p>
                  <h3 className={`font-display text-2xl font-bold ${darkMode ? 'text-cream' : 'text-navy'}`}>
                    {promo.title}
                  </h3>
                  <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} mt-2`}>
                    {promo.description}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-gold font-bold text-lg">{promo.discount}</p>
                  <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Ends in {formatCountdown(promo.endsAt - now)}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  className="button-primary button-3d"
                  onClick={() => navigate(`/mall/${promo.mallId}/store/${promo.store.id}`)}
                >
                  View store →
                </button>
                <button
                  type="button"
                  className="button-secondary button-3d"
                  onClick={() => {
                    trackBehavior({ type: 'store', id: promo.store.id, category: promo.store.category })

                    if (!isAuthenticated) {
                      toast('Sign in to save deals')
                      navigate('/login')
                      return
                    }

                    pushNotification(user.id, {
                      title: 'Deal saved',
                      message: `${promo.title} • ${promo.discount}`
                    })
                    toast.success('Deal saved')
                  }}
                >
                  Save deal
                </button>
              </div>
            </div>
          ))}
        </div>
      </SectionShell>

      <SectionShell
        id="new-openings"
        title="New Openings"
        subtitle="New malls and stores — with opening dates, highlights, and exclusive previews."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {openingCards.map(({ mall, openingDate }) => (
            <div key={mall.id} className={`rounded-2xl p-6 card-shadow ${baseCard}`}>
              <h3 className={`font-display text-2xl font-bold mb-2 ${darkMode ? 'text-cream' : 'text-navy'}`}>
                {mall.name}
              </h3>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Opening date</p>
              <p className="text-gold font-semibold">
                {openingDate.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
              </p>
              <p className={`mt-3 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Exclusive previews, early-bird deals, and announcement alerts coming soon.
              </p>
            </div>
          ))}
        </div>
      </SectionShell>

      <SectionShell
        id="top-picks"
        title="Top Picks"
        subtitle="Editorially curated recommendations — premium, practical, and always evolving."
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className={`rounded-2xl p-6 card-shadow ${baseCard}`}>
            <p className="text-gold text-sm font-semibold">Editor’s choice</p>
            <h3 className={`font-display text-2xl font-bold mt-2 ${darkMode ? 'text-cream' : 'text-navy'}`}>
              {editorChoiceMall?.name}
            </h3>
            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} mt-2`}>
              The most iconic destination to start your Samarkand journey.
            </p>
            <button type="button" className="button-primary button-3d mt-4" onClick={() => navigate(`/mall/${editorChoiceMall.id}`)}>
              Explore →
            </button>
          </div>

          <div className={`rounded-2xl p-6 card-shadow ${baseCard}`}>
            <p className="text-gold text-sm font-semibold">Best for fashion</p>
            <h3 className={`font-display text-2xl font-bold mt-2 ${darkMode ? 'text-cream' : 'text-navy'}`}>
              {fashionStore?.name}
            </h3>
            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} mt-2`}>
              Curated pieces and seasonal drops — ideal for premium styling.
            </p>
            <button type="button" className="button-secondary button-3d mt-4" onClick={() => navigate(`/mall/${fashionStore.mallId}/store/${fashionStore.id}`)}>
              View store →
            </button>
          </div>

          <div className={`rounded-2xl p-6 card-shadow ${baseCard}`}>
            <p className="text-gold text-sm font-semibold">Best for home & family</p>
            <h3 className={`font-display text-2xl font-bold mt-2 ${darkMode ? 'text-cream' : 'text-navy'}`}>
              {familyExperienceStore?.name}
            </h3>
            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} mt-2`}>
              Essentials, comfort, and family-friendly picks for everyday life.
            </p>
            <button type="button" className="button-secondary button-3d mt-4" onClick={() => navigate(`/mall/${familyExperienceStore.mallId}/store/${familyExperienceStore.id}`)}>
              View store →
            </button>
          </div>
        </div>
      </SectionShell>

      <SectionShell
        id="collections"
        title="Collections"
        subtitle="Theme-based collections that blend products, stores, and storytelling — built for seasonal campaigns."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              title: 'Summer Fitness',
              desc: 'Footwear, apparel, and accessories curated for active days.',
              products: productsData.filter((p) => ['Footwear', 'Apparel', 'Accessories'].includes(p.category)).slice(0, 3)
            },
            {
              title: 'Back-to-School',
              desc: 'Comfort essentials and everyday gear for a fresh start.',
              products: productsData.filter((p) => ['Apparel', 'Bags'].includes(p.category)).slice(0, 3)
            },
            {
              title: 'Wedding Shopping',
              desc: 'Premium gifts, accessories, and style highlights.',
              products: productsData.filter((p) => ['Accessories', 'Apparel'].includes(p.category)).slice(3, 6)
            },
            {
              title: 'Tech Essentials',
              desc: 'Smart add-ons and modern accessories for your daily setup.',
              products: productsData.filter((p) => ['Accessories'].includes(p.category)).slice(0, 3)
            }
          ].map((c) => (
            <div key={c.title} className={`rounded-2xl p-6 card-shadow ${baseCard}`}>
              <h3 className={`font-display text-2xl font-bold ${darkMode ? 'text-cream' : 'text-navy'}`}>{c.title}</h3>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} mt-2`}>{c.desc}</p>

              <div className="mt-5 grid grid-cols-3 gap-3">
                {c.products.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelectedProduct(p)}
                    className={`rounded-xl overflow-hidden border transition-transform hover:scale-[1.02] ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
                    aria-label={`Open product: ${p.name}`}
                  >
                    <img src={p.image} alt={p.name} className="w-full h-24 object-cover" loading="lazy" />
                  </button>
                ))}
              </div>

              <div className="mt-5">
                <button
                  type="button"
                  className="button-primary button-3d"
                  onClick={() => {
                    const first = c.products[0]
                    if (first) setSelectedProduct(first)
                  }}
                >
                  Explore collection →
                </button>
              </div>
            </div>
          ))}
        </div>
      </SectionShell>

      <SectionShell
        id="insights"
        title="Insights"
        subtitle="Data-driven insights like peak visiting hours, popular categories, and future-ready crowd trends."
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mallInsights.map((insight) => (
            <div key={insight.mall.id} className={`rounded-2xl p-6 card-shadow ${baseCard}`}>
              <h3 className={`font-display text-2xl font-bold mb-3 ${darkMode ? 'text-cream' : 'text-navy'}`}>
                {insight.mall.name}
              </h3>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Peak hours: <span className="text-gold font-semibold">{insight.peakHours}</span>
              </p>
              <p className={`text-sm mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Popular categories
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                {insight.popularCategories.map((c) => (
                  <span key={c} className="px-3 py-1 rounded-full bg-gold/15 text-gold text-xs font-semibold">
                    {c}
                  </span>
                ))}
              </div>
              <p className={`text-sm mt-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Crowd trend (preview): <span className="font-semibold">{insight.crowdTrend}</span>
              </p>
            </div>
          ))}
        </div>
      </SectionShell>

      <SectionShell
        id="virtual-tour"
        title="Virtual Tour"
        subtitle="Immersive previews: 360° tours, video walkthroughs, and AR-ready placeholders."
      >
        <div className={`rounded-2xl p-6 md:p-8 ${baseCard}`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: '360° Tour', desc: 'Panorama-ready container (coming soon)' },
              { title: 'Video Walkthrough', desc: 'Curated highlights and storytelling' },
              { title: 'AR Preview', desc: 'AR-ready placeholders for future builds' }
            ].map((x) => (
              <div key={x.title} className={`rounded-xl p-6 border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <h3 className={`font-display text-xl font-bold ${darkMode ? 'text-cream' : 'text-navy'}`}>
                  {x.title}
                </h3>
                <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} mt-2`}>{x.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <button type="button" className="button-primary button-3d" onClick={() => setVirtualTourOpen(true)}>
              Launch demo tour
            </button>
          </div>

          {virtualTourOpen ? (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-black/60" onClick={() => setVirtualTourOpen(false)} />
              <div className={`relative w-full max-w-3xl rounded-2xl overflow-hidden ${baseCard}`}>
                <div className="p-6 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
                  <h3 className={`font-display text-2xl font-bold ${darkMode ? 'text-cream' : 'text-navy'}`}>
                    Virtual Tour (demo)
                  </h3>
                  <button
                    type="button"
                    onClick={() => setVirtualTourOpen(false)}
                    className={`px-3 py-1 rounded-lg ${darkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    Close
                  </button>
                </div>
                <div className="p-6">
                  <div className={`h-72 rounded-xl flex items-center justify-center text-center ${
                    darkMode ? 'bg-gray-900/40' : 'bg-cream'
                  }`}>
                    <div>
                      <p className={`text-lg font-semibold ${darkMode ? 'text-cream' : 'text-navy'}`}>
                        360° / Video / AR placeholder
                      </p>
                      <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-2`}>
                        This is where immersive content will load.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </SectionShell>

      <SectionShell
        id="community"
        title="Community & Reviews"
        subtitle="User-generated ratings, reviews with photos, and community trust for long-term growth."
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className={`rounded-2xl p-6 md:p-8 ${baseCard}`}>
            <h3 className={`font-display text-xl font-bold mb-4 ${darkMode ? 'text-cream' : 'text-navy'}`}>
              Ratings & reviews
            </h3>

            <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Select mall
            </label>
            <select
              value={reviewMallId}
              onChange={(e) => setReviewMallId(e.target.value)}
              className="w-full px-4 py-2 rounded-lg text-navy focus:outline-none focus:ring-2 focus:ring-gold"
            >
              {mallsData.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>

            <div className="mt-4">
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Average rating:{' '}
                <span className="text-gold font-bold">
                  {averageRating ? averageRating.toFixed(1) : '—'}
                </span>
              </p>
            </div>

            <div className="mt-6 space-y-4">
              {reviewsForMall.length ? (
                reviewsForMall.map((r) => (
                  <div
                    key={r.id}
                    className={`rounded-xl p-4 border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
                  >
                    <div className="flex items-center justify-between">
                      <p className={`font-semibold ${darkMode ? 'text-cream' : 'text-navy'}`}>Rating: {r.rating}/5</p>
                      <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                        {new Date(r.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} mt-2`}>{r.text}</p>
                    {r.photoUrl ? (
                      <img
                        src={r.photoUrl}
                        alt="Review"
                        className="mt-3 w-full h-32 object-cover rounded-lg"
                        loading="lazy"
                      />
                    ) : null}
                  </div>
                ))
              ) : (
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  No reviews yet — be the first!
                </p>
              )}
            </div>
          </div>

          <div className={`rounded-2xl p-6 md:p-8 ${baseCard}`}>
            <h3 className={`font-display text-xl font-bold mb-4 ${darkMode ? 'text-cream' : 'text-navy'}`}>
              Write a review
            </h3>

            <form className="space-y-4" onSubmit={addReview}>
              <div>
                <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Rating
                </label>
                <select
                  value={reviewRating}
                  onChange={(e) => setReviewRating(Number(e.target.value))}
                  className="w-full px-4 py-2 rounded-lg text-navy focus:outline-none focus:ring-2 focus:ring-gold"
                >
                  <option value={5}>5 stars</option>
                  <option value={4}>4 stars</option>
                  <option value={3}>3 stars</option>
                  <option value={2}>2 stars</option>
                  <option value={1}>1 star</option>
                </select>
              </div>

              <div>
                <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Your review
                </label>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg text-navy focus:outline-none focus:ring-2 focus:ring-gold"
                  rows={4}
                  placeholder="Share your experience…"
                  required
                />
              </div>

              <div>
                <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Photo URL (optional)
                </label>
                <input
                  value={reviewPhotoUrl}
                  onChange={(e) => setReviewPhotoUrl(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg text-navy focus:outline-none focus:ring-2 focus:ring-gold"
                  placeholder="https://..."
                />
              </div>

              <button type="submit" className="button-primary button-3d w-full">
                Submit review
              </button>
            </form>
          </div>
        </div>
      </SectionShell>

      <SectionShell
        id="brand-spotlight"
        title="Brand Spotlight"
        subtitle="Featured brands, flagship stories, and exclusive collections — built for premium perception."
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {storesData.slice(0, 3).map((store) => (
            <div key={store.id} className={`rounded-2xl overflow-hidden card-shadow ${baseCard}`}>
              <div className="h-44 overflow-hidden">
                <img
                  src={store.image}
                  alt={store.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="p-6">
                <p className="text-gold text-sm font-semibold">Brand story</p>
                <h3 className={`font-display text-2xl font-bold ${darkMode ? 'text-cream' : 'text-navy'}`}>
                  {store.name}
                </h3>
                <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} mt-2 line-clamp-3`}>
                  {store.about}
                </p>
                <div className="mt-4 flex gap-3">
                  <button
                    type="button"
                    className="button-primary button-3d"
                    onClick={() => navigate(`/mall/${store.mallId}/store/${store.id}`)}
                  >
                    View store
                  </button>
                  <button
                    type="button"
                    className="button-secondary button-3d"
                    onClick={() => toast.success('Interview coming soon')}
                  >
                    Interview
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </SectionShell>

      <SectionShell
        id="deals-near-you"
        title="Deals Near You"
        subtitle="Location-aware promotions — a future-ready base for geo-targeted offers and personalized notifications."
      >
        <div className={`rounded-2xl p-6 md:p-8 ${baseCard}`}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Status: <span className="font-semibold">{geoStatus.state}</span>
              </p>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                We only use your location to rank nearby deals (demo uses approximate distances).
              </p>
            </div>

            <button
              type="button"
              className="button-primary button-3d"
              onClick={requestLocation}
              disabled={geoStatus.state === 'loading'}
            >
              {geoStatus.state === 'loading' ? 'Locating…' : 'Enable location'}
            </button>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {promosWithCountdown.slice(0, 4).map((promo) => {
              const distanceKm = 0.8 + (stableNumberFromString(promo.id) % 25) / 10
              return (
                <div key={promo.id} className={`rounded-xl p-5 border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-gold text-sm font-semibold">{promo.discount}</p>
                      <p className={`font-bold ${darkMode ? 'text-cream' : 'text-navy'}`}>{promo.title}</p>
                      <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Approx. {distanceKm.toFixed(1)} km away
                      </p>
                    </div>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {formatCountdown(promo.endsAt - now)}
                    </p>
                  </div>
                  <div className="mt-4">
                    <button
                      type="button"
                      className="button-secondary button-3d"
                      onClick={() => navigate(`/mall/${promo.mallId}/store/${promo.store.id}`)}
                    >
                      View deal
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </SectionShell>

      <SectionShell
        id="sustainability"
        title="Sustainability"
        subtitle="Eco-conscious initiatives like recycling programs, green malls, and sustainable brands."
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: 'Green malls', desc: 'Energy-efficient lighting and smarter cooling systems', icon: '🌿' },
            { title: 'Sustainable brands', desc: 'Spot eco-friendly materials and ethical manufacturing', icon: '♻️' },
            { title: 'Recycling programs', desc: 'Drop-off points and seasonal collection drives', icon: '🧴' }
          ].map((x) => (
            <div key={x.title} className={`rounded-2xl p-6 card-shadow ${baseCard}`}>
              <div className="text-3xl mb-3">{x.icon}</div>
              <h3 className={`font-display text-xl font-bold mb-2 ${darkMode ? 'text-cream' : 'text-navy'}`}>
                {x.title}
              </h3>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{x.desc}</p>
            </div>
          ))}
        </div>
      </SectionShell>

      <SectionShell
        id="news-updates"
        title="News & Updates"
        subtitle="Latest announcements, mall news, and editorial-style content to keep visitors informed."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              title: 'Grand Opening: Festival Mall',
              date: 'Dec 20, 2024',
              desc: 'Join us for the grand opening celebration with exclusive deals and entertainment.'
            },
            {
              title: 'Holiday Shopping Guide',
              date: 'Dec 15, 2024',
              desc: 'Your complete guide to finding the perfect gifts this holiday season.'
            },
            {
              title: 'New Store Alert: Tech Hub',
              date: 'Dec 10, 2024',
              desc: 'The latest electronics and gadgets arrive at Family Park Mall.'
            },
            {
              title: 'Sustainability Initiative',
              date: 'Dec 5, 2024',
              desc: 'All malls now feature eco-friendly recycling stations and green spaces.'
            }
          ].map((news) => (
            <div key={news.title} className={`rounded-2xl p-6 card-shadow ${baseCard}`}>
              <p className="text-gold text-sm font-semibold">{news.date}</p>
              <h3 className={`font-display text-xl font-bold mt-2 mb-3 ${darkMode ? 'text-cream' : 'text-navy'}`}>
                {news.title}
              </h3>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{news.desc}</p>
              <button
                type="button"
                className="button-secondary button-3d mt-4"
                onClick={() => toast.success('Full article coming soon')}
              >
                Read more →
              </button>
            </div>
          ))}
        </div>
      </SectionShell>

      <SectionShell
        id="help-center"
        title="Help Center"
        subtitle="Modern support: AI chat assistant, FAQs, and contact forms — built to scale with the platform."
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className={`rounded-2xl p-6 md:p-8 ${baseCard}`}>
            <h3 className={`font-display text-xl font-bold mb-4 ${darkMode ? 'text-cream' : 'text-navy'}`}>
              AI chat assistant (demo)
            </h3>

            <div className={`h-72 rounded-xl p-4 overflow-auto border ${darkMode ? 'border-gray-700 bg-gray-900/40' : 'border-gray-200 bg-cream/60'}`}>
              <div className="space-y-3">
                {chatMessages.map((m, idx) => (
                  <div
                    key={`${m.role}-${idx}`}
                    className={`max-w-[85%] rounded-xl px-4 py-3 ${
                      m.role === 'assistant'
                        ? darkMode
                          ? 'bg-gray-800 text-gray-200'
                          : 'bg-white text-gray-800'
                        : 'bg-gold text-navy ml-auto'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{m.text}</p>
                  </div>
                ))}
              </div>
            </div>

            <form onSubmit={sendChat} className="mt-4 flex gap-3">
              <input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="flex-1 px-4 py-2 rounded-lg text-navy focus:outline-none focus:ring-2 focus:ring-gold"
                placeholder="Type a question…"
              />
              <button type="submit" className="button-primary button-3d">
                Send
              </button>
            </form>
          </div>

          <div className={`rounded-2xl p-6 md:p-8 ${baseCard}`}>
            <h3 className={`font-display text-xl font-bold mb-4 ${darkMode ? 'text-cream' : 'text-navy'}`}>
              FAQs
            </h3>
            <div className="space-y-4">
              {[
                {
                  q: 'How do I find stores in a specific mall?',
                  a: 'Visit any mall page and use the interactive map or browse the store directory.'
                },
                {
                  q: 'Can I submit a store or update info?',
                  a: 'Yes — use our contact form or reach out via email for updates and corrections.'
                },
                {
                  q: 'Do you track my location?',
                  a: 'Only when you opt-in, and only to rank nearby deals (demo mode).'
                }
              ].map((f) => (
                <div
                  key={f.q}
                  className={`rounded-xl p-5 border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
                >
                  <p className={`font-semibold ${darkMode ? 'text-cream' : 'text-navy'}`}>{f.q}</p>
                  <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} mt-2`}>{f.a}</p>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <button type="button" className="button-secondary button-3d" onClick={() => toast.success('Contact form coming soon')}> 
                Contact support
              </button>
            </div>
          </div>
        </div>
      </SectionShell>

      <SectionShell
        id="partner"
        title="Partner With Us"
        subtitle="Business onboarding for store owners, advertising opportunities, and partnership inquiries."
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className={`rounded-2xl p-6 md:p-8 ${baseCard}`}>
            <h3 className={`font-display text-2xl font-bold ${darkMode ? 'text-cream' : 'text-navy'}`}>
              Store owner registration
            </h3>
            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} mt-2`}>
              Share your details — we’ll contact you with next steps (demo flow).
            </p>

            <form
              className="mt-6 space-y-4"
              onSubmit={(e) => {
                e.preventDefault()
                toast.success('Thanks! Our team will reach out shortly (demo).')
                e.currentTarget.reset()
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  required
                  name="name"
                  placeholder="Full name"
                  className="w-full px-4 py-3 rounded-lg text-navy focus:outline-none focus:ring-2 focus:ring-gold"
                />
                <input
                  required
                  name="email"
                  type="email"
                  placeholder="Email"
                  className="w-full px-4 py-3 rounded-lg text-navy focus:outline-none focus:ring-2 focus:ring-gold"
                />
              </div>
              <input
                required
                name="business"
                placeholder="Brand / company"
                className="w-full px-4 py-3 rounded-lg text-navy focus:outline-none focus:ring-2 focus:ring-gold"
              />
              <textarea
                name="message"
                rows={4}
                placeholder="Tell us what you want to launch…"
                className="w-full px-4 py-3 rounded-lg text-navy focus:outline-none focus:ring-2 focus:ring-gold"
              />
              <button type="submit" className="button-primary button-3d w-full">
                Submit inquiry
              </button>
            </form>
          </div>

          <div className={`rounded-2xl p-6 md:p-8 ${baseCard}`}>
            <h3 className={`font-display text-2xl font-bold ${darkMode ? 'text-cream' : 'text-navy'}`}>
              Why partner
            </h3>
            <div className="mt-6 space-y-4">
              {[
                { title: 'Premium placement', desc: 'Featured banners, spotlight stories, and curated collections.' },
                { title: 'Real-time updates', desc: 'Fast content refresh for promos and new openings.' },
                { title: 'Future-ready growth', desc: 'Built for e-commerce, AR previews, and multi-city expansion.' }
              ].map((x) => (
                <div key={x.title} className={`rounded-xl p-5 border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <p className={`font-semibold ${darkMode ? 'text-cream' : 'text-navy'}`}>{x.title}</p>
                  <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} mt-2`}>{x.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SectionShell>

      <SectionShell
        id="analytics"
        title="Analytics Preview"
        subtitle="Public stats for transparency and engagement — most visited malls, trending stores, and popular categories (demo)."
      >
        <div className={`rounded-2xl p-6 md:p-8 ${baseCard}`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className={`rounded-xl p-6 border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <p className={`text-sm font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Interactions</p>
              <p className={`font-display text-4xl font-bold mt-2 ${darkMode ? 'text-cream' : 'text-navy'}`}>{interactionsCount}</p>
              <p className={`text-sm mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Views across malls, stores, and products</p>
            </div>
            <div className={`rounded-xl p-6 border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <p className={`text-sm font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Saved items</p>
              <p className={`font-display text-4xl font-bold mt-2 ${darkMode ? 'text-cream' : 'text-navy'}`}>{savedCount}</p>
              <p className={`text-sm mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Favorites in user profiles</p>
            </div>
            <div className={`rounded-xl p-6 border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <p className={`text-sm font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Top categories</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {discoverData.interestCategories.slice(0, 4).map((c) => (
                  <span key={c} className="px-3 py-1 rounded-full bg-gold/15 text-gold text-xs font-semibold">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className={`rounded-xl p-6 border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <h3 className={`font-display text-xl font-bold ${darkMode ? 'text-cream' : 'text-navy'}`}>Most visited malls</h3>
              <div className="mt-4 space-y-3">
                {getTopBehaviorIds('mall', 3).map((id) => mallsData.find((m) => m.id === id)).filter(Boolean).map((mall) => (
                  <button
                    key={mall.id}
                    type="button"
                    className={`w-full text-left rounded-lg p-4 transition-colors ${darkMode ? 'bg-gray-900/40 hover:bg-gray-900/60' : 'bg-cream hover:bg-cream/80'}`}
                    onClick={() => navigate(`/mall/${mall.id}`)}
                  >
                    <p className={`font-semibold ${darkMode ? 'text-cream' : 'text-navy'}`}>{mall.name}</p>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{mall.location}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className={`rounded-xl p-6 border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <h3 className={`font-display text-xl font-bold ${darkMode ? 'text-cream' : 'text-navy'}`}>Trending stores</h3>
              <div className="mt-4 space-y-3">
                {getTopBehaviorIds('store', 3).map((id) => storesData.find((s) => s.id === id)).filter(Boolean).map((store) => (
                  <button
                    key={store.id}
                    type="button"
                    className={`w-full text-left rounded-lg p-4 transition-colors ${darkMode ? 'bg-gray-900/40 hover:bg-gray-900/60' : 'bg-cream hover:bg-cream/80'}`}
                    onClick={() => navigate(`/mall/${store.mallId}/store/${store.id}`)}
                  >
                    <p className={`font-semibold ${darkMode ? 'text-cream' : 'text-navy'}`}>{store.name}</p>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{store.category}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </SectionShell>

      <SectionShell
        id="future"
        title="Future Innovations"
        subtitle="A transparent roadmap: beta programs, upcoming tech, and future-ready experiences."
      >
        <div className={`rounded-2xl p-6 md:p-8 ${baseCard}`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'Crowd trends (beta)',
                desc: 'Real-time occupancy and predicted busy hours.'
              },
              {
                title: 'AR navigation',
                desc: 'Indoor directions from entry to your store.'
              },
              {
                title: 'Smart notifications',
                desc: 'Opt-in alerts for deals near you and your favorite brands.'
              }
            ].map((x) => (
              <div key={x.title} className={`rounded-xl p-6 border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <h3 className={`font-display text-xl font-bold ${darkMode ? 'text-cream' : 'text-navy'}`}>
                  {x.title}
                </h3>
                <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} mt-2`}>{x.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </SectionShell>

      {selectedProduct ? (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          relatedProducts={productsData.filter((p) => p.id !== selectedProduct.id).slice(0, 4)}
        />
      ) : null}
    </div>
  )
}
