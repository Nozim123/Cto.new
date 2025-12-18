import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTheme } from '../contexts/ThemeContext'
import { useLanguage } from '../contexts/LanguageContext'
import mallsData from '../data/malls.json'
import storesData from '../data/stores.json'

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

export default function PromotionsPage() {
  const { darkMode } = useTheme()
  const { t } = useLanguage()
  const baseNowRef = useRef(Date.now())
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(timer)
  }, [])

  const promos = useMemo(() => {
    const mallById = new Map(mallsData.map((m) => [m.id, m]))

    return storesData
      .filter((s) => s.hasPromo)
      .map((store) => {
        const seed = stableNumberFromString(store.id)
        const endsInDays = 1 + (seed % 9)
        const endsAt = baseNowRef.current + endsInDays * 24 * 60 * 60 * 1000

        return {
          store,
          mall: mallById.get(store.mallId),
          endsAt
        }
      })
      .sort((a, b) => a.endsAt - b.endsAt)
  }, [])

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-primary text-white' : 'bg-cream text-gray-900'}`}>
      <div className="max-w-7xl mx-auto px-4 lg:px-8 pt-10 pb-20">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              {t('promotions.title') || "Today's Deals"}
            </h1>
            <p className={`${darkMode ? 'text-white/70' : 'text-gray-600'} max-w-2xl`}>
              {t('promotions.subtitle') ||
                'Flash sales, store discounts, and mall-wide campaigns — updated in real time.'}
            </p>
          </div>
          <Link
            to="/"
            className="text-sm text-purple-700 hover:text-purple-600 dark:text-purple-200 dark:hover:text-purple-100 hover:underline"
          >
            {t('buttons.backToHome') || 'Back to Home'}
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {promos.map(({ store, mall, endsAt }) => {
            const endsIn = endsAt - now
            return (
              <Link
                key={store.id}
                to={`/mall/${store.mallId}/store/${store.id}`}
                className="group rounded-3xl overflow-hidden border border-gray-200 bg-white hover:bg-gray-50 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10 transition-all hover:-translate-y-1"
              >
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={store.heroImage || store.image}
                    alt={store.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                  <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-red-500/90 text-white text-xs font-bold">
                    {store.promoDiscount || t('promotions.deal') || 'Deal'}
                  </div>

                  <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-black/40 border border-white/10 text-white text-xs font-semibold backdrop-blur-md">
                    ⏳ {formatCountdown(endsIn)}
                  </div>

                  <div className="absolute bottom-4 left-4 flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-white/90 p-2 border border-white/30">
                      <img
                        src={store.logo}
                        alt={store.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div>
                      <p className="text-white font-semibold leading-tight">{store.name}</p>
                      <p className="text-white/70 text-xs">
                        {mall?.name || ''} • {t('map.floor') || 'Floor'} {store.floor}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-5">
                  <p className="text-sm text-gray-900 dark:text-white/90 font-semibold mb-1">
                    {store.promoTitle}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-white/70 line-clamp-2 mb-4">
                    {store.promoDescription}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-purple-700 bg-purple-500/10 border border-purple-500/20 dark:text-purple-200 dark:bg-purple-500/15 dark:border-purple-500/25 px-2 py-1 rounded-full">
                      {store.category}
                    </span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-purple-700 dark:group-hover:text-purple-200 transition-colors">
                      {t('promotions.cta') || 'View offer'} →
                    </span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {promos.length === 0 ? (
          <div className="text-center py-20 rounded-3xl border border-gray-200 bg-white dark:border-white/10 dark:bg-white/5 mt-10">
            <div className="text-6xl mb-4">🎁</div>
            <h2 className="text-xl font-semibold mb-2">
              {t('promotions.noneTitle') || 'No active promotions'}
            </h2>
            <p className={darkMode ? 'text-white/70' : 'text-gray-600'}>
              {t('promotions.noneSubtitle') || 'Check back soon for new deals and campaigns.'}
            </p>
          </div>
        ) : null}
      </div>
    </div>
  )
}
