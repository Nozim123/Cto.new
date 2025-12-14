import { useState } from 'react'
import toast from 'react-hot-toast'

import GlassCard from '../components/ui/GlassCard'
import SectionHeader from '../components/ui/SectionHeader'

export default function PartnerWithUsPage() {
  const [company, setCompany] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const submit = (e) => {
    e.preventDefault()
    toast.success('Request submitted (demo)')
    setCompany('')
    setEmail('')
    setMessage('')
  }

  return (
    <div className="section-padding max-w-6xl mx-auto">
      <SectionHeader
        eyebrow="Partner With Us"
        title="Business onboarding"
        description="Store owner registration, advertising opportunities, and partnership inquiries."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassCard className="p-6 lg:col-span-2">
          <p className="font-semibold text-white">Store owner registration</p>
          <p className="text-white/60 text-sm mt-2">Tell us about your brand — we’ll reach out with next steps.</p>

          <form onSubmit={submit} className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-1">
              <label className="block text-sm text-white/70 mb-2" htmlFor="company">
                Company / Brand
              </label>
              <input
                id="company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-neonCyan/50"
                required
              />
            </div>
            <div className="md:col-span-1">
              <label className="block text-sm text-white/70 mb-2" htmlFor="email">
                Contact email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-neonCyan/50"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm text-white/70 mb-2" htmlFor="message">
                Message
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                className="w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-neonCyan/50"
                placeholder="What are you looking for? Space, promotion, pop-up, advertising…"
                required
              />
            </div>

            <div className="md:col-span-2 flex flex-wrap gap-2">
              <button type="submit" className="button-primary">
                Submit request
              </button>
              <a href="mailto:partners@samarkandmall.uz" className="button-secondary">
                Email us
              </a>
            </div>
          </form>
        </GlassCard>

        <GlassCard className="p-6">
          <p className="font-semibold text-white">Why partner</p>
          <div className="mt-4 space-y-3 text-white/70">
            <p>• Real-time preview + modern content management (admin)</p>
            <p>• Featured brand spotlight + editorial picks</p>
            <p>• Analytics dashboards and transparency</p>
            <p>• Future-ready ecommerce and AR integration</p>
          </div>
        </GlassCard>
      </div>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            t: 'Advertising opportunities',
            d: 'Premium placements across Discover, Deals Near You, and Events.',
          },
          {
            t: 'Partnership inquiries',
            d: 'Collabs, seasonal campaigns, and community highlights.',
          },
          {
            t: 'Media library (future)',
            d: 'AI tagging for images and banners — ready for expansion.',
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
