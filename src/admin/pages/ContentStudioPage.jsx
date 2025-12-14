import React, { useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { Eye, GripVertical, Save } from 'lucide-react'

import AdminLayout from '../components/AdminLayout'

const defaultSections = [
  { id: 'discover', name: 'Discover (Smart Discovery Hub)' },
  { id: 'map', name: 'Explore Map' },
  { id: 'experiences', name: 'Experiences' },
  { id: 'events', name: 'Events & Promotions' },
  { id: 'new-openings', name: 'New Openings' },
  { id: 'top-picks', name: 'Top Picks' },
  { id: 'collections', name: 'Collections' },
  { id: 'insights', name: 'Mall Insights' },
  { id: 'virtual-tour', name: 'Virtual Tour' },
  { id: 'community', name: 'Community & Reviews' },
  { id: 'brand-spotlight', name: 'Brand Spotlight' },
  { id: 'deals', name: 'Deals Near You' },
  { id: 'sustainability', name: 'Sustainability' },
  { id: 'help', name: 'Help Center' },
  { id: 'partner', name: 'Partner With Us' },
  { id: 'analytics', name: 'Analytics Preview' },
  { id: 'future', name: 'Future Innovations' },
]

const storageKey = 'sme_admin_home_sections'

export default function ContentStudioPage() {
  const [sections, setSections] = useState(() => {
    try {
      const raw = localStorage.getItem(storageKey)
      if (!raw) return defaultSections
      const parsed = JSON.parse(raw)
      if (!Array.isArray(parsed) || parsed.length === 0) return defaultSections
      return parsed
    } catch {
      return defaultSections
    }
  })

  const [dragId, setDragId] = useState(null)

  const preview = useMemo(() => sections.map((s) => s.name), [sections])

  const move = (fromId, toId) => {
    if (!fromId || !toId || fromId === toId) return

    setSections((prev) => {
      const fromIndex = prev.findIndex((s) => s.id === fromId)
      const toIndex = prev.findIndex((s) => s.id === toId)
      if (fromIndex === -1 || toIndex === -1) return prev

      const next = [...prev]
      const [item] = next.splice(fromIndex, 1)
      next.splice(toIndex, 0, item)
      return next
    })
  }

  const save = () => {
    localStorage.setItem(storageKey, JSON.stringify(sections))
    toast.success('Layout saved (demo)')
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Content Studio</h1>
            <p className="mt-2 text-white/60">Drag-and-drop homepage sections with real-time preview.</p>
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={save} className="px-4 py-2 rounded-xl bg-white/10 border border-white/10 text-white hover:bg-white/15 transition inline-flex items-center gap-2">
              <Save className="w-4 h-4" />
              Save
            </button>
            <a href="/" target="_blank" rel="noreferrer" className="px-4 py-2 rounded-xl bg-neonCyan/20 border border-neonCyan/30 text-white hover:bg-neonCyan/25 transition inline-flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Preview site
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
            <p className="font-semibold text-white">Sections</p>
            <p className="text-white/60 text-sm mt-1">Reorder to control homepage storytelling.</p>

            <div className="mt-4 space-y-2">
              {sections.map((s) => (
                <div
                  key={s.id}
                  draggable
                  onDragStart={() => setDragId(s.id)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => move(dragId, s.id)}
                  className="flex items-center justify-between gap-3 px-4 py-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition cursor-grab"
                  role="listitem"
                >
                  <div className="flex items-center gap-3">
                    <GripVertical className="w-4 h-4 text-white/50" />
                    <p className="text-white font-semibold">{s.name}</p>
                  </div>
                  <span className="text-xs text-white/50">{s.id}</span>
                </div>
              ))}
            </div>

            <p className="text-white/40 text-xs mt-4">Demo: stored in localStorage for now. Production would persist in DB with audit logs.</p>
          </div>

          <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
            <p className="font-semibold text-white">Real-time preview</p>
            <p className="text-white/60 text-sm mt-1">This is a UI preview panel (future-ready for live rendering).</p>

            <div className="mt-4 space-y-3">
              {preview.map((name, idx) => (
                <div key={name} className="rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 px-5 py-4">
                  <p className="text-white/60 text-xs">Section {idx + 1}</p>
                  <p className="text-white font-semibold mt-1">{name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
          <p className="font-semibold text-white">Role-based UI & audit logs (planned)</p>
          <p className="text-white/60 mt-2">
            This admin panel is structured to support role-based permissions, audit trails, and safe publishing workflows.
          </p>
        </div>
      </div>
    </AdminLayout>
  )
}
