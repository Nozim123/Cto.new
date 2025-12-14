export default function ProductCard({ product, onSelect }) {
  return (
    <div
      onClick={() => onSelect(product)}
      className="bg-white rounded-lg overflow-hidden card-shadow cursor-pointer group h-full flex flex-col"
      role="button"
      tabIndex={0}
      onKeyPress={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onSelect(product)
        }
      }}
      aria-label={`${product.name}, $${product.price.toFixed(2)}`}
    >
      {/* Image */}
      <div className="relative overflow-hidden bg-gray-100 h-48 sm:h-56">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 lazy"
          loading="lazy"
        />
        {product.tag && (
          <div className="absolute top-3 right-3 bg-gold text-navy px-3 py-1 rounded-full text-xs font-semibold">
            {product.tag}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex-grow flex flex-col justify-between">
        <div>
          <p className="text-sage text-sm mb-1">{product.category}</p>
          <h3 className="font-display text-lg font-bold text-navy group-hover:text-gold transition-colors duration-300 mb-2">
            {product.name}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-2">
            {product.description}
          </p>
        </div>

        {/* Price */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-2xl font-bold text-gold">
            ${product.price.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  )
}
