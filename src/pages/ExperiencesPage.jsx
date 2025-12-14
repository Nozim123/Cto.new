import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

import experiences from '../data/experiences.json'
import SectionHeader from '../components/ui/SectionHeader'
import GlassCard from '../components/ui/GlassCard'

export default function ExperiencesPage() {
  return (
    <div className="section-padding max-w-6xl mx-auto">
      <SectionHeader
        eyebrow="Experiences"
        title="Lifestyle & Entertainment"
        description="A curated layer beyond shopping — cinema, kids zones, food courts, events and festivals."
        right={
          <Link to="/events" className="button-secondary inline-flex items-center gap-2">
            See events <ArrowRight className="w-4 h-4" />
          </Link>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {experiences.map((x) => (
          <GlassCard key={x.id} className="overflow-hidden">
            <img src={x.image} alt={x.title} className="h-48 w-full object-cover" loading="lazy" />
            <div className="p-6">
              <p className="text-2xl">{x.icon}</p>
              <p className="font-semibold text-white mt-3">{x.title}</p>
              <p className="text-white/60 text-sm mt-2">{x.description}</p>
              <p className="text-white/50 text-sm mt-4">AR-ready info cards: coming soon</p>
            </div>
          </GlassCard>
        ))}
      </div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            t: 'Immersive banners',
            d: 'Parallax and micro-interactions add depth without harming performance.',
          },
          {
            t: 'Swipe-first UX',
            d: 'Horizontal carousels and bottom navigation make mobile feel native.',
          },
          {
            t: 'Future ready',
            d: 'Architecture placeholders for 360 tours, AR overlays, and in-mall navigation.',
          },
        ].map((x) => (
          <GlassCard key={x.t} className="p-6">
            <p className="font-semibold text-white">{x.t}</p>
            <p className="text-white/60 text-sm mt-2">{x.d}</p>
          </GlassCard>
        ))}
      </div>
    </div>
  )
}
