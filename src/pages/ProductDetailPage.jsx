import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { trackBehavior } from '../services/behavior'
import mallsData from '../data/malls.json'
import storesData from '../data/stores.json'
import Button3D from '../components/Button3D'
import { useScrollToTop } from '../hooks/useScrollToTop'
import { useEcosystem } from '../contexts/EcosystemContext'

export default function ProductDetailPage() {
  const { productId } = useParams()
  const [product, setProduct] = useState(null)
  const [store, setStore] = useState(null)
  const [mall, setMall] = useState(null)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [activeImage, setActiveImage] = useState('')
  const [selectedSize, setSelectedSize] = useState('')
  const [quantity, setQuantity] = useState(1)

  const { getProductById, getProductsByStore, addRecentlyViewed, awardPoints, toggleCompare } = useEcosystem()

  useScrollToTop()

  useEffect(() => {
    window.scrollTo(0, 0)

    const productData = getProductById(productId)

    if (!productData) {
      return
    }

    setProduct(productData)
    setActiveImage(productData.image)

    const storeData = storesData.find((s) => s.id === productData.storeId)
    setStore(storeData)

    if (storeData) {
      const mallData = mallsData.find((m) => m.id === storeData.mallId)
      setMall(mallData)
    }

    const related = getProductsByStore(productData.storeId)
      .filter((p) => p.id !== productId)
      .slice(0, 4)
    setRelatedProducts(related)

    addRecentlyViewed('products', productId)
    awardPoints(2, 'view_product')
    trackBehavior({ type: 'product', id: productId, category: productData.category })
  }, [productId, addRecentlyViewed, awardPoints, getProductById, getProductsByStore])

  if (!product) {
    return (
      <div className="min-h-screen bg-primary-dark text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <p className="text-gray-400 mb-6">The product you're looking for doesn't exist.</p>
          <Link to="/" className="inline-block px-6 py-3 bg-gold text-navy rounded-lg hover:bg-gold/90">
            Go to Home
          </Link>
        </div>
      </div>
    )
  }

  if (!store || !mall) {
    return (
      <div className="min-h-screen bg-primary-dark text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold mx-auto mb-4"></div>
          <p>Loading product details...</p>
        </div>
      </div>
    )
  }

  const gallery = product.gallery || [product.image]
  const specs = product.specifications || {}
  const sizes = product.sizes || ['S', 'M', 'L', 'XL'] // Fallback if not in data

  return (
    <div className="relative min-h-screen bg-primary-dark text-white font-sans selection:bg-gold selection:text-primary-dark">
      <main className="relative z-10 pt-24 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
        {/* Breadcrumbs */}
        <nav className="flex items-center text-sm text-gray-400 mb-8 overflow-x-auto whitespace-nowrap pb-2">
          <Link to="/" className="hover:text-gold transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <Link to={`/mall/${mall.id}`} className="hover:text-gold transition-colors">{mall.name}</Link>
          <span className="mx-2">/</span>
          <Link to={`/mall/${mall.id}/store/${store.id}`} className="hover:text-gold transition-colors">{store.name}</Link>
          <span className="mx-2">/</span>
          <span className="text-white font-medium truncate">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Left Column - Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square bg-white/5 rounded-2xl overflow-hidden border border-white/10 relative group">
              <img 
                src={activeImage} 
                alt={product.name} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              {product.tag && (
                <div className="absolute top-4 left-4 bg-gold text-primary-dark px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  {product.tag}
                </div>
              )}
            </div>

            {/* Gallery Thumbnails */}
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {gallery.map((img, index) => (
                <button 
                  key={index}
                  onClick={() => setActiveImage(img)}
                  className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${activeImage === img ? 'border-gold opacity-100' : 'border-transparent opacity-60 hover:opacity-100'}`}
                >
                  <img src={img} alt={`${product.name} view ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column - Product Info */}
          <div>
            <div className="mb-2 text-gold font-medium tracking-wide uppercase text-sm">
              {product.brand || store.name}
            </div>
            
            <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
              {product.name}
            </h1>

            <div className="flex items-center gap-4 mb-6">
              <div className="text-3xl font-bold text-white">
                ${product.price.toFixed(2)}
              </div>
              <div className="text-green-400 text-sm font-medium bg-green-400/10 px-3 py-1 rounded-full flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-400 block"></span>
                {product.availability || 'In Stock'}
              </div>
            </div>

            <div className="prose prose-invert prose-lg text-gray-300 mb-8 leading-relaxed max-w-none">
              <p>{product.description}</p>
            </div>

            {/* Product Configuration */}
            <div className="space-y-6 mb-8 border-t border-white/10 pt-6">
              {/* Sizes (Mock) */}
              {product.category.includes('Apparel') || product.category.includes('Footwear') ? (
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-3">Select Size</label>
                  <div className="flex flex-wrap gap-3">
                    {sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`w-12 h-12 rounded-lg flex items-center justify-center font-medium transition-all ${
                          selectedSize === size 
                            ? 'bg-gold text-primary-dark shadow-[0_0_15px_rgba(212,175,55,0.4)]' 
                            : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}

              {/* Quantity */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-3">Quantity</label>
                <div className="flex items-center bg-white/5 rounded-lg border border-white/10 w-fit">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center text-gray-300 hover:text-white transition-colors"
                  >
                    -
                  </button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 flex items-center justify-center text-gray-300 hover:text-white transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 flex-col sm:flex-row mb-4">
              <div className="flex-1">
                <Button3D variant="primary" className="w-full py-4 text-lg">
                  Add to Cart
                </Button3D>
              </div>
              <div className="flex-1">
                <Button3D variant="outline" className="w-full py-4 text-lg">
                  Buy Now
                </Button3D>
              </div>
            </div>

            <button
              type="button"
              onClick={() => toggleCompare(product.id)}
              className="w-full mb-10 px-4 py-3 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors font-semibold"
            >
              Compare
            </button>

            {/* Features/Specs */}
            <div className="bg-white/5 rounded-xl border border-white/10 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Specifications</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-8">
                {Object.entries(specs).map(([key, value]) => (
                  <div key={key} className="flex justify-between border-b border-white/5 pb-2 last:border-0 last:pb-0">
                    <span className="text-gray-400">{key}</span>
                    <span className="text-white font-medium">{value}</span>
                  </div>
                ))}
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-gray-400">Category</span>
                  <span className="text-white font-medium">{product.category}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-gray-400">Store</span>
                  <Link to={`/mall/${mall.id}/store/${store.id}`} className="text-gold hover:underline font-medium">{store.name}</Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="border-t border-white/10 pt-16">
            <h2 className="text-2xl font-display font-bold text-white mb-8">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <Link key={p.id} to={`/product/${p.id}`} className="group">
                  <div className="bg-white/5 rounded-xl overflow-hidden border border-white/10 hover:border-gold/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <div className="aspect-square relative overflow-hidden">
                      <img 
                        src={p.image} 
                        alt={p.name} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      {p.tag && (
                        <div className="absolute top-2 left-2 bg-gold/90 text-primary-dark text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
                          {p.tag}
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="text-xs text-gray-400 mb-1">{p.category}</div>
                      <h3 className="font-medium text-white mb-2 truncate group-hover:text-gold transition-colors">{p.name}</h3>
                      <div className="font-bold text-gold">${p.price.toFixed(2)}</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
      
      {/* Footer is in App.jsx */}
    </div>
  )
}
