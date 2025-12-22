import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTheme } from '../contexts/ThemeContext'
import { useLanguage } from '../contexts/LanguageContext'
import Button3D from './Button3D'

export default function ProductQuickView({ product, onClose }) {
  const { darkMode } = useTheme()
  const { t } = useLanguage()
  const [selectedImage, setSelectedImage] = useState(0)

  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = prev
    }
  }, [])

  if (!product) return null

  const images = product.gallery || [product.image]

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div 
        className={`relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl transform transition-all duration-300 animate-slide-up ${
          darkMode ? 'bg-gray-900' : 'bg-white'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
            darkMode 
              ? 'bg-gray-800 hover:bg-gray-700 text-white' 
              : 'bg-white hover:bg-gray-100 text-gray-900'
          } shadow-lg`}
        >
          ✕
        </button>

        <div className="grid md:grid-cols-2 gap-6 p-6 md:p-8">
          {/* Left: Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100">
              <img
                src={images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              
              {/* Discount Badge */}
              {product.tag && (
                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-lg text-sm font-bold">
                  {product.tag}
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                      selectedImage === idx
                        ? 'border-purple-500 scale-105'
                        : 'border-gray-300 hover:border-purple-300'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Details */}
          <div className="flex flex-col">
            {/* Category */}
            <div className="text-xs font-bold text-purple-600 uppercase tracking-wider mb-2">
              {product.category}
            </div>

            {/* Product Name */}
            <h2 className={`text-2xl md:text-3xl font-bold mb-4 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {product.name}
            </h2>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className={`text-3xl md:text-4xl font-bold ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                ${product.price.toFixed(2)}
              </span>
              {product.tag && (
                <span className="text-lg text-gray-400 line-through">
                  ${(product.price * 1.2).toFixed(2)}
                </span>
              )}
            </div>

            {/* Availability */}
            <div className="flex items-center gap-2 mb-6">
              <div className={`w-2 h-2 rounded-full ${
                product.availability === 'In Stock' ? 'bg-green-500' : 'bg-red-500'
              }`}></div>
              <span className={`text-sm font-medium ${
                product.availability === 'In Stock' ? 'text-green-500' : 'text-red-500'
              }`}>
                {product.availability || 'In Stock'}
              </span>
            </div>

            {/* Description */}
            <p className={`text-sm leading-relaxed mb-6 ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              {product.description || 'No description available.'}
            </p>

            {/* Specifications */}
            {product.specifications && (
              <div className={`mb-6 p-4 rounded-lg ${
                darkMode ? 'bg-gray-800' : 'bg-gray-50'
              }`}>
                <h3 className={`text-sm font-bold mb-3 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {t('product.specifications') || 'Specifications'}
                </h3>
                <div className="space-y-2">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between text-sm">
                      <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                        {key}:
                      </span>
                      <span className={darkMode ? 'text-gray-200' : 'text-gray-900'}>
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-auto space-y-3">
              <Link to={`/product/${product.id}`} className="block">
                <Button3D variant="primary" className="w-full py-3 text-base">
                  {t('buttons.viewFullDetails') || 'View Full Details'}
                </Button3D>
              </Link>
              
              <div className="grid grid-cols-2 gap-3">
                <Button3D variant="outline" className="py-2">
                  ❤️ {t('buttons.addToWishlist') || 'Save'}
                </Button3D>
                <Button3D variant="outline" className="py-2">
                  📤 {t('buttons.share') || 'Share'}
                </Button3D>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
