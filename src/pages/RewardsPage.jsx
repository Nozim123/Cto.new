import { Link } from 'react-router-dom'
import { useMemo } from 'react'
import { useTheme } from '../contexts/ThemeContext'
import { useEcosystem } from '../contexts/EcosystemContext'

const tiers = [
  { name: 'Silver', min: 0, max: 1000 },
  { name: 'Gold', min: 1000, max: 2500 },
  { name: 'Platinum', min: 2500, max: 5000 }
]

export default function RewardsPage() {
  const { darkMode } = useTheme()
  const { getPoints, getTier, awardPoints } = useEcosystem()

  const points = getPoints()
  const tier = getTier()

  const tierMeta = useMemo(() => {
    const current = tiers.find((t) => t.name === tier) || tiers[0]
    const next = tiers[tiers.findIndex((t) => t.name === tier) + 1] || null
    const progress = Math.min(1, (points - current.min) / Math.max(1, current.max - current.min))
    return { current, next, progress }
  }, [tier, points])

  return (
    <div className={`min-h-screen pt-24 pb-24 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-5xl mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between gap-3 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Loyalty & Rewards</h1>
            <p className={`${darkMode ? 'text-white/70' : 'text-gray-600'} mt-1`}>
              Earn points, unlock tiers, and redeem perks.
            </p>
          </div>
          <Link
            to="/"
            className={`px-4 py-2 rounded-xl text-sm font-semibold border ${
              darkMode ? 'border-white/10 bg-white/5 hover:bg-white/10' : 'border-gray-200 bg-white hover:bg-gray-50'
            }`}
          >
            Back
          </Link>
        </div>

        <div className={`p-6 rounded-3xl border ${darkMode ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-white'}`}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className={`${darkMode ? 'text-white/70' : 'text-gray-600'} text-sm`}>Your tier</p>
              <p className="text-2xl font-bold">{tier}</p>
            </div>
            <div>
              <p className={`${darkMode ? 'text-white/70' : 'text-gray-600'} text-sm`}>Points</p>
              <p className="text-2xl font-bold">{points.toLocaleString()}</p>
            </div>
            <button
              type="button"
              onClick={() => awardPoints(50, 'demo')}
              className="px-4 py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-purple-700 text-white font-semibold shadow-lg"
            >
              +50 demo points
            </button>
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <p className={`${darkMode ? 'text-white/70' : 'text-gray-600'} text-sm`}>
                Progress to {tierMeta.next?.name || 'Platinum'}
              </p>
              <p className={`${darkMode ? 'text-white/70' : 'text-gray-600'} text-sm`}>
                {tierMeta.next ? `${tierMeta.next.min - points} pts left` : 'Max tier'}
              </p>
            </div>
            <div className={`h-3 rounded-full overflow-hidden ${darkMode ? 'bg-white/10' : 'bg-gray-100'}`}>
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-purple-700"
                style={{ width: `${tierMeta.progress * 100}%` }}
              />
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { title: 'Earn points', text: 'Browse stores, view products, and engage with the mall ecosystem.' },
              { title: 'Redeem perks', text: 'Unlock discount codes, priority support, and exclusive drops.' },
              { title: 'Tier benefits', text: 'Silver → Gold → Platinum with increasing rewards and VIP access.' }
            ].map((card) => (
              <div
                key={card.title}
                className={`p-5 rounded-2xl border ${darkMode ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-white'}`}
              >
                <p className="font-semibold mb-2">{card.title}</p>
                <p className={`${darkMode ? 'text-white/70' : 'text-gray-600'} text-sm leading-relaxed`}>{card.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
