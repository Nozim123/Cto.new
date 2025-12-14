import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'

import malls from '../data/malls.json'
import stores from '../data/stores.json'
import products from '../data/products.json'

import useFavorites from '../hooks/useFavorites'
import SectionHeader from '../components/ui/SectionHeader'
import GlassCard from '../components/ui/GlassCard'

export default function FavoritesPage() {
  const { favorites } = useFavorites()

  const mallItems = favorites.malls.map((id) => malls.find((m) => m.id === id)).filter(Boolean)
  const storeItems = favorites.stores.map((id) => stores.find((s) => s.id === id)).filter(Boolean)
  const productItems = favorites.products.map((id) => products.find((p) => p.id === id)).filter(Boolean)

  return (
    <div className="section-padding max-w-6xl mx-auto">
      <SectionHeader
        eyebrow="Saved"
        title="Favorites"
        description="Keep a collection of malls, stores, and products you love."
        right={
          <div className="inline-flex items-center gap-2 text-white/60 text-sm">
            <Heart className="w-4 h-4 text-neonPink" />
            Stored locally per user
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassCard className="p-6">
          <p className="font-semibold text-white">Malls</p>
          <div className="mt-4 space-y-3">
            {mallItems.length === 0 ? (
              <p className="text-white/60 text-sm">No saved malls yet.</p>
            ) : (
              mallItems.map((m) => (
                <Link
                  key={m.id}
                  to={`/mall/${m.id}`}
                  className="block rounded-2xl bg-white/5 border border-white/10 p-4 hover:bg-white/10 transition"
                >
                  <p className="font-semibold text-white">{m.name}</p>
                  <p className="text-white/60 text-sm">{m.location}</p>
                </Link>
              ))
            )}
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <p className="font-semibold text-white">Stores</p>
          <div className="mt-4 space-y-3">
            {storeItems.length === 0 ? (
              <p className="text-white/60 text-sm">No saved stores yet.</p>
            ) : (
              storeItems.map((s) => (
                <Link
                  key={s.id}
                  to={`/mall/${s.mallId}/store/${s.id}`}
                  className="block rounded-2xl bg-white/5 border border-white/10 p-4 hover:bg-white/10 transition"
                >
                  <p className="font-semibold text-white">{s.name}</p>
                  <p className="text-white/60 text-sm">{s.category} • Floor {s.floor}</p>
                </Link>
              ))
            )}
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <p className="font-semibold text-white">Products</p>
          <div className="mt-4 space-y-3">
            {productItems.length === 0 ? (
              <p className="text-white/60 text-sm">No saved products yet.</p>
            ) : (
              productItems.map((p) => {
                const s = stores.find((x) => x.id === p.storeId)
                const href = s ? `/mall/${s.mallId}/store/${s.id}` : '/'
                return (
                  <Link
                    key={p.id}
                    to={href}
                    className="block rounded-2xl bg-white/5 border border-white/10 p-4 hover:bg-white/10 transition"
                  >
                    <p className="font-semibold text-white">{p.name}</p>
                    <p className="text-white/60 text-sm">{p.category}</p>
                  </Link>
                )
              })
            )}
          </div>
        </GlassCard>
      </div>

      <div className="mt-12 glass rounded-3xl p-8">
        <p className="font-semibold text-white">Tip</p>
        <p className="text-white/60 mt-2">
          Tap the heart icon on any mall, store, or product to save it — your favorites power smarter recommendations.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <Link to="/" className="button-secondary">
            Back home
          </Link>
          <Link to="/discover" className="button-primary">
            Discover
          </Link>
        </div>
      </div>
    </div>
  )
}
