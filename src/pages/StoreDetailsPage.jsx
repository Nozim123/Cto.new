import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { MapPin, Phone, Clock, Navigation, Star, Heart, Share2, Tag, ChevronRight, ShoppingBag, Info, Grid, List } from 'lucide-react'
import storesData from '../data/stores.json'
import mallsData from '../data/malls.json'
import productsData from '../data/products.json'
import MTCProductCard from '../components/MTCProductCard'
import ReviewsSection from '../components/ReviewsSection'
import SmartRecommendations from '../components/SmartRecommendations'

export default function StoreDetailsPage() {
  const { storeId, mallId } = useParams()
  const [store, setStore] = useState(null)
  const [mall, setMall] = useState(null)
  const [products, setProducts] = useState([])
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [viewMode, setViewMode] = useState('grid')

  useEffect(() => {
    window.scrollTo(0, 0)
    const storeData = storesData.find(s => s.id === storeId)
    setStore(storeData)
    
    if (storeData) {
      const mallData = mallsData.find(m => m.id === storeData.mallId || m.id === mallId)
      setMall(mallData)
      
      const storeProducts = productsData.filter(p => p.storeId === storeId)
      setProducts(storeProducts)
    }
  }, [storeId, mallId])

  if (!store) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-mtc-bg">
        <div className="text-center">
          <h1 className="mtc-heading-lg mb-4">Store Not Found</h1>
          <Link to="/stores" className="mtc-button-primary inline-block">Browse All Stores</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-mtc-bg text-white pb-24">
      {/* Hero Gallery Section */}
      <div className="relative h-[40vh] md:h-[50vh] w-full overflow-hidden">
        <img
          src={store.image || 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=1920&h=800&fit=crop'}
          alt={store.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(37,40,54,1)] via-[rgba(37,40,54,0.4)] to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 py-8">
          <div className="mtc-container flex flex-col md:flex-row items-end gap-6">
             {/* Store Logo */}
             <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl bg-mtc-bg p-3 border border-white/10 shadow-2xl relative z-20">
                <div className="w-full h-full rounded-2xl bg-white/5 flex items-center justify-center overflow-hidden">
                   <img 
                    src={store.logo} 
                    alt={store.name} 
                    className="w-full h-full object-contain filter brightness-0 invert"
                   />
                </div>
             </div>
             
             <div className="flex-grow mb-2">
                <div className="mtc-badge mtc-badge-primary mb-3">{store.category}</div>
                <h1 className="mtc-heading-lg mb-1">{store.name}</h1>
                <div className="flex flex-wrap items-center gap-4 text-white/60">
                   <div className="flex items-center gap-1">
                      <Star size={16} fill="currentColor" className="text-yellow-400" />
                      <span className="font-semibold text-white">{store.rating || '4.8'}</span>
                      <span className="text-xs">({store.reviewCount || '120'} reviews)</span>
                   </div>
                   <div className="flex items-center gap-1">
                      <MapPin size={16} className="text-blue-400" />
                      <span className="text-sm">{mall?.name || 'MTC Mall'} • Floor {store.floor || '1'}</span>
                   </div>
                </div>
             </div>
             
             <div className="flex gap-3 mb-2">
                <button 
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className={`p-3 rounded-2xl border transition-all ${
                    isWishlisted 
                      ? 'bg-red-500/20 border-red-500 text-red-500' 
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}
                >
                   <Heart size={20} fill={isWishlisted ? 'currentColor' : 'none'} />
                </button>
                <button className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                   <Share2 size={20} />
                </button>
                <button className="mtc-button-primary px-8">Follow</button>
             </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mtc-container mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Sidebar Info */}
          <div className="lg:col-span-1 space-y-8">
            <section>
              <h3 className="mtc-heading-sm mb-4">About Store</h3>
              <p className="mtc-body-sm text-white/60 leading-relaxed">
                {store.description}
              </p>
            </section>
            
            <section className="mtc-glass p-6 rounded-3xl space-y-4">
              <div className="flex items-center gap-3">
                 <Clock size={20} className="text-blue-400" />
                 <div>
                    <div className="text-xs text-white/40 uppercase tracking-wider">Working Hours</div>
                    <div className="font-medium">{store.workingHours || '10:00 - 22:00'}</div>
                 </div>
              </div>
              <div className="flex items-center gap-3">
                 <Phone size={20} className="text-blue-400" />
                 <div>
                    <div className="text-xs text-white/40 uppercase tracking-wider">Phone Number</div>
                    <div className="font-medium">{store.phone || '+998 90 123 45 67'}</div>
                 </div>
              </div>
              <div className="flex items-center gap-3">
                 <Navigation size={20} className="text-blue-400" />
                 <div>
                    <div className="text-xs text-white/40 uppercase tracking-wider">Location</div>
                    <div className="font-medium">Area {store.location || 'A-12'}</div>
                 </div>
              </div>
            </section>

            <section className="mtc-glass p-6 rounded-3xl overflow-hidden relative group cursor-pointer">
               <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
               <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-3">
                     <Tag size={20} className="text-emerald-400" />
                     <span className="font-medium">Current Deals</span>
                  </div>
                  <ChevronRight size={16} className="text-white/40 group-hover:translate-x-1 transition-transform" />
               </div>
            </section>
          </div>

          {/* Product Grid Area */}
          <div className="lg:col-span-3">
             <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <h2 className="mtc-heading-md">Our Products</h2>
                <div className="flex items-center gap-4">
                   <div className="flex p-1 bg-white/5 rounded-xl border border-white/10">
                      <button 
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white'}`}
                      >
                         <Grid size={20} />
                      </button>
                      <button 
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white'}`}
                      >
                         <List size={20} />
                      </button>
                   </div>
                   <select className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm outline-none">
                      <option className="bg-mtc-bg">New Arrivals</option>
                      <option className="bg-mtc-bg">Price: Low to High</option>
                      <option className="bg-mtc-bg">Price: High to Low</option>
                      <option className="bg-mtc-bg">Most Popular</option>
                   </select>
                </div>
             </div>

             {products.length > 0 ? (
               <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                 {products.map((product, index) => (
                   <MTCProductCard key={product.id} product={product} delay={index * 0.05} />
                 ))}
               </div>
             ) : (
               <div className="text-center py-20 mtc-glass rounded-3xl">
                  <ShoppingBag size={48} className="mx-auto mb-4 text-white/10" />
                  <h3 className="text-xl font-medium mb-2">No Products Yet</h3>
                  <p className="mtc-body-sm text-white/40">This store hasn't uploaded any products yet.</p>
               </div>
             )}
             
             {/* Promotions Carousel */}
             <section className="mt-20">
                <div className="flex justify-between items-end mb-8">
                   <h2 className="mtc-heading-md">Promotions</h2>
                   <button className="text-blue-400 text-sm font-medium hover:underline">View All Deals</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <PromoCard 
                    title="Spring Collection Sale" 
                    discount="Up to 40% OFF" 
                    image="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=300&fit=crop" 
                   />
                   <PromoCard 
                    title="Student Discount" 
                    discount="Flat 15% OFF" 
                    image="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=300&fit=crop" 
                   />
                </div>
             </section>

             {/* Recommended Carousel */}
             <section className="mt-20">
                <h2 className="mtc-heading-md mb-8">Recommended for you</h2>
                <SmartRecommendations type="store" id={storeId} limit={4} />
             </section>
             
             {/* Reviews */}
             <section className="mt-20">
                <ReviewsSection entityType="store" entityId={storeId} entityName={store.name} />
             </section>
          </div>
        </div>
      </div>
    </div>
  )
}

function PromoCard({ title, discount, image }) {
  return (
    <div className="relative aspect-[21/9] rounded-3xl overflow-hidden group cursor-pointer">
       <img src={image} alt={title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
       <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent flex flex-col justify-center p-8">
          <div className="mtc-badge mtc-badge-danger w-fit mb-2">{discount}</div>
          <h3 className="mtc-heading-sm mb-4">{title}</h3>
          <button className="flex items-center gap-2 text-sm font-bold text-white group-hover:gap-3 transition-all">
             Claim Offer <ChevronRight size={16} />
          </button>
       </div>
    </div>
  )
}
