import { useEffect, useState } from 'react'
import { ArrowRight, Heart, Sparkles } from 'lucide-react'
import { useUser } from '../contexts/UserContext'
import GlassCard from './ui/GlassCard'

export default function OnboardingModal() {
  const { user } = useUser()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!user) {
      setOpen(false)
      return
    }

    const key = `sme_onboarded:${user.id}`
    const done = localStorage.getItem(key) === 'true'
    const pending = localStorage.getItem('sme_onboarding_pending') === 'true'

    if (!done && pending) setOpen(true)
  }, [user])

  const finish = () => {
    if (!user) return
    localStorage.setItem(`sme_onboarded:${user.id}`, 'true')
    localStorage.removeItem('sme_onboarding_pending')
    setOpen(false)
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Onboarding"
      onClick={finish}
    >
      <GlassCard className="max-w-xl w-full p-6 md:p-8" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs tracking-[0.25em] uppercase text-neonCyan/80 mb-3">Onboarding</p>
            <h2 className="heading-medium">Welcome to Samarkand Mall Explorer</h2>
            <p className="text-subtle mt-3">
              Save favorites, unlock smarter recommendations, and keep track of everything you explore.
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-neonCyan" />
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="glass rounded-2xl p-4">
            <p className="font-semibold text-white">Discover</p>
            <p className="text-white/60 text-sm mt-1">Try smart search + personalized picks.</p>
          </div>
          <div className="glass rounded-2xl p-4">
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-neonPink" />
              <p className="font-semibold text-white">Save</p>
            </div>
            <p className="text-white/60 text-sm mt-1">Tap the heart on malls, stores, and products.</p>
          </div>
          <div className="glass rounded-2xl p-4">
            <p className="font-semibold text-white">Insights</p>
            <p className="text-white/60 text-sm mt-1">View activity + trending in your profile.</p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end">
          <button type="button" onClick={finish} className="button-primary inline-flex items-center gap-2">
            Let’s go
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </GlassCard>
    </div>
  )
}
