import { useEffect } from 'react'
import { Heart, Sparkles } from 'lucide-react'
import useFavorites from '../hooks/useFavorites'
import ShareButtons from './ShareButtons'

export default function ProductModal({ product, onClose, relatedProducts }) {
  const { isFavorite, toggleFavorite } = useFavorites()
  const fav = isFavorite('products', product.id)

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleEscape)
    document.body.style.overflow = 'hidden'

    return () => {
      window.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [onClose])

  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="glass-strong rounded-3xl max-w-5xl w-full max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 z-10 flex items-center justify-between p-4 md:p-5 border-b border-white/10 bg-midnight/40 backdrop-blur">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-neonCyan" />
            <p className="text-white/80 text-sm">Product Preview</p>
          </div>
          <button onClick={onClose} className="button-ghost text-xl font-bold" aria-label="Close modal">
            ×
          </button>
        </div>

        <div className="p-6 md:p-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-white/5 h-72 md:h-96">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
              {product.tag && (
                <span className="absolute top-4 left-4 bg-white/10 border border-white/10 px-4 py-2 rounded-full text-sm font-semibold text-white">
                  {product.tag}
                </span>
              )}
            </div>

            <div>
              <p className="text-white/60 text-sm mb-2">{product.category}</p>
              <h2 id="modal-title" className="heading-medium mb-4">
                {product.name}
              </h2>

              <p className="text-4xl font-semibold text-white mb-4">${product.price.toFixed(2)}</p>
              <p className="text-white/70 mb-6 leading-relaxed">{product.description}</p>

              <div className="flex flex-wrap gap-2 mb-6">
                <button
                  type="button"
                  onClick={() => toggleFavorite('products', product.id)}
                  className="button-secondary inline-flex items-center gap-2"
                >
                  <Heart className={`w-4 h-4 ${fav ? 'text-neonPink fill-neonPink' : 'text-white/70'}`} />
                  {fav ? 'Saved' : 'Save'}
                </button>
                <ShareButtons title={product.name} text="Check this out on Samarkand Mall Explorer" />
              </div>

              <div className="space-y-3">
                <button className="button-primary w-full text-center block">Add to Cart (future-ready)</button>
                <button className="button-secondary w-full text-center block">AR Preview (placeholder)</button>
              </div>
            </div>
          </div>

          {relatedProducts && relatedProducts.length > 0 && (
            <div className="border-t border-white/10 pt-10">
              <h3 className="heading-small mb-6">Related Products</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {relatedProducts.map((relProduct) => (
                  <div key={relProduct.id} className="rounded-2xl overflow-hidden bg-white/5 border border-white/10 p-3">
                    <img
                      src={relProduct.image}
                      alt={relProduct.name}
                      className="w-full h-32 object-cover rounded-xl mb-2"
                      loading="lazy"
                    />
                    <p className="text-xs font-semibold text-white truncate">{relProduct.name}</p>
                    <p className="text-xs text-white/70 font-semibold">${relProduct.price.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
