import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useTheme } from '../contexts/ThemeContext'
import { useLanguage } from '../contexts/LanguageContext'
import mallsData from '../data/malls.json'
import storesData from '../data/stores.json'
import productsData from '../data/products.json'
import ProductModal from './ProductModal'
import RealTimeMap from './RealTimeMap'
import {
  trackBehavior
} from '../services/behavior'

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
  const { t } = useLanguage()
  const navigate = useNavigate()

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

  return (
    <div>
      {/* Real-time Map Section */}
      <RealTimeMap />

      <SectionShell
        id="experiences"
        title={t('sections.experiences')}
        subtitle={t('sections.experiencesSubtitle')}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
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
        title={t('sections.eventsPromotions')}
        subtitle={t('sections.eventsPromotionsSubtitle')}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
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
                  className="button-primary button-3d text-sm"
                  onClick={() => navigate(`/mall/${promo.mallId}/store/${promo.store.id}`)}
                >
                  {t('buttons.viewStore')} →
                </button>
                <button
                  type="button"
                  className="button-secondary button-3d text-sm"
                  onClick={() => {
                    trackBehavior({ type: 'store', id: promo.store.id, category: promo.store.category })
                    toast.success('Deal saved (demo)')
                  }}
                >
                  {t('buttons.saveDeal')}
                </button>
              </div>
            </div>
          ))}
        </div>
      </SectionShell>

      <SectionShell
        id="new-openings"
        title={t('sections.newOpenings')}
        subtitle={t('sections.newOpeningsSubtitle')}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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
        id="insights"
        title={t('sections.insights')}
        subtitle={t('sections.insightsSubtitle')}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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
        title={t('sections.virtualTour')}
        subtitle={t('sections.virtualTourSubtitle')}
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
              {t('buttons.launchDemo')}
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
        id="deals-near-you"
        title={t('sections.dealsNearYou')}
        subtitle={t('sections.dealsNearYouSubtitle')}
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
              className="button-primary button-3d w-full sm:w-auto"
              onClick={requestLocation}
              disabled={geoStatus.state === 'loading'}
            >
              {geoStatus.state === 'loading' ? t('buttons.locating') : t('buttons.enableLocation')}
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
        title={t('sections.sustainability')}
        subtitle={t('sections.sustainabilitySubtitle')}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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
        title={t('sections.newsUpdates')}
        subtitle={t('sections.newsUpdatesSubtitle')}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
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
        title={t('sections.helpCenter')}
        subtitle={t('sections.helpCenterSubtitle')}
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
                {t('buttons.send')}
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
                {t('buttons.contactSupport')}
              </button>
            </div>
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
