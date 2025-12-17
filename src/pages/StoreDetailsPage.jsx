import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { trackBehavior } from '../services/behavior'
import mallsData from '../data/malls.json'
import storesData from '../data/stores.json'
import productsData from '../data/products.json'
import ProductCard from '../components/ProductCard'
import ProductModal from '../components/ProductModal'
import Button3D from '../components/Button3D'

export default function StoreDetailsPage() {
  const { mallId, storeId } = useParams()
  const [mall, setMall] = useState(null)
  const [store, setStore] = useState(null)
  const [products, setProducts] = useState([])
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 300)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    // If mallId is not in URL but we have storeId (future proofing), we'd find it.
    // But currently routing assumes /mall/:mallId/store/:storeId
    
    let currentMallId = mallId;
    let currentStore = storesData.find((s) => s.id === storeId);
    
    if (currentStore && !currentMallId) {
        currentMallId = currentStore.mallId;
    }

    const mallData = mallsData.find((m) => m.id === currentMallId)
    setMall(mallData)
    setStore(currentStore)

    if (currentStore) {
      trackBehavior({ type: 'store', id: storeId, category: currentStore.category })
    }

    const storeProducts = productsData.filter((p) => p.storeId === storeId)
    setProducts(storeProducts)
    
    window.scrollTo(0, 0)
  }, [mallId, storeId])

  if (!mall || !store) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-navy">Store Not Found</h1>
          <Link to="/" className="text-gold hover:underline">
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  const getRelatedProducts = () => {
    const others = products.filter((p) => p.id !== selectedProduct?.id)
    return others.slice(0, 4)
  }

  const handleSelectProduct = (product) => {
    trackBehavior({ type: 'product_quick_view', id: product.id, category: product.category })
    setSelectedProduct(product)
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Sticky Header */}
      <div className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4 translate-y-[-100%]'
      }`}>
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <img src={store.logo} alt={store.name} className="w-10 h-10 rounded object-cover border border-gray-200" />
             <span className="font-bold text-navy text-lg">{store.name}</span>
          </div>
          <div className="flex gap-4">
             <Link to={`/mall/${mallId}`} className="text-sm font-medium text-gray-600 hover:text-gold">
                Back to {mall.name}
             </Link>
          </div>
        </div>
      </div>

      {/* Banner Section */}
      <div className="relative h-64 md:h-80 lg:h-96 w-full bg-gray-800 overflow-hidden">
        <img
          src={store.heroImage || store.interiorImage || store.image}
          alt={store.name}
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
        
        {/* Breadcrumb over banner */}
        <div className="absolute top-24 left-0 w-full px-4 lg:px-8">
            <div className="max-w-7xl mx-auto text-white/80 text-sm flex items-center gap-2">
                <Link to="/" className="hover:text-white">Home</Link>
                <span>/</span>
                <Link to={`/mall/${mallId}`} className="hover:text-white">{mall.name}</Link>
                <span>/</span>
                <span className="text-white font-medium">{store.name}</span>
            </div>
        </div>
      </div>

      {/* Seller Profile Info */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 relative -mt-20 sm:-mt-24 mb-12">
        <div className="bg-white rounded-xl shadow-xl p-6 md:p-8 flex flex-col md:flex-row gap-8 items-start">
            {/* Logo */}
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-xl bg-white p-2 shadow-lg -mt-16 md:-mt-20 flex-shrink-0 relative z-10">
                <img src={store.logo} alt={store.name} className="w-full h-full object-contain rounded-lg border border-gray-100" />
                <div className={`absolute bottom-2 right-2 w-4 h-4 rounded-full border-2 border-white ${store.status === 'open' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
            </div>

            {/* Info */}
            <div className="flex-grow pt-2 md:pt-0">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                    <div>
                        <h1 className="text-3xl font-display font-bold text-navy mb-1">{store.name}</h1>
                        <p className="text-gray-500 text-sm font-medium">{store.category} • Floor {store.floor}</p>
                    </div>
                    <div className="flex gap-3">
                        <Button3D variant="primary" className="px-6">Follow Store</Button3D>
                        <Button3D variant="outline" className="px-4">Share</Button3D>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm border-t border-gray-100 pt-6">
                    <div>
                        <span className="block text-gray-400 text-xs uppercase tracking-wider mb-1">About</span>
                        <p className="text-gray-700 leading-relaxed line-clamp-3">{store.description}</p>
                    </div>
                    <div>
                        <span className="block text-gray-400 text-xs uppercase tracking-wider mb-1">Hours</span>
                        <p className="text-navy font-medium">{store.hours}</p>
                        <p className="text-green-600 text-xs mt-1">{store.status === 'open' ? 'Currently Open' : 'Closed'}</p>
                    </div>
                    <div>
                         <span className="block text-gray-400 text-xs uppercase tracking-wider mb-1">Contact</span>
                         <p className="text-gray-700">{store.phone}</p>
                         <p className="text-gray-700">{store.email}</p>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Sidebar (Categories/Filters) - Desktop */}
            <div className="hidden lg:block w-64 flex-shrink-0">
                <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
                    <h3 className="font-bold text-navy mb-4">Store Categories</h3>
                    <ul className="space-y-2 text-sm">
                        <li className="font-medium text-gold">All Products ({products.length})</li>
                        <li className="text-gray-600 hover:text-navy cursor-pointer">New Arrivals</li>
                        <li className="text-gray-600 hover:text-navy cursor-pointer">Best Sellers</li>
                        <li className="text-gray-600 hover:text-navy cursor-pointer">On Sale</li>
                    </ul>

                    <div className="mt-8">
                        <h3 className="font-bold text-navy mb-4">Price Range</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                             <input type="number" placeholder="Min" className="w-full border rounded px-2 py-1" />
                             <span>-</span>
                             <input type="number" placeholder="Max" className="w-full border rounded px-2 py-1" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Product Grid */}
            <div className="flex-grow">
                 <div className="flex justify-between items-center mb-6">
                     <h2 className="text-xl font-bold text-navy">Products</h2>
                     <select className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold">
                         <option>Sort by: Featured</option>
                         <option>Price: Low to High</option>
                         <option>Price: High to Low</option>
                     </select>
                 </div>

                 {products.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                        {products.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            onSelect={handleSelectProduct}
                        />
                        ))}
                    </div>
                 ) : (
                    <div className="bg-white rounded-xl p-12 text-center text-gray-500">
                        <p>No products available in this store yet.</p>
                    </div>
                 )}
            </div>
        </div>
      </div>

      {/* Product Modal (Quick View) */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          relatedProducts={getRelatedProducts()}
        />
      )}
    </div>
  )
}
