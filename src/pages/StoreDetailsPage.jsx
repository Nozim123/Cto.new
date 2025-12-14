import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import mallsData from '../data/malls.json'
import storesData from '../data/stores.json'
import productsData from '../data/products.json'
import ProductCard from '../components/ProductCard'
import ProductModal from '../components/ProductModal'

export default function StoreDetailsPage() {
  const { mallId, storeId } = useParams()
  const [mall, setMall] = useState(null)
  const [store, setStore] = useState(null)
  const [products, setProducts] = useState([])
  const [selectedProduct, setSelectedProduct] = useState(null)

  useEffect(() => {
    const mallData = mallsData.find((m) => m.id === mallId)
    setMall(mallData)

    const storeData = storesData.find((s) => s.id === storeId && s.mallId === mallId)
    setStore(storeData)

    const storeProducts = productsData.filter((p) => p.storeId === storeId)
    setProducts(storeProducts)
  }, [mallId, storeId])

  if (!mall || !store) {
    return (
      <div className="section-padding text-center">
        <h1 className="heading-large mb-4">Store Not Found</h1>
        <Link to="/" className="button-primary inline-block">
          Back to Home
        </Link>
      </div>
    )
  }

  const getRelatedProducts = () => {
    const others = products.filter((p) => p.id !== selectedProduct?.id)
    return others.slice(0, 4)
  }

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <div className="max-w-6xl mx-auto px-4 lg:px-8 pt-6">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-6 flex-wrap">
          <Link to="/" className="hover:text-gold transition-colors duration-300">
            Home
          </Link>
          <span>/</span>
          <Link to={`/mall/${mallId}`} className="hover:text-gold transition-colors duration-300">
            {mall.name}
          </Link>
          <span>/</span>
          <Link to={`/mall/${mallId}/stores`} className="hover:text-gold transition-colors duration-300">
            Directory
          </Link>
          <span>/</span>
          <span className="text-navy font-semibold">{store.name}</span>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-navy to-navy/90 text-cream">
        <div className="max-w-6xl mx-auto px-4 lg:px-8 py-12 md:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Logo */}
            <div className="flex items-center justify-center">
              <div className="bg-white bg-opacity-10 rounded-lg p-8 w-full h-64 md:h-80 flex items-center justify-center overflow-hidden">
                <img
                  src={store.logo}
                  alt={store.name}
                  className="w-full h-full object-cover rounded"
                  loading="lazy"
                />
              </div>
            </div>

            {/* Details */}
            <div>
              <p className="text-gold text-sm font-semibold mb-2">{store.category}</p>
              <h1 className="text-4xl md:text-5xl font-display font-bold text-cream mb-6">
                {store.name}
              </h1>

              <div className="space-y-3 mb-8 text-cream text-opacity-90">
                <p className="flex items-center gap-2">
                  <span className="text-gold font-semibold">📍 Floor:</span> {store.floor}
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-gold font-semibold">🕒 Hours:</span> {store.hours}
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-gold font-semibold">📞 Phone:</span> {store.phone}
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-gold font-semibold">✉️ Email:</span> {store.email}
                </p>
              </div>

              <div className="space-x-4">
                <button className="button-primary inline-block">
                  Visit Store
                </button>
                <Link to={`/mall/${mallId}/stores`} className="button-secondary inline-block">
                  Back to Directory
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interior Image */}
      <div className="relative w-full h-64 md:h-96 overflow-hidden bg-gray-200">
        <img
          src={store.interiorImage}
          alt={`${store.name} interior`}
          className="w-full h-full object-cover lazy"
          loading="lazy"
        />
      </div>

      {/* About Section */}
      <section className="section-padding max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h2 className="heading-medium mb-6">About {store.name}</h2>
            <p className="text-gray-700 mb-6 leading-relaxed text-lg">
              {store.about}
            </p>

            <div className="bg-cream p-6 rounded-lg">
              <h3 className="font-semibold text-navy mb-4">Store Information</h3>
              <div className="space-y-3 text-gray-700">
                <p>
                  <span className="font-semibold">Category:</span> {store.category}
                </p>
                <p>
                  <span className="font-semibold">Location:</span> Floor {store.floor}, {mall.name}
                </p>
                <p>
                  <span className="font-semibold">Status:</span>{' '}
                  <span className={store.status === 'open' ? 'text-green-600 font-semibold' : 'text-yellow-600 font-semibold'}>
                    {store.status === 'open' ? '● Open' : '● Coming Soon'}
                  </span>
                </p>
                <p>
                  <span className="font-semibold">Hours:</span> {store.hours}
                </p>
              </div>
            </div>
          </div>

          {/* Contact Card */}
          <div className="bg-navy text-cream rounded-lg p-8 card-shadow">
            <h3 className="font-display text-2xl font-bold mb-6">Get in Touch</h3>

            <div className="space-y-6">
              <div>
                <p className="text-gold font-semibold mb-2">Phone</p>
                <p className="text-cream">{store.phone}</p>
              </div>

              <div>
                <p className="text-gold font-semibold mb-2">Email</p>
                <p className="text-cream">{store.email}</p>
              </div>

              <div>
                <p className="text-gold font-semibold mb-2">Visit Us</p>
                <p className="text-cream text-opacity-80">
                  Floor {store.floor}, {mall.name}
                  <br />
                  {mall.address}
                </p>
              </div>

              <button className="button-primary w-full text-center block">
                Send Inquiry
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      {products.length > 0 && (
        <section className="section-padding max-w-6xl mx-auto bg-cream rounded-lg">
          <h2 className="heading-medium mb-10 text-center">Featured Products</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelect={setSelectedProduct}
              />
            ))}
          </div>
        </section>
      )}

      {/* Product Modal */}
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
