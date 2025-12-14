import { useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function FeaturedCarousel({ title, children }) {
  const ref = useRef(null)

  const scrollBy = (dx) => {
    ref.current?.scrollBy({ left: dx, behavior: 'smooth' })
  }

  return (
    <div>
      {title && (
        <div className="flex items-center justify-between gap-3 mb-4">
          <h3 className="heading-small">{title}</h3>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => scrollBy(-360)}
              className="button-ghost"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => scrollBy(360)}
              className="button-ghost"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      <div
        ref={ref}
        className="hide-scrollbar flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scroll-smooth"
      >
        {children}
      </div>
    </div>
  )
}
