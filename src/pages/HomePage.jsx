import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, BarChart3, MapPinned, Sparkles, TrendingUp } from 'lucide-react'

import HeroSection from '../components/HeroSection'
import MallCard from '../components/MallCard'
import StoreCard from '../components/StoreCard'

import FeaturedCarousel from '../components/FeaturedCarousel'
import SectionHeader from '../components/ui/SectionHeader'
import GlassCard from '../components/ui/GlassCard'

import mallsData from '../data/malls.json'
import storesData from '../data/stores.json'
import productsData from '../data/products.json'
import eventsData from '../data/events.json'
import experiencesData from '../data/experiences.json'
import brandsData from '../data/brands.json'
import collectionsData from '../data/collections.json'
import dealsData from '../data/deals.json'

import useTrending from '../hooks/useTrending'
import useFavorites from '../hooks/useFavorites'

const formatCountdown = (iso) => {
  const ms = new Date(iso).getTime() - Date.now()
  if (Number.isNaN(ms) || ms <= 0) return 'Live'
  const days = Math.floor(ms / (1000 * 60 * 60 * 24))
  const hrs = Math.floor((ms / (1000 * 60 * 60)) % 24)
  const mins = Math.floor((ms / (1000 * 60)) % 60)
  return `${days}d ${hrs}h ${mins}m`
}

