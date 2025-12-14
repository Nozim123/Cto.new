import { useEffect } from 'react'

export default function ProductModal({ product, onClose, relatedProducts }) {
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
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="bg-white rounded-lg max-w-4xl w-full max-h-96 md:max-h-full overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <div className="flex justify-end p-4 border-b border-gray-200 sticky top-0 bg-white">
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-navy text-2xl font-bold p-1"
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6 md:p-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            {/* Image */}
            <div className="flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden h-64 md:h-80">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Details */}
            <div>
              <p className="text-sage text-sm mb-2">{product.category}</p>
              <h2 id="modal-title" className="heading-medium mb-4">
                {product.name}
              </h2>

              <div className="mb-6">
                <p className="text-4xl font-bold text-gold mb-4">
                  ${product.price.toFixed(2)}
                </p>
                {product.tag && (
                  <span className="inline-block bg-gold text-navy px-4 py-2 rounded-full text-sm font-semibold mb-4">
                    {product.tag}
                  </span>
                )}
              </div>

              <p className="text-gray-700 mb-6 leading-relaxed">
                {product.description}
              </p>

              {/* Actions */}
              <div className="space-y-3">
                <button className="button-primary w-full text-center block">
                  Add to Cart
                </button>
                <button
                  onClick={onClose}
                  className="button-secondary w-full text-center block"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts && relatedProducts.length > 0 && (
            <div className="border-t border-gray-200 pt-10">
              <h3 className="heading-small mb-6">Related Products</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {relatedProducts.map((relProduct) => (
                  <div
                    key={relProduct.id}
                    className="bg-gray-50 rounded-lg overflow-hidden p-3"
                  >
                    <img
                      src={relProduct.image}
                      alt={relProduct.name}
                      className="w-full h-32 object-cover rounded mb-2 lazy"
                      loading="lazy"
                    />
                    <p className="text-xs font-semibold text-navy truncate">
                      {relProduct.name}
                    </p>
                    <p className="text-xs text-gold font-bold">
                      ${relProduct.price.toFixed(2)}
                    </p>
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
