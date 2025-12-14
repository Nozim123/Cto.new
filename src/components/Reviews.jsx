import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { ImagePlus, Star } from 'lucide-react'
import { useUser } from '../contexts/UserContext'
import GlassCard from './ui/GlassCard'

const clamp = (n, min, max) => Math.max(min, Math.min(max, n))

export default function Reviews({ entityType, entityId, heading = 'Community & Reviews' }) {
  const { user } = useUser()
  const key = `sme_reviews:${entityType}:${entityId}`

  const [reviews, setReviews] = useState([])
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [imageUrl, setImageUrl] = useState('')

  useEffect(() => {
    try {
      const raw = localStorage.getItem(key)
      setReviews(raw ? JSON.parse(raw) : [])
    } catch {
      setReviews([])
    }
  }, [key])

  const avg = useMemo(() => {
    if (reviews.length === 0) return 0
    const sum = reviews.reduce((acc, r) => acc + (r.rating || 0), 0)
    return Math.round((sum / reviews.length) * 10) / 10
  }, [reviews])

  const submit = (e) => {
    e.preventDefault()
    if (!user) {
      toast.error('Please sign in to leave a review.')
      return
    }

    const clean = comment.trim()
    if (!clean) {
      toast.error('Please add a comment.')
      return
    }

    const next = [
      {
        id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        userId: user.id,
        userName: user.name,
        rating: clamp(Number(rating), 1, 5),
        comment: clean,
        imageUrl: imageUrl.trim(),
        createdAt: new Date().toISOString(),
      },
      ...reviews,
    ].slice(0, 40)

    setReviews(next)
    localStorage.setItem(key, JSON.stringify(next))
    setComment('')
    setImageUrl('')
    setRating(5)
    toast.success('Review posted')
  }

  return (
    <section className="section-padding max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8">
        <div>
          <p className="text-xs tracking-[0.25em] uppercase text-neonPink/80 mb-3">Community</p>
          <h2 className="heading-medium">{heading}</h2>
          <p className="text-subtle mt-3">
            {reviews.length === 0 ? 'Be the first to share your experience.' : 'Real feedback from shoppers.'}
          </p>
        </div>
        <div className="glass rounded-2xl px-5 py-4">
          <p className="text-white/70 text-sm">Average rating</p>
          <div className="flex items-center gap-2">
            <p className="text-3xl font-semibold text-white">{avg || '—'}</p>
            <p className="text-white/60 text-sm">({reviews.length})</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassCard className="p-6 lg:col-span-1">
          <h3 className="font-semibold text-white">Write a review</h3>
          <p className="text-white/60 text-sm mt-1">Add a rating, a short comment, and optional photo.</p>

          <form onSubmit={submit} className="mt-5 space-y-4">
            <div>
              <label className="block text-sm text-white/70 mb-2">Rating</label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setRating(v)}
                    className={`w-10 h-10 rounded-xl border transition flex items-center justify-center ${
                      rating >= v ? 'bg-white/10 border-white/20' : 'bg-transparent border-white/10 hover:bg-white/5'
                    }`}
                    aria-label={`${v} star`}
                  >
                    <Star className={`w-5 h-5 ${rating >= v ? 'text-gold fill-gold' : 'text-white/40'}`} />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm text-white/70 mb-2" htmlFor="review-comment">
                Comment
              </label>
              <textarea
                id="review-comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                className="w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-neonCyan/50"
                placeholder="What stood out? Any tips for others?"
              />
            </div>

            <div>
              <label className="block text-sm text-white/70 mb-2" htmlFor="review-image">
                Photo URL (optional)
              </label>
              <div className="flex items-center gap-2">
                <ImagePlus className="w-5 h-5 text-white/60" />
                <input
                  id="review-image"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-neonCyan/50"
                  placeholder="https://…"
                />
              </div>
            </div>

            <button type="submit" className="button-primary w-full">
              Post review
            </button>

            {!user && <p className="text-xs text-white/50">Sign in to post.</p>}
          </form>
        </GlassCard>

        <div className="lg:col-span-2 space-y-4">
          {reviews.length === 0 ? (
            <div className="glass rounded-2xl p-8 text-center">
              <p className="text-white/70">No reviews yet.</p>
            </div>
          ) : (
            reviews.map((r) => (
              <GlassCard key={r.id} className="p-6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-white">{r.userName}</p>
                    <p className="text-white/50 text-sm">{new Date(r.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((v) => (
                      <Star key={v} className={`w-4 h-4 ${r.rating >= v ? 'text-gold fill-gold' : 'text-white/20'}`} />
                    ))}
                  </div>
                </div>

                <p className="text-white/75 mt-4 leading-relaxed">{r.comment}</p>

                {r.imageUrl && (
                  <div className="mt-4 overflow-hidden rounded-2xl border border-white/10">
                    <img src={r.imageUrl} alt="Review" className="w-full h-56 object-cover" loading="lazy" />
                  </div>
                )}
              </GlassCard>
            ))
          )}
        </div>
      </div>
    </section>
  )
}