export default function HomePage() {
  const { favorites } = useFavorites()
  const { getTop } = useTrending()

  const featuredMalls = useMemo(() => mallsData.slice(0, 6), [])

  const trending = useMemo(() => {
    const mallIds = getTop('malls', 6).map((x) => x.id)
    const storeIds = getTop('stores', 6).map((x) => x.id)
    const productIds = getTop('products', 6).map((x) => x.id)

    const malls = mallIds.map((id) => mallsData.find((m) => m.id === id)).filter(Boolean)
    const stores = storeIds.map((id) => storesData.find((s) => s.id === id)).filter(Boolean)
    const products = productIds.map((id) => productsData.find((p) => p.id === id)).filter(Boolean)

    return {
      malls: malls.length ? malls : mallsData.filter((m) => m.featured).slice(0, 3),
      stores: stores.length ? stores : storesData.slice(0, 6),
      products: products.length ? products : productsData.slice(0, 6),
    }
  }, [getTop])

  const recommendedStores = useMemo(() => {
    const favStoreCats = favorites.stores
      .map((id) => storesData.find((s) => s.id === id)?.category)
      .filter(Boolean)

    const categories = favStoreCats.length ? Array.from(new Set(favStoreCats)) : ['Fashion', 'Electronics', 'Sportswear']

    return storesData
      .filter((s) => categories.includes(s.category))
      .filter((s) => !favorites.stores.includes(s.id))
      .slice(0, 6)
  }, [favorites.stores])

  const topPicks = useMemo(() => {
    const familyMall = mallsData.find((m) => m.id === 'family-park')
    return [familyMall, ...mallsData.filter((m) => m.status === 'coming_soon').slice(0, 2)].filter(Boolean)
  }, [])

  const analyticsPreview = useMemo(() => {
    const malls = getTop('malls', 3)
    const stores = getTop('stores', 3)
    const products = getTop('products', 3)
    return { malls, stores, products }
  }, [getTop])

  const communityHighlights = useMemo(() => {
    if (typeof window === 'undefined') return []

    try {
      const keys = Object.keys(localStorage).filter((k) => k.startsWith('sme_reviews:'))
      const all = keys
        .flatMap((k) => {
          const raw = localStorage.getItem(k)
          const list = raw ? JSON.parse(raw) : []
          return Array.isArray(list) ? list : []
        })
        .filter((r) => r && r.comment)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

      return all.slice(0, 4)
    } catch {
      return []
    }
  }, [])

  return (
    <div className="min-h-screen">
      <HeroSection />

      {/* Discover Hub */}
      <section id="discover" className="section-padding max-w-6xl mx-auto">
        <SectionHeader
          eyebrow="Discover"
          title="Smart Discovery Hub"
          description="Personalized recommendations, trending picks, and fast search — designed to feel alive, premium, and constantly evolving."
          right={
            <Link to="/discover" className="button-secondary inline-flex items-center gap-2">
              Open Discover <ArrowRight className="w-4 h-4" />
            </Link>
          }
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <GlassCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs tracking-[0.25em] uppercase text-neonCyan/80">Recommended</p>
                <h3 className="heading-small mt-3">For you</h3>
              </div>
              <Sparkles className="w-6 h-6 text-neonCyan" />
            </div>
            <p className="text-white/60 mt-3 text-sm">Based on favorites and recent behavior (local demo model).</p>
            <div className="mt-5 space-y-3">
              {recommendedStores.slice(0, 3).map((s) => (
                <Link
                  key={s.id}
                  to={`/mall/${s.mallId}/store/${s.id}`}
                  className="block rounded-2xl bg-white/5 border border-white/10 px-4 py-3 hover:bg-white/10 transition"
                >
                  <p className="font-semibold text-white">{s.name}</p>
                  <p className="text-white/60 text-sm">{s.category} • Floor {s.floor}</p>
                </Link>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="p-6 lg:col-span-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs tracking-[0.25em] uppercase text-neonPink/80">Trending</p>
                <h3 className="heading-small mt-3">What’s hot right now</h3>
              </div>
              <TrendingUp className="w-6 h-6 text-neonPink" />
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              {trending.malls.slice(0, 3).map((mall) => (
                <Link key={mall.id} to={`/mall/${mall.id}`} className="group">
                  <div className="rounded-2xl overflow-hidden bg-white/5 border border-white/10 hover:bg-white/10 transition">
                    <img src={mall.image} alt={mall.name} className="h-28 w-full object-cover" loading="lazy" />
                    <div className="p-4">
                      <p className="font-semibold text-white group-hover:text-neonCyan transition">{mall.name}</p>
                      <p className="text-white/60 text-sm">{mall.location}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </GlassCard>
        </div>

        <div className="mt-10">
          <FeaturedCarousel title="Trending stores">
            {trending.stores.slice(0, 8).map((store) => (
              <div key={store.id} className="min-w-[280px] snap-start">
                <StoreCard store={store} mallId={store.mallId} />
              </div>
            ))}
          </FeaturedCarousel>
        </div>

        <div className="mt-10">
          <FeaturedCarousel title="Popular products">
            {trending.products.slice(0, 10).map((product) => {
              const store = storesData.find((s) => s.id === product.storeId)
              const href = store ? `/mall/${store.mallId}/store/${store.id}` : '/'

              return (
                <div key={product.id} className="min-w-[280px] snap-start">
                  <Link to={href} className="group block">
                    <div className="glass rounded-2xl overflow-hidden">
                      <div className="h-52 overflow-hidden bg-white/5">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                          loading="lazy"
                        />
                      </div>
                      <div className="p-6">
                        <p className="text-white/60 text-sm">{product.category}</p>
                        <p className="text-white font-semibold mt-2 group-hover:text-neonCyan transition">{product.name}</p>
                        <p className="text-white/60 text-sm mt-2">Open in store →</p>
                      </div>
                    </div>
                  </Link>
                </div>
              )
            })}
          </FeaturedCarousel>
          <p className="text-white/40 text-xs mt-2">Open any store to explore products with interactive previews and reviews.</p>
        </div>
      </section>

      {/* Featured Malls */}
      <section id="malls" className="section-padding max-w-6xl mx-auto">
        <SectionHeader
          eyebrow="Top Destinations"
          title="Featured Shopping Destinations"
          description="From premium fashion to electronics — discover Samarkand’s next-generation retail landscape."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredMalls.map((mall) => (
            <MallCard key={mall.id} mall={mall} />
          ))}
        </div>
      </section>

      {/* Explore Map */}
      <section className="section-padding max-w-6xl mx-auto">
        <SectionHeader
          eyebrow="Explore Map"
          title="Interactive Experience Map"
          description="Map-based browsing with mall clustering, store-level pinpoints, and category filters — ready for deeper GIS integration."
          right={
            <Link to="/map" className="button-secondary inline-flex items-center gap-2">
              Open map <MapPinned className="w-4 h-4" />
            </Link>
          }
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <GlassCard className="p-6 md:col-span-2">
            <div className="rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-br from-white/5 to-white/0 p-10 relative">
              <div className="absolute inset-0 opacity-70" style={{ backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(34,211,238,0.25), transparent 55%), radial-gradient(circle at 80% 20%, rgba(124,92,255,0.25), transparent 55%)' }} />
              <div className="relative">
                <p className="text-white/60">Samarkand city map (preview)</p>
                <p className="text-white font-semibold text-2xl mt-2">Cluster malls. Pin stores. Filter categories.</p>
                <p className="text-white/60 mt-3 max-w-xl">This preview is designed for performance today and full indoor mapping tomorrow.</p>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <h3 className="heading-small">Quick filters</h3>
            <p className="text-white/60 mt-2 text-sm">Jump into a category to see it on the map.</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {['Fashion', 'Electronics', 'Sportswear', 'Dining', 'Kids'].map((c) => (
                <Link
                  key={c}
                  to={`/map?category=${encodeURIComponent(c)}`}
                  className="px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-white/75 hover:bg-white/10 transition"
                >
                  {c}
                </Link>
              ))}
            </div>
          </GlassCard>
        </div>
      </section>

      {/* Experiences */}
      <section className="section-padding max-w-6xl mx-auto">
        <SectionHeader
          eyebrow="Experiences"
          title="Lifestyle & Entertainment"
          description="Beyond shopping — cinema, kids zones, food courts, and events that make the mall feel like a destination."
          right={
            <Link to="/experiences" className="button-secondary inline-flex items-center gap-2">
              Explore <ArrowRight className="w-4 h-4" />
            </Link>
          }
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {experiencesData.map((x) => (
            <GlassCard key={x.id} className="overflow-hidden">
              <img src={x.image} alt={x.title} className="h-40 w-full object-cover" loading="lazy" />
              <div className="p-6">
                <p className="text-2xl">{x.icon}</p>
                <p className="font-semibold text-white mt-3">{x.title}</p>
                <p className="text-white/60 text-sm mt-2">{x.description}</p>
              </div>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* Events & Promotions */}
      <section className="section-padding max-w-6xl mx-auto">
        <SectionHeader
          eyebrow="Events & Promotions"
          title="Live moments, limited-time offers"
          description="Upcoming events, seasonal discounts, and countdown timers — all in one place."
          right={
            <Link to="/events" className="button-secondary inline-flex items-center gap-2">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          }
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {eventsData.map((ev) => (
            <GlassCard key={ev.id} className="overflow-hidden">
              <img src={ev.image} alt={ev.title} className="h-40 w-full object-cover" loading="lazy" />
              <div className="p-6">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold text-white">{ev.title}</p>
                  <span className="text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/70">
                    {ev.type}
                  </span>
                </div>
                <p className="text-white/60 text-sm mt-2">{ev.description}</p>
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-white/60 text-sm">Ends in</p>
                  <p className="text-white font-semibold">{formatCountdown(ev.endsAt)}</p>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* New Openings */}
      <section className="section-padding max-w-6xl mx-auto">
        <SectionHeader
          eyebrow="New Openings"
          title="Fresh arrivals"
          description="Newly opened stores and upcoming malls — with early access previews."
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <GlassCard className="p-6 lg:col-span-2">
            <FeaturedCarousel title="New stores">
              {storesData.slice(0, 8).map((s) => (
                <div key={s.id} className="min-w-[280px] snap-start">
                  <StoreCard store={s} mallId={s.mallId} />
                </div>
              ))}
            </FeaturedCarousel>
          </GlassCard>
          <GlassCard className="p-6">
            <p className="font-semibold text-white">Opening timeline</p>
            <p className="text-white/60 text-sm mt-2">Upcoming malls are marked as “Coming Soon”.</p>
            <div className="mt-5 space-y-3">
              {mallsData.filter((m) => m.status === 'coming_soon').slice(0, 3).map((m) => (
                <div key={m.id} className="rounded-2xl bg-white/5 border border-white/10 px-4 py-3">
                  <p className="font-semibold text-white">{m.name}</p>
                  <p className="text-white/60 text-sm">Preview experience — future-ready</p>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </section>

      {/* Top Picks */}
      <section className="section-padding max-w-6xl mx-auto">
        <SectionHeader
          eyebrow="Top Picks"
          title="Editor’s curated recommendations"
          description="A premium set of destinations — best for families, fashion, and the next big thing."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {topPicks.map((m) => (
            <Link key={m.id} to={`/mall/${m.id}`} className="group">
              <GlassCard className="overflow-hidden">
                <img src={m.image} alt={m.name} className="h-44 w-full object-cover group-hover:scale-[1.02] transition" loading="lazy" />
                <div className="p-6">
                  <p className="text-xs tracking-[0.25em] uppercase text-white/50">Editor’s choice</p>
                  <p className="font-semibold text-white mt-3 group-hover:text-neonCyan transition">{m.name}</p>
                  <p className="text-white/60 text-sm mt-2">{m.status === 'coming_soon' ? 'Coming soon' : 'Open now'}</p>
                </div>
              </GlassCard>
            </Link>
          ))}
        </div>
      </section>

      {/* Collections */}
      <section className="section-padding max-w-6xl mx-auto">
        <SectionHeader
          eyebrow="Collections"
          title="Theme-based discovery"
          description="Seasonal campaigns and curated product + store journeys."
        />

        <FeaturedCarousel>
          {collectionsData.map((c) => (
            <div key={c.id} className="min-w-[320px] snap-start">
              <GlassCard className="overflow-hidden">
                <img src={c.image} alt={c.title} className="h-40 w-full object-cover" loading="lazy" />
                <div className="p-6">
                  <p className="text-xs tracking-[0.25em] uppercase text-white/50">{c.theme}</p>
                  <p className="font-semibold text-white mt-3">{c.title}</p>
                  <p className="text-white/60 text-sm mt-2">{c.description}</p>
                </div>
              </GlassCard>
            </div>
          ))}
        </FeaturedCarousel>
      </section>

      {/* Mall Insights */}
      <section className="section-padding max-w-6xl mx-auto">
        <SectionHeader
          eyebrow="Mall Insights"
          title="Data-driven moments"
          description="Peak hours, popular categories, and future-ready crowd trends — built to scale into real analytics."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <GlassCard className="p-6">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-white">Peak visiting hours</p>
              <BarChart3 className="w-5 h-5 text-neonCyan" />
            </div>
            <p className="text-white/60 text-sm mt-2">Most active: 18:00–21:00</p>
            <div className="mt-4 grid grid-cols-6 gap-2">
              {[8, 10, 12, 16, 22, 28].map((h, idx) => (
                <div key={idx} className="h-12 rounded-xl bg-white/5 border border-white/10 flex items-end overflow-hidden">
                  <div className="w-full bg-neonCyan/40" style={{ height: `${h}%` }} />
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <p className="font-semibold text-white">Popular categories</p>
            <p className="text-white/60 text-sm mt-2">Fashion • Electronics • Beauty</p>
            <div className="mt-5 space-y-2">
              {['Fashion', 'Electronics', 'Beauty & Cosmetics'].map((c) => (
                <div key={c} className="flex items-center justify-between rounded-2xl bg-white/5 border border-white/10 px-4 py-3">
                  <p className="text-white/80">{c}</p>
                  <span className="text-xs text-white/60">Trending</span>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <p className="font-semibold text-white">Crowd trends</p>
            <p className="text-white/60 text-sm mt-2">AR-ready + sensor-ready placeholders.</p>
            <div className="mt-5 rounded-2xl bg-white/5 border border-white/10 p-4">
              <p className="text-white/70">Live crowd predictions: coming soon</p>
              <p className="text-xs text-white/40 mt-1">Designed for future integrations.</p>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* Virtual Tour */}
      <section className="section-padding max-w-6xl mx-auto">
        <SectionHeader
          eyebrow="Virtual Tour"
          title="Immersive digital experience"
          description="360° tours, walkthrough videos, and AR-ready placeholders — for a premium feel today and the next step tomorrow."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <GlassCard className="p-6 overflow-hidden">
            <p className="font-semibold text-white">360° Tour (placeholder)</p>
            <p className="text-white/60 text-sm mt-2">Embed-ready for Matterport / 360 media.</p>
            <div className="mt-5 rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/0 h-56 flex items-center justify-center">
              <p className="text-white/50">360° viewer coming soon</p>
            </div>
          </GlassCard>
          <GlassCard className="p-6 overflow-hidden">
            <p className="font-semibold text-white">Video Walkthrough (placeholder)</p>
            <p className="text-white/60 text-sm mt-2">High-quality storytelling and events.</p>
            <div className="mt-5 rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/0 h-56 flex items-center justify-center">
              <p className="text-white/50">Video embed coming soon</p>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* Community & Reviews */}
      <section className="section-padding max-w-6xl mx-auto">
        <SectionHeader
          eyebrow="Community & Reviews"
          title="Real people. Real experiences."
          description="Ratings, reviews with photos, and community highlights — powered by user profiles."
          right={
            <Link to="/profile" className="button-secondary inline-flex items-center gap-2">
              Open dashboard <ArrowRight className="w-4 h-4" />
            </Link>
          }
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {communityHighlights.length === 0 ? (
            [0, 1, 2, 3].map((i) => (
              <GlassCard key={i} className="p-6">
                <p className="font-semibold text-white">Your review here</p>
                <p className="text-white/60 text-sm mt-2">Sign in and post reviews with ratings and photos.</p>
                <Link to="/login" className="button-primary mt-4 inline-block">Sign in</Link>
              </GlassCard>
            ))
          ) : (
            communityHighlights.map((r) => (
              <GlassCard key={r.id} className="p-6">
                <p className="text-white font-semibold">{r.userName || 'Anonymous'}</p>
                <p className="text-white/50 text-xs mt-1">{new Date(r.createdAt).toLocaleDateString()}</p>
                <p className="text-white/70 text-sm mt-3 line-clamp-3">{r.comment}</p>
                {r.imageUrl && (
                  <img src={r.imageUrl} alt="Review" className="mt-4 h-32 w-full object-cover rounded-2xl border border-white/10" loading="lazy" />
                )}
              </GlassCard>
            ))
          )}
        </div>
      </section>

      {/* Brand Spotlight */}
      <section className="section-padding max-w-6xl mx-auto">
        <SectionHeader
          eyebrow="Brand Spotlight"
          title="Stories behind flagship brands"
          description="Brand stories, exclusive drops, and interviews — editorially curated."
        />

        <FeaturedCarousel>
          {brandsData.map((b) => (
            <div key={b.id} className="min-w-[340px] snap-start">
              <GlassCard className="overflow-hidden">
                <img src={b.image} alt={b.name} className="h-44 w-full object-cover" loading="lazy" />
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-white">{b.name}</p>
                    <span className="text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/70">
                      {b.highlight}
                    </span>
                  </div>
                  <p className="text-white/60 text-sm mt-2">{b.story}</p>
                </div>
              </GlassCard>
            </div>
          ))}
        </FeaturedCarousel>
      </section>

      {/* Deals Near You */}
      <section className="section-padding max-w-6xl mx-auto">
        <SectionHeader
          eyebrow="Deals Near You"
          title="Location-aware promotions"
          description="Geo-targeted deals and personalized notifications (ready for geolocation + push)."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {dealsData.map((d) => (
            <GlassCard key={d.id} className="p-6">
              <div className="flex items-center justify-between gap-3">
                <p className="font-semibold text-white">{d.title}</p>
                <span className="text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/70">
                  {d.category}
                </span>
              </div>
              <p className="text-white/60 text-sm mt-2">{d.description}</p>
              <p className="text-white/60 text-sm mt-4">Expires: {new Date(d.expiresAt).toLocaleDateString()}</p>
            </GlassCard>
          ))}

          <GlassCard className="p-6">
            <p className="font-semibold text-white">Personalized notifications</p>
            <p className="text-white/60 text-sm mt-2">Enable notifications to get deals when you’re near a mall (future-ready).</p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Link to="/profile" className="button-secondary">
                Open notification center
              </Link>
              <Link to="/discover" className="button-primary">
                Discover now
              </Link>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* Sustainability */}
      <section className="section-padding max-w-6xl mx-auto">
        <SectionHeader
          eyebrow="Sustainability"
          title="Eco-conscious initiatives"
          description="Green malls, sustainable brands, and recycling programs — a foundation for real impact."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: 'Green mall standards', desc: 'Energy-aware lighting, waste reduction, and smart infrastructure.' },
            { title: 'Sustainable brands', desc: 'Highlighting eco-conscious materials and ethical supply chains.' },
            { title: 'Recycling programs', desc: 'Drop-off points and community campaigns (future-ready).' },
          ].map((x) => (
            <GlassCard key={x.title} className="p-6">
              <p className="font-semibold text-white">{x.title}</p>
              <p className="text-white/60 text-sm mt-2">{x.desc}</p>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* Help + Partner */}
      <section className="section-padding max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <GlassCard className="p-8">
            <p className="text-xs tracking-[0.25em] uppercase text-white/50">Help Center</p>
            <h3 className="heading-small mt-3">Support that feels modern</h3>
            <p className="text-white/60 mt-3">
              AI chat assistant placeholder, FAQs, and contact forms — designed for a world-class support experience.
            </p>
            <Link to="/help" className="button-secondary mt-6 inline-flex items-center gap-2">
              Open Help <ArrowRight className="w-4 h-4" />
            </Link>
          </GlassCard>

          <GlassCard className="p-8">
            <p className="text-xs tracking-[0.25em] uppercase text-white/50">Partner With Us</p>
            <h3 className="heading-small mt-3">Business onboarding</h3>
            <p className="text-white/60 mt-3">Store owner registration, advertising opportunities, and partnership inquiries.</p>
            <Link to="/partner" className="button-primary mt-6 inline-flex items-center gap-2">
              Become a partner <ArrowRight className="w-4 h-4" />
            </Link>
          </GlassCard>
        </div>
      </section>

      {/* Analytics Preview */}
      <section className="section-padding max-w-6xl mx-auto">
        <SectionHeader
          eyebrow="Analytics Preview"
          title="Public stats"
          description="Transparency builds trust: most visited malls, trending stores, and popular categories."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <GlassCard className="p-6">
            <p className="font-semibold text-white">Most visited malls</p>
            <div className="mt-4 space-y-2">
              {analyticsPreview.malls.length === 0 ? (
                <p className="text-white/60 text-sm">Explore a few malls to generate trends.</p>
              ) : (
                analyticsPreview.malls.map((x) => (
                  <div key={x.id} className="flex items-center justify-between rounded-2xl bg-white/5 border border-white/10 px-4 py-3">
                    <p className="text-white/80 text-sm">{mallsData.find((m) => m.id === x.id)?.name || x.id}</p>
                    <p className="text-white/60 text-sm">{x.score}</p>
                  </div>
                ))
              )}
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <p className="font-semibold text-white">Trending stores</p>
            <div className="mt-4 space-y-2">
              {analyticsPreview.stores.length === 0 ? (
                <p className="text-white/60 text-sm">Browse store pages to generate trends.</p>
              ) : (
                analyticsPreview.stores.map((x) => (
                  <div key={x.id} className="flex items-center justify-between rounded-2xl bg-white/5 border border-white/10 px-4 py-3">
                    <p className="text-white/80 text-sm">{storesData.find((s) => s.id === x.id)?.name || x.id}</p>
                    <p className="text-white/60 text-sm">{x.score}</p>
                  </div>
                ))
              )}
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <p className="font-semibold text-white">Popular categories</p>
            <div className="mt-4 space-y-2">
              {['Fashion', 'Electronics', 'Sportswear'].map((c) => (
                <div key={c} className="flex items-center justify-between rounded-2xl bg-white/5 border border-white/10 px-4 py-3">
                  <p className="text-white/80 text-sm">{c}</p>
                  <p className="text-white/60 text-sm">Hot</p>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </section>

      {/* Future Innovations */}
      <section className="section-padding max-w-6xl mx-auto">
        <SectionHeader
          eyebrow="Future Innovations"
          title="Vision-driven roadmap"
          description="Architecture prepared for e-commerce, AR previews, AI assistant, voice search, and multi-city expansion."
          right={
            <Link to="/future" className="button-secondary inline-flex items-center gap-2">
              View roadmap <ArrowRight className="w-4 h-4" />
            </Link>
          }
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: 'AI Chat Assistant', desc: 'Mall concierge: Q&A, navigation, offers, and smart planning.' },
            { title: 'Voice Search', desc: 'Hands-free discovery for mobile-first navigation.' },
            { title: 'E-commerce Integration', desc: 'Storefronts, carts, checkout, and delivery options.' },
          ].map((x) => (
            <GlassCard key={x.title} className="p-6">
              <p className="font-semibold text-white">{x.title}</p>
              <p className="text-white/60 text-sm mt-2">{x.desc}</p>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* About */}
      <section className="section-padding max-w-6xl mx-auto">
        <SectionHeader
          eyebrow="Story"
          title="A premium guide to Samarkand’s retail"
          description="We combine modern discovery with cultural storytelling — highlighting mall history, popular stores, and seasonal campaigns."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <GlassCard className="p-6 md:col-span-2">
            <p className="text-white/70 leading-relaxed">
              Samarkand Mall Explorer is designed as a next-generation mall discovery platform: immersive, intelligent, community-driven, and scalable.
              From smart search to virtual tours and insights, every section is built to feel premium, fast, and ready for real-world deployment.
            </p>
          </GlassCard>
          <GlassCard className="p-6">
            <p className="font-semibold text-white">Get started</p>
            <p className="text-white/60 text-sm mt-2">Create a profile to save favorites and unlock personalization.</p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Link to="/register" className="button-primary">
                Register
              </Link>
              <Link to="/profile" className="button-secondary">
                Profile
              </Link>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="section-padding max-w-6xl mx-auto">
        <SectionHeader
          eyebrow="Contact"
          title="Get in touch"
          description="Questions, feedback, or partnership ideas — we’re here to help."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { k: 'Phone', v: '+998 (66) 233-30-30' },
            { k: 'Email', v: 'info@samarkandmall.uz' },
            { k: 'Location', v: 'Samarkand, Uzbekistan' },
          ].map((x) => (
            <GlassCard key={x.k} className="p-6">
              <p className="text-white/60 text-sm">{x.k}</p>
              <p className="text-white font-semibold mt-2">{x.v}</p>
            </GlassCard>
          ))}
        </div>
      </section>
    </div>
  )
}
