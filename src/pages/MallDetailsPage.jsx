import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Heart, MapPinned } from 'lucide-react'

import mallsData from '../data/malls.json'
import storesData from '../data/stores.json'

import StoreCard from '../components/StoreCard'
import FeaturedCarousel from '../components/FeaturedCarousel'
import IndoorMap from '../components/IndoorMap'
import Reviews from '../components/Reviews'
import ShareButtons from '../components/ShareButtons'
import GlassCard from '../components/ui/GlassCard'
import SectionHeader from '../components/ui/SectionHeader'

import useFavorites from '../hooks/useFavorites'
import useActivity from '../hooks/useActivity'

export default function MallDetailsPage() {
  const { mallId } = useParams()
  const navigate = useNavigate()
  const { isFavorite, toggleFavorite } = useFavorites()
  const { track } = useActivity()

  const [mall, setMall] = useState(null)

  useEffect(() => {
    const mallData = mallsData.find((m) => m.id === mallId)
    setMall(mallData || null)

    if (mallData) {
      track({ type: 'malls', id: mallData.id, title: `Viewed mall: ${mallData.name}` })
    }
  }, [mallId, track])

  const stores = useMemo(() => storesData.filter((s) => s.mallId === mallId), [mallId])

  const gallery = useMemo(() => {
    if (!mall) return []
    const base = mall.bannerImage || mall.image
    return [
      base,
      'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1524777313293-86d2ab467344?w=1200&h=800&fit=crop',
    ]
  }, [mall])

  if (!mall) {
    return (
      <div className="section-padding max-w-6xl mx-auto">
        <h1 className="heading-large">Mall not found</h1>
        <p className="text-subtle mt-3">The mall you’re looking for doesn’t exist or is not available yet.</p>
        <Link to="/" className="button-primary inline-block mt-6">
          Back to home
        </Link>
      </div>
    )
  }

  const fav = isFavorite('malls', mall.id)

  if (mall.status === 'coming_soon') {
    return (
      <div className="section-padding max-w-6xl mx-auto">
        <Link to="/" className="text-white/70 hover:text-white transition">
          ← Back to home
        </Link>

        <div className="mt-8 glass rounded-3xl p-10 text-center">
          <h1 className="heading-large">{mall.name}</h1>
          <p className="text-neonCyan font-semibold mt-4">Coming soon</p>
          <p className="text-white/60 mt-4 max-w-2xl mx-auto">
            We’re building an ultra-modern, immersive experience for this mall: indoor maps, 360° tours, and community reviews.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            <Link to="/discover" className="button-primary">
              Discover now
            </Link>
            <Link to="/" className="button-secondary">
              Explore other malls
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="relative h-[340px] md:h-[460px] overflow-hidden">
        <img src={mall.bannerImage} alt={mall.name} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/30 to-midnight" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 lg:px-8 h-full flex flex-col justify-end pb-10">
          <Link to="/" className="text-white/70 hover:text-white transition">
            ← Back to home
          </Link>

          <div className="mt-6 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <p className="text-xs tracking-[0.25em] uppercase text-white/70">Mall</p>
              <h1 className="heading-large mt-3">{mall.name}</h1>
              <p className="text-white/70 mt-3 max-w-2xl">{mall.description}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => toggleFavorite('malls', mall.id)}
                className="button-secondary inline-flex items-center gap-2"
              >
                <Heart className={`w-4 h-4 ${fav ? 'text-neonPink fill-neonPink' : 'text-white/70'}`} />
                {fav ? 'Saved' : 'Save'}
              </button>
              <ShareButtons title={mall.name} text="Check this mall on Samarkand Mall Explorer" />
              <Link to={`/mall/${mall.id}/stores`} className="button-primary">
                Store directory
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Info */}
      <section className="section-padding max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { k: 'Hours', v: mall.hours || '—' },
            { k: 'Address', v: mall.address || '—' },
            { k: 'Opened', v: mall.openedDate || '—' },
            { k: 'Stores', v: mall.storeCount || stores.length || '—' },
          ].map((x) => (
            <GlassCard key={x.k} className="p-6">
              <p className="text-white/60 text-sm">{x.k}</p>
              <p className="text-white font-semibold mt-2">{x.v}</p>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* Gallery */}
      <section className="section-padding max-w-6xl mx-auto">
        <SectionHeader
          eyebrow="Gallery"
          title="High-quality visuals"
          description="Premium imagery and layered layouts — ready for cinematic storytelling."
        />

        <FeaturedCarousel>
          {gallery.map((src, idx) => (
            <div key={idx} className="min-w-[340px] snap-start">
              <div className="glass rounded-3xl overflow-hidden border border-white/10">
                <img src={src} alt={`${mall.name} gallery ${idx + 1}`} className="h-56 w-full object-cover" loading="lazy" />
              </div>
            </div>
          ))}
        </FeaturedCarousel>
      </section>

      {/* About + Map */}
      <section className="section-padding max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <GlassCard className="p-8">
            <p className="text-xs tracking-[0.25em] uppercase text-neonCyan/80">Story</p>
            <h2 className="heading-medium mt-3">Mall history</h2>
            <p className="text-white/70 mt-4 leading-relaxed">
              {mall.name} blends modern shopping comfort with Uzbek hospitality. This section is structured for richer storytelling:
              highlights, seasonal campaigns, and community moments.
            </p>

            <div className="mt-6 rounded-3xl bg-white/5 border border-white/10 p-6">
              <p className="font-semibold text-white">Contact</p>
              <p className="text-white/60 mt-2">Phone: {mall.phone || '—'}</p>
              <p className="text-white/60 mt-1">Website: {mall.website || '—'}</p>
            </div>
          </GlassCard>

          <GlassCard className="p-6 overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs tracking-[0.25em] uppercase text-white/50">Map</p>
                <p className="font-semibold text-white mt-2">Location</p>
              </div>
              <MapPinned className="w-5 h-5 text-neonCyan" />
            </div>
            <div className="rounded-3xl overflow-hidden border border-white/10 h-80 bg-white/5">
              <iframe
                title="Mall Location Map"
                className="w-full h-full"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3059.1826087346583!2d66.9796954!3d39.6546892!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3f4ea89c7c7c7c7d%3A0x7c7c7c7c7c7c7c7c!2sRegistan%2C%20Samarkand!5e0!3m2!1sen!2sus!4v1234567890123"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </GlassCard>
        </div>
      </section>

      {/* Indoor Map */}
      <section className="section-padding max-w-6xl mx-auto">
        <IndoorMap
          stores={stores}
          onSelectStore={(s) => {
            navigate(`/mall/${mall.id}/store/${s.id}`)
          }}
        />
      </section>

      {/* Featured stores carousel */}
      {stores.length > 0 && (
        <section className="section-padding max-w-6xl mx-auto">
          <SectionHeader
            eyebrow="Featured"
            title="Featured stores"
            description="A swipe-first carousel for a premium, mobile-native feel."
            right={
              <Link to={`/mall/${mall.id}/stores`} className="button-secondary">
                View all
              </Link>
            }
          />

          <FeaturedCarousel>
            {stores.slice(0, 10).map((store) => (
              <div key={store.id} className="min-w-[280px] snap-start">
                <StoreCard store={store} mallId={mall.id} />
              </div>
            ))}
          </FeaturedCarousel>
        </section>
      )}

      {/* Virtual Tour */}
      <section className="section-padding max-w-6xl mx-auto">
        <SectionHeader
          eyebrow="Virtual Tour"
          title="360° views & walkthroughs"
          description="Embed-ready placeholders for immersive tours."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <GlassCard className="p-6">
            <p className="font-semibold text-white">360° tour</p>
            <p className="text-white/60 text-sm mt-2">Matterport / 360 media integration placeholder.</p>
            <div className="mt-4 rounded-3xl border border-white/10 bg-white/5 h-56 flex items-center justify-center">
              <p className="text-white/50">360 viewer coming soon</p>
            </div>
          </GlassCard>
          <GlassCard className="p-6">
            <p className="font-semibold text-white">Walkthrough video</p>
            <p className="text-white/60 text-sm mt-2">High-quality video storytelling placeholder.</p>
            <div className="mt-4 rounded-3xl border border-white/10 bg-white/5 h-56 flex items-center justify-center">
              <p className="text-white/50">Video embed coming soon</p>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* Reviews */}
      <Reviews entityType="mall" entityId={mall.id} heading="Community & Reviews" />
    </div>
  )
}
