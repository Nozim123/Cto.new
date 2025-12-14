import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { MapPinned } from 'lucide-react'

import malls from '../data/malls.json'
import stores from '../data/stores.json'
import SectionHeader from '../components/ui/SectionHeader'
import GlassCard from '../components/ui/GlassCard'

export default function ExploreMapPage() {
  const [params, setParams] = useSearchParams()
  const category = params.get('category')

  const filteredStores = useMemo(() => {
    if (!category) return stores
    return stores.filter((s) => s.category.toLowerCase().includes(category.toLowerCase()))
  }, [category])

  const categories = useMemo(() => ['All', ...Array.from(new Set(stores.map((s) => s.category)))], [])

  return (
    <div className="section-padding max-w-6xl mx-auto">
      <SectionHeader
        eyebrow="Explore Map"
        title="Interactive Experience Map"
        description="Advanced map-based browsing (preview): mall clustering, store pinpoints, and category filters."
        right={
          <div className="inline-flex items-center gap-2 text-white/60 text-sm">
            <MapPinned className="w-4 h-4" />
            Map UX ready for GIS upgrade
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassCard className="p-6 lg:col-span-2">
          <div className="rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-br from-white/5 to-white/0 p-10 relative min-h-[360px]">
            <div
              className="absolute inset-0 opacity-70"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 20% 30%, rgba(34,211,238,0.22), transparent 55%), radial-gradient(circle at 80% 20%, rgba(124,92,255,0.24), transparent 55%), radial-gradient(circle at 55% 80%, rgba(251,113,133,0.14), transparent 60%)',
              }}
            />
            <div className="relative">
              <p className="text-white/60">Samarkand — city browsing map (preview)</p>
              <p className="text-white font-semibold text-2xl mt-2">Malls clustered. Stores pinned.</p>
              <p className="text-white/60 mt-3 max-w-xl">
                This is a performance-first placeholder for a full map provider integration (Mapbox / Google Maps) and indoor mapping.
              </p>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-3">
                {malls.map((m) => (
                  <Link
                    key={m.id}
                    to={`/mall/${m.id}`}
                    className="rounded-2xl bg-white/5 border border-white/10 px-4 py-3 hover:bg-white/10 transition"
                  >
                    <p className="font-semibold text-white">{m.name}</p>
                    <p className="text-white/60 text-sm">{m.status === 'coming_soon' ? 'Coming soon' : 'Open'}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <p className="font-semibold text-white">Filters</p>
          <p className="text-white/60 text-sm mt-2">Filter store pins by category.</p>

          <div className="mt-4 flex flex-wrap gap-2">
            {categories.map((c) => {
              const active = (!category && c === 'All') || (category === c)
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => {
                    if (c === 'All') setParams({})
                    else setParams({ category: c })
                  }}
                  className={`px-4 py-2 rounded-xl border transition ${
                    active ? 'bg-white/10 border-white/20 text-white' : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                  }`}
                >
                  {c}
                </button>
              )
            })}
          </div>

          <div className="mt-6">
            <p className="text-white/60 text-sm">Visible stores</p>
            <p className="text-white font-semibold text-2xl mt-1">{filteredStores.length}</p>
          </div>
        </GlassCard>
      </div>

      <div className="mt-10">
        <SectionHeader
          eyebrow="Store pinpoints"
          title="Browse store-level results"
          description={category ? `Showing category: ${category}` : 'Showing all categories'}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStores.map((s) => (
            <Link
              key={s.id}
              to={`/mall/${s.mallId}/store/${s.id}`}
              className="rounded-2xl bg-white/5 border border-white/10 p-5 hover:bg-white/10 transition"
            >
              <p className="font-semibold text-white">{s.name}</p>
              <p className="text-white/60 text-sm mt-1">{s.category} • Floor {s.floor}</p>
              <p className="text-white/50 text-sm mt-3">Open →</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
