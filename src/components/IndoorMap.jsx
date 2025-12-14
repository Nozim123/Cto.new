import { useMemo, useState } from 'react'
import GlassCard from './ui/GlassCard'

const pseudo = (s) => {
  let h = 0
  for (let i = 0; i < s.length; i += 1) h = (h * 31 + s.charCodeAt(i)) >>> 0
  return h
}

export default function IndoorMap({ stores = [], onSelectStore }) {
  const floors = useMemo(() => {
    const unique = Array.from(new Set(stores.map((s) => s.floor))).sort((a, b) => a - b)
    return unique.length > 0 ? unique : [1]
  }, [stores])

  const [floor, setFloor] = useState(floors[0])

  const floorStores = useMemo(() => stores.filter((s) => s.floor === floor), [floor, stores])

  const pins = useMemo(() => {
    return floorStores.map((s) => {
      const h = pseudo(s.id)
      const x = 10 + (h % 80)
      const y = 15 + ((h >> 8) % 70)
      return { store: s, x, y }
    })
  }, [floorStores])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <GlassCard className="p-6 lg:col-span-1">
        <p className="text-xs tracking-[0.25em] uppercase text-neonCyan/80">Explore Map</p>
        <h3 className="heading-small mt-3">Interactive Indoor Map</h3>
        <p className="text-white/60 text-sm mt-2">Floor-aware pins with quick store access (future-ready for full 3D maps).</p>

        <div className="mt-5 flex flex-wrap gap-2">
          {floors.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFloor(f)}
              className={`px-4 py-2 rounded-xl border transition ${
                floor === f
                  ? 'bg-white/10 border-white/20 text-white'
                  : 'bg-transparent border-white/10 text-white/70 hover:bg-white/5'
              }`}
            >
              Floor {f}
            </button>
          ))}
        </div>

        <div className="mt-6 space-y-2">
          {floorStores.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => onSelectStore?.(s)}
              className="w-full text-left px-4 py-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition"
            >
              <p className="font-semibold text-white">{s.name}</p>
              <p className="text-sm text-white/60">{s.category}</p>
            </button>
          ))}
          {floorStores.length === 0 && <p className="text-white/60 text-sm">No stores on this floor.</p>}
        </div>
      </GlassCard>

      <GlassCard className="p-6 lg:col-span-2">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/60 text-sm">Floor plan</p>
            <p className="text-white font-semibold">Level {floor}</p>
          </div>
          <p className="text-xs text-white/40">Pins are mock positions (upgrade to true GIS later).</p>
        </div>

        <div className="mt-5 relative rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-br from-white/5 to-white/0" style={{ aspectRatio: '16 / 9' }}>
          <div className="absolute inset-0 opacity-60" style={{ backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(124,92,255,0.25), transparent 55%), radial-gradient(circle at 80% 20%, rgba(34,211,238,0.18), transparent 55%)' }} />

          {pins.map(({ store, x, y }) => (
            <button
              key={store.id}
              type="button"
              onClick={() => onSelectStore?.(store)}
              className="absolute -translate-x-1/2 -translate-y-1/2 group"
              style={{ left: `${x}%`, top: `${y}%` }}
              aria-label={`Open ${store.name}`}
            >
              <span className="w-3 h-3 rounded-full bg-neonCyan block shadow-glow" />
              <span className="pointer-events-none absolute top-4 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1 rounded-full bg-midnight/80 border border-white/10 text-xs text-white/80 opacity-0 group-hover:opacity-100 transition">
                {store.name}
              </span>
            </button>
          ))}
        </div>
      </GlassCard>
    </div>
  )
}
