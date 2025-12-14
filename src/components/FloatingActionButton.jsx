import { Link } from 'react-router-dom'
import { Sparkles } from 'lucide-react'

export default function FloatingActionButton() {
  return (
    <div className="fixed bottom-24 md:bottom-8 right-4 md:right-8 z-40">
      <Link
        to="/discover"
        className="inline-flex items-center gap-2 button-primary rounded-full px-5 py-4 shadow-glow"
        aria-label="Open Discover"
      >
        <Sparkles className="w-5 h-5" aria-hidden="true" />
        <span className="hidden sm:inline">Discover</span>
      </Link>
    </div>
  )
}
