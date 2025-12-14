import { useState } from 'react'
import toast from 'react-hot-toast'

import GlassCard from '../components/ui/GlassCard'
import SectionHeader from '../components/ui/SectionHeader'

export default function HelpCenterPage() {
  const [message, setMessage] = useState('')

  const submit = (e) => {
    e.preventDefault()
    toast.success('Message sent (demo)')
    setMessage('')
  }

  return (
    <div className="section-padding max-w-6xl mx-auto">
      <SectionHeader
        eyebrow="Help Center"
        title="Support that feels modern"
        description="AI chat assistant placeholder, FAQs, and a fast contact experience."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassCard className="p-6 lg:col-span-2">
          <p className="font-semibold text-white">AI Chat Assistant (placeholder)</p>
          <p className="text-white/60 text-sm mt-2">Designed for future integration with an LLM-backed concierge.</p>

          <div className="mt-5 rounded-3xl bg-white/5 border border-white/10 p-4 min-h-56">
            <p className="text-white/60 text-sm">Assistant: Hi! Ask me about malls, stores, events, or directions.</p>
            <p className="text-white/40 text-xs mt-2">(Chat UI placeholder — connect to backend later.)</p>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <p className="font-semibold text-white">FAQ</p>
          <div className="mt-4 space-y-3">
            {[
              { q: 'How do favorites work?', a: 'Tap the heart icon on any card. Saved items improve recommendations.' },
              { q: 'Can I leave reviews?', a: 'Yes — sign in and post reviews with ratings and optional photos.' },
              { q: 'Is this accessible?', a: 'The UI uses clear contrast, keyboard navigation, and focus indicators.' },
            ].map((x) => (
              <details key={x.q} className="rounded-2xl bg-white/5 border border-white/10 p-4">
                <summary className="cursor-pointer font-semibold text-white">{x.q}</summary>
                <p className="text-white/60 text-sm mt-2">{x.a}</p>
              </details>
            ))}
          </div>
        </GlassCard>
      </div>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
        <GlassCard className="p-8">
          <p className="font-semibold text-white">Contact us</p>
          <p className="text-white/60 text-sm mt-2">We’ll respond as soon as possible.</p>
          <form onSubmit={submit} className="mt-5 space-y-4">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
              className="w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-neonCyan/50"
              placeholder="Write your message…"
              required
            />
            <button type="submit" className="button-primary">
              Send message
            </button>
          </form>
        </GlassCard>

        <GlassCard className="p-8">
          <p className="font-semibold text-white">Accessibility</p>
          <p className="text-white/60 text-sm mt-2">
            If you encounter any issues, let us know — we prioritize inclusive design.
          </p>
          <div className="mt-5 rounded-2xl bg-white/5 border border-white/10 p-4">
            <p className="text-white/70 text-sm">WCAG 2.1 AA friendly components</p>
            <p className="text-white/50 text-xs mt-2">Keyboard navigation • focus-visible outlines • readable typography</p>
          </div>
        </GlassCard>
      </div>
    </div>
  )
}
