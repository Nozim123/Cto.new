import SectionHeader from '../components/ui/SectionHeader'
import GlassCard from '../components/ui/GlassCard'

export default function FutureInnovationsPage() {
  return (
    <div className="section-padding max-w-6xl mx-auto">
      <SectionHeader
        eyebrow="Future Innovations"
        title="Technology roadmap"
        description="A vision-driven section: coming features, beta programs, and the platform’s path to multi-city expansion."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            t: 'E-commerce integration',
            d: 'Storefronts, carts, checkout, delivery, and loyalty programs.',
          },
          {
            t: 'AR product previews',
            d: 'Try-before-buy, in-mall overlays, and navigation assistance.',
          },
          {
            t: 'AI chat assistant',
            d: 'Mall concierge: Q&A, recommendations, trip planning, and offers.',
          },
          {
            t: 'Voice search',
            d: 'Hands-free discovery that feels native on mobile.',
          },
          {
            t: 'Multi-city expansion',
            d: 'City clusters, scalable data models, and marketplace-ready architecture.',
          },
          {
            t: 'Security & trust',
            d: 'Secure auth, data protection, RBAC, and audit logs.',
          },
        ].map((x) => (
          <GlassCard key={x.t} className="p-6">
            <p className="font-semibold text-white">{x.t}</p>
            <p className="text-white/60 text-sm mt-2">{x.d}</p>
            <div className="mt-5 rounded-2xl bg-white/5 border border-white/10 p-4">
              <p className="text-white/60 text-sm">Status</p>
              <p className="text-white font-semibold">Planned</p>
            </div>
          </GlassCard>
        ))}
      </div>

      <div className="mt-12 glass rounded-3xl p-8">
        <p className="font-semibold text-white">Beta programs</p>
        <p className="text-white/60 mt-2">
          Ready for opt-in betas: voice search, AI concierge, and AR previews — designed to roll out safely with analytics and audit logs.
        </p>
      </div>
    </div>
  )
}
