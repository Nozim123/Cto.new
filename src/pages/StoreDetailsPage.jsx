import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Heart, Image as ImageIcon, Sparkles } from 'lucide-react'

import mallsData from '../data/malls.json'
import storesData from '../data/stores.json'
import productsData from '../data/products.json'

import ProductCard from '../components/ProductCard'
import ProductModal from '../components/ProductModal'
import FeaturedCarousel from '../components/FeaturedCarousel'
import Reviews from '../components/Reviews'
import ShareButtons from '../components/ShareButtons'
import GlassCard from '../components/ui/GlassCard'
import SectionHeader from '../components/ui/SectionHeader'

import useFavorites from '../hooks/useFavorites'
import useActivity from '../hooks/useActivity'

export default function StoreDetailsPage() {
  const { mallId, storeId } = useParams()

  const { isFavorite, toggleFavorite } = useFavorites()
  const { track } = useActivity()

  const mall = useMemo(() => mallsData.find((m) => m.id === mallId) || null, [mallId])
  const store = useMemo(() => storesData.find((s) => s.id === storeId && s.mallId === mallId) || null, [mallId, storeId])

  const products = useMemo(() => productsData.filter((p) => p.storeId === storeId), [storeId])

  const [selectedProduct, setSelectedProduct] = useState(null)

  useEffect(() => {
    if (store) {
      track({ type: 'stores', id: store.id, title: `Viewed store: ${store.name}` })
    }
  }, [store, track])

  useEffect(() => {
    if (selectedProduct) {
      track({ type: 'products', id: selectedProduct.id, title: `Previewed product: ${selectedProduct.name}` })
    }
  }, [selectedProduct, track])

  if (!mall || !store) {
    return (
      <div className="section-padding max-w-6xl mx-auto">
        <h1 className="heading-large">Store not found</h1>
        <Link to="/" className="button-primary inline-block mt-6">
          Back to home
        </Link>
      </div>
    )
  }

  const fav = isFavorite('stores', store.id)

  const relatedProducts = useMemo(() => {
    const others = products.filter((p) => p.id !== selectedProduct?.id)
    return others.slice(0, 4)
  }, [products, selectedProduct?.id])

  const gallery = [store.heroImage || store.logo, store.interiorImage, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&h=800&fit=crop'].filter(
    Boolean
  )

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <div className="max-w-6xl mx-auto px-4 lg:px-8 pt-6">
        <div className="flex items-center gap-2 text-sm text-white/50 mb-6 flex-wrap">
          <Link to="/" className="hover:text-white transition">
            Home
          </Link>
          <span>/</span>
          <Link to={`/mall/${mallId}`} className="hover:text-white transition">
            {mall.name}
          </Link>
          <span>/</span>
          <Link to={`/mall/${mallId}/stores`} className="hover:text-white transition">
            Directory
          </Link>
          <span>/</span>
          <span className="text-white font-semibold">{store.name}</span>
        </div>
      </div>

      {/* Hero */}
      <div className="relative overflow-hidden bg-midnight">
        <div className="absolute inset-0 opacity-40" style={{ backgroundImage: 'radial-gradient(circle at 15% 20%, rgba(124,92,255,0.25), transparent 55%), radial-gradient(circle at 80% 25%, rgba(34,211,238,0.20), transparent 55%)' }} />
        <div className="max-w-6xl mx-auto px-4 lg:px-8 py-10 md:py-16 relative">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="rounded-3xl overflow-hidden border border-white/10 bg-white/5 h-64 md:h-80">
              <img src={store.logo} alt={store.name} className="w-full h-full object-cover" loading="lazy" />
            </div>

            <div>
              <p className="text-neonCyan/80 text-xs tracking-[0.25em] uppercase">{store.category}</p>
              <h1 className="heading-large mt-3">{store.name}</h1>

              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="rounded-2xl bg-white/5 border border-white/10 px-4 py-3">
                  <p className="text-white/50">Floor</p>
                  <p className="text-white font-semibold">{store.floor}</p>
                </div>
                <div className="rounded-2xl bg-white/5 border border-white/10 px-4 py-3">
                  <p className="text-white/50">Hours</p>
                  <p className="text-white font-semibold">{store.hours}</p>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => toggleFavorite('stores', store.id)}
                  className="button-secondary inline-flex items-center gap-2"
                >
                  <Heart className={`w-4 h-4 ${fav ? 'text-neonPink fill-neonPink' : 'text-white/70'}`} />
                  {fav ? 'Saved' : 'Save'}
                </button>
                <ShareButtons title={store.name} text="Check this store on Samarkand Mall Explorer" />
                <Link to={`/mall/${mallId}/stores`} className="button-primary">
                  Back to directory
                </Link>
              </div>

              <p className="text-white/70 mt-6 leading-relaxed">{store.about}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery */}
      <section className="section-padding max-w-6xl mx-auto">
        <SectionHeader
          eyebrow="Gallery"
          title="In-store experience"
          description="High-quality visuals with swipe-first carousel."
          right={
            <div className="inline-flex items-center gap-2 text-white/60 text-sm">
              <ImageIcon className="w-4 h-4" />
              Future-ready for 360 + video
            </div>
          }
        />

        <FeaturedCarousel>
          {gallery.map((src, idx) => (
            <div key={idx} className="min-w-[340px] snap-start">
              <div className="glass rounded-3xl overflow-hidden border border-white/10">
                <img src={src} alt={`${store.name} gallery ${idx + 1}`} className="h-56 w-full object-cover" loading="lazy" />
              </div>
            </div>
          ))}
        </FeaturedCarousel>
      </section>

      {/* Store information */}
      <section className="section-padding max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <GlassCard className="p-8">
            <p className="text-xs tracking-[0.25em] uppercase text-neonCyan/80">Details</p>
            <h2 className="heading-medium mt-3">Store information</h2>

            <div className="mt-6 space-y-3 text-white/70">
              <p>
                <span className="text-white/90 font-semibold">Category:</span> {store.category}
              </p>
              <p>
                <span className="text-white/90 font-semibold">Location:</span> Floor {store.floor}, {mall.name}
              </p>
              <p>
                <span className="text-white/90 font-semibold">Status:</span>{' '}
                <span className={store.status === 'open' ? 'text-emerald-200 font-semibold' : 'text-amber-200 font-semibold'}>
                  {store.status === 'open' ? '● Open' : '● Coming soon'}
                </span>
              </p>
              <p>
                <span className="text-white/90 font-semibold">Phone:</span> {store.phone}
              </p>
              <p>
                <span className="text-white/90 font-semibold">Email:</span> {store.email}
              </p>
            </div>
          </GlassCard>

          <GlassCard className="p-8">
            <p className="text-xs tracking-[0.25em] uppercase text-neonPink/80">Future-ready</p>
            <h2 className="heading-medium mt-3">Virtual walkthrough</h2>
            <p className="text-white/60 mt-4">
              Placeholder for 360° tours, AR overlays, and indoor navigation — ready for real integration.
            </p>
            <div className="mt-6 rounded-3xl bg-white/5 border border-white/10 h-56 flex items-center justify-center">
              <div className="text-center">
                <Sparkles className="w-6 h-6 text-neonCyan mx-auto" />
                <p className="text-white/50 mt-2">Immersive view coming soon</p>
              </div>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* Products */}
      {products.length > 0 && (
        <section className="section-padding max-w-6xl mx-auto">
          <SectionHeader
            eyebrow="Products"
            title="Featured products"
            description="Interactive product previews (modal) — designed for future ecommerce and AR."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} onSelect={setSelectedProduct} />
            ))}
          </div>
        </section>
      )}

      {/* Product Modal */}
      {selectedProduct && (
        <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} relatedProducts={relatedProducts} />
      )}

      {/* Reviews */}
      <Reviews entityType="store" entityId={store.id} heading="Community & Reviews" />
    </div>
  )
}
