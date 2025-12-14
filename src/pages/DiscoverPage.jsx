import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles, TrendingUp } from 'lucide-react'

import AutoSuggestSearch from '../components/AutoSuggestSearch'
import SectionHeader from '../components/ui/SectionHeader'
import GlassCard from '../components/ui/GlassCard'
import FeaturedCarousel from '../components/FeaturedCarousel'
import MallCard from '../components/MallCard'
import StoreCard from '../components/StoreCard'

import malls from '../data/malls.json'
import stores from '../data/stores.json'
import products from '../data/products.json'

import useFavorites from '../hooks/useFavorites'
import useTrending from '../hooks/useTrending'

export default function DiscoverPage() {
  const { favorites } = useFavorites()
  const { getTop } = useTrending()

  const trendingMalls = useMemo(() => {
    const ids = getTop('malls', 6).map((x) => x.id)
    const items = ids.map((id) => malls.find((m) => m.id === id)).filter(Boolean)
    return items.length ? items : malls.filter((m) => m.featured).slice(0, 3)
  }, [getTop])

  const trendingStores = useMemo(() => {
    const ids = getTop('stores', 10).map((x) => x.id)
    const items = ids.map((id) => stores.find((s) => s.id === id)).filter(Boolean)
    return items.length ? items : stores.slice(0, 10)
  }, [getTop])

  const recommended = useMemo(() => {
    const favStoreCats = favorites.stores
      .map((id) => stores.find((s) => s.id === id)?.category)
      .filter(Boolean)

    const categoryPool = favStoreCats.length ? Array.from(new Set(favStoreCats)) : ['Fashion', 'Electronics', 'Sportswear']

    const recommendedStores = stores
      .filter((s) => categoryPool.includes(s.category))
      .filter((s) => !favorites.stores.includes(s.id))
      .slice(0, 8)

    const recommendedMalls = malls
      .filter((m) => m.status !== 'coming_soon')
      .slice(0, 3)

    const recommendedProducts = products.slice(0, 6)

    return { recommendedStores, recommendedMalls, recommendedProducts }
  }, [favorites.stores])

  return (
    <div className="section-padding max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
        <div>
          <p className="text-xs tracking-[0.25em] uppercase text-neonCyan/80 mb-3">Discover</p>
          <h1 className="heading-large">Smart Discovery Hub</h1>
          <p className="text-subtle mt-4 max-w-2xl">
            Search with auto-suggestions, explore trending places, and get AI-style recommendations based on behavior (local demo engine).
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link to="/favorites" className="button-secondary">
            Saved
          </Link>
          <Link to="/profile" className="button-primary">
            Your dashboard
          </Link>
        </div>
      </div>

      <div className="max-w-3xl">
        <AutoSuggestSearch malls={malls} stores={stores} products={products} />
      </div>

      <section className="mt-12">
        <SectionHeader
          eyebrow="AI Recommendations"
          title="Personalized picks"
          description="These recommendations improve as you favorite and explore more malls and stores."
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <GlassCard className="p-6">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-white">Recommended malls</p>
              <Sparkles className="w-5 h-5 text-neonCyan" />
            </div>
            <div className="mt-4 space-y-4">
              {recommended.recommendedMalls.map((m) => (
                <Link key={m.id} to={`/mall/${m.id}`} className="block rounded-2xl bg-white/5 border border-white/10 p-4 hover:bg-white/10 transition">
                  <p className="font-semibold text-white">{m.name}</p>
                  <p className="text-white/60 text-sm">{m.location}</p>
                </Link>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="p-6 lg:col-span-2">
            <p className="font-semibold text-white">Recommended stores</p>
            <p className="text-white/60 text-sm mt-1">Based on your favorite categories.</p>
            <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
              {recommended.recommendedStores.map((s) => (
                <Link key={s.id} to={`/mall/${s.mallId}/store/${s.id}`} className="rounded-2xl bg-white/5 border border-white/10 p-4 hover:bg-white/10 transition">
                  <p className="font-semibold text-white">{s.name}</p>
                  <p className="text-white/60 text-sm">{s.category} • Floor {s.floor}</p>
                </Link>
              ))}
            </div>
          </GlassCard>
        </div>
      </section>

      <section className="mt-14">
        <SectionHeader
          eyebrow="Trending"
          title="Trending malls"
          description="Most visited and interacted-with destinations (generated locally)."
          right={
            <div className="inline-flex items-center gap-2 text-white/60 text-sm">
              <TrendingUp className="w-4 h-4" />
              Updates as users explore
            </div>
          }
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trendingMalls.map((mall) => (
            <MallCard key={mall.id} mall={mall} />
          ))}
        </div>
      </section>

      <section className="mt-14">
        <FeaturedCarousel title="Trending stores">
          {trendingStores.map((store) => (
            <div key={store.id} className="min-w-[280px] snap-start">
              <StoreCard store={store} mallId={store.mallId} />
            </div>
          ))}
        </FeaturedCarousel>
      </section>

      <section className="mt-14">
        <SectionHeader
          eyebrow="Future-ready"
          title="What’s next"
          description="Architecture placeholders for AI chat assistant, voice search, indoor 3D mapping, and AR shopping."
          right={
            <Link to="/future" className="button-secondary inline-flex items-center gap-2">
              Roadmap <ArrowRight className="w-4 h-4" />
            </Link>
          }
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[{ t: 'AI chat assistant', d: 'Ask questions, plan routes, and get personalized offers.' }, { t: 'Voice search', d: 'Fast discovery on mobile, hands-free.' }, { t: 'AR previews', d: 'Try products and navigate the mall in augmented reality.' }].map(
            (x) => (
              <GlassCard key={x.t} className="p-6">
                <p className="font-semibold text-white">{x.t}</p>
                <p className="text-white/60 text-sm mt-2">{x.d}</p>
              </GlassCard>
            )
          )}
        </div>
      </section>
    </div>
  )
}
