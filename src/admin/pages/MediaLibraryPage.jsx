import React from 'react'
import { Image, Tag } from 'lucide-react'

import AdminLayout from '../components/AdminLayout'

export default function MediaLibraryPage() {
  const items = [
    {
      id: 'hero-1',
      url: 'https://images.unsplash.com/photo-1567521464027-f127ff144326?w=800&h=500&fit=crop',
      tags: ['mall', 'hero', 'premium'],
    },
    {
      id: 'event-1',
      url: 'https://images.unsplash.com/photo-1516455207990-7a41ce80f7ee?w=800&h=500&fit=crop',
      tags: ['event', 'lights', 'festival'],
    },
  ]

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Media Library</h1>
          <p className="mt-2 text-white/60">A modern asset manager with AI tagging (placeholder).</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {items.map((item) => (
            <div key={item.id} className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
              <img src={item.url} alt={item.id} className="w-full h-44 object-cover" loading="lazy" />
              <div className="p-5">
                <div className="flex items-center gap-2">
                  <Image className="w-4 h-4 text-white/60" />
                  <p className="text-white font-semibold">{item.id}</p>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {item.tags.map((t) => (
                    <span key={t} className="inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/70">
                      <Tag className="w-3 h-3" />
                      {t}
                    </span>
                  ))}
                </div>
                <p className="text-white/40 text-xs mt-4">AI tagging: planned</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  )
}
