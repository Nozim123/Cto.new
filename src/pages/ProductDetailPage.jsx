import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Star, Heart, Share2, ShoppingCart, ShieldCheck, Truck, RotateCcw, ChevronRight, Tag, Zap, Plus, Minus, Info, MessageSquare, HelpCircle } from 'lucide-react'
import productsData from '../data/products.json'
import storesData from '../data/stores.json'
import mallsData from '../data/malls.json'
import MTCProductCard from '../components/MTCProductCard'
import ReviewsSection from '../components/ReviewsSection'

export default function ProductDetailPage() {
  const { productId } = useParams()
  const [product, setProduct] = useState(null)
  const [store, setStore] = useState(null)
  const [mall, setMall] = useState(null)
  const [activeImage, setActiveImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [activeTab, setActiveTab] = useState('description')

  useEffect(() => {
    window.scrollTo(0, 0)
    const pData = productsData.find(p => p.id === productId)
    if (pData) {
      setProduct(pData)
      const sData = storesData.find(s => s.id === pData.storeId)
      setStore(sData)
      if (sData) {
        setMall(mallsData.find(m => m.id === sData.mallId))
      }
    }
  }, [productId])

  if (!product) return null

  const gallery = product.gallery || product.images || [product.image]
  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  return (
    <div className="min-h-screen bg-mtc-bg text-white pb-24">
      <div className="mtc-container pt-8 md:pt-12">
        {/* Breadcrumbs */}
        <nav className="flex items-center text-xs text-white/40 mb-8 overflow-x-auto whitespace-nowrap">
           <Link to="/" className="hover:text-blue-400">Home</Link>
           <ChevronRight size={12} className="mx-2" />
           <Link to="/stores" className="hover:text-blue-400">Stores</Link>
           <ChevronRight size={12} className="mx-2" />
           <Link to={`/mall/${mall?.id}/store/${store?.id}`} className="hover:text-blue-400">{store?.name}</Link>
           <ChevronRight size={12} className="mx-2" />
           <span className="text-white/80 truncate">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {/* Left: Gallery */}
          <div className="space-y-6">
            <div className="relative aspect-square rounded-[2rem] overflow-hidden mtc-card bg-white/5">
               <img 
                src={gallery[activeImage]} 
                alt={product.name} 
                className="w-full h-full object-cover transition-all duration-700 hover:scale-110" 
               />
               
               {discount > 0 && (
                 <div className="absolute top-6 left-6 z-20">
                    <div className="mtc-badge mtc-badge-danger px-4 py-2 text-sm font-bold shadow-lg">
                       -{discount}% OFF
                    </div>
                 </div>
               )}
               
               <button 
                onClick={() => setIsWishlisted(!isWishlisted)}
                className="absolute top-6 right-6 z-20 p-4 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 text-white hover:bg-red-500 transition-all shadow-lg"
               >
                  <Heart size={24} fill={isWishlisted ? 'currentColor' : 'none'} />
               </button>
            </div>
            
            <div className="flex gap-4 overflow-x-auto pb-2">
               {gallery.map((img, idx) => (
                 <button 
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`relative flex-shrink-0 w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all ${
                    activeImage === idx ? 'border-blue-500 scale-105 shadow-mtc-glow' : 'border-transparent opacity-50 hover:opacity-100'
                  }`}
                 >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                 </button>
               ))}
            </div>
          </div>

          {/* Right: Info */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-4">
               <div className="mtc-badge mtc-badge-primary">{product.category}</div>
               <div className="flex items-center gap-1">
                  <Star size={18} fill="currentColor" className="text-yellow-400" />
                  <span className="font-bold text-lg">{product.rating || '4.9'}</span>
                  <span className="text-white/40 text-sm">({product.reviewCount || '85'} reviews)</span>
               </div>
            </div>

            <h1 className="mtc-heading-lg mb-4">{product.name}</h1>
            
            <div className="flex items-center gap-4 mb-8">
               <div className="text-4xl font-bold mtc-gradient-text-gold">
                  {product.price.toLocaleString()} UZS
               </div>
               {product.originalPrice && (
                 <div className="text-xl text-white/30 line-through">
                    {product.originalPrice.toLocaleString()}
                 </div>
               )}
            </div>

            <p className="mtc-body mb-8 text-white/70 leading-relaxed">
               {product.description}
            </p>

            {/* Product Configuration */}
            <div className="space-y-6 mb-10 pb-10 border-b border-white/10">
               {/* Size Selector Mock */}
               <div>
                  <div className="flex justify-between items-center mb-4">
                     <span className="text-sm font-medium text-white/60 uppercase tracking-widest">Select Size</span>
                     <button className="text-xs text-blue-400 hover:underline">Size Guide</button>
                  </div>
                  <div className="flex flex-wrap gap-3">
                     {['S', 'M', 'L', 'XL', '2XL'].map(size => (
                       <button 
                        key={size}
                        className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center font-bold hover:bg-white/10 hover:border-blue-500 transition-all"
                       >
                          {size}
                       </button>
                     ))}
                  </div>
               </div>

               {/* Quantity Selector */}
               <div className="flex items-center gap-6">
                  <div className="space-y-2">
                     <span className="text-sm font-medium text-white/60 uppercase tracking-widest block">Quantity</span>
                     <div className="flex items-center bg-white/5 border border-white/10 rounded-2xl p-1">
                        <button 
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-xl transition-all"
                        >
                           <Minus size={18} />
                        </button>
                        <span className="w-12 text-center font-bold text-lg">{quantity}</span>
                        <button 
                          onClick={() => setQuantity(quantity + 1)}
                          className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-xl transition-all"
                        >
                           <Plus size={18} />
                        </button>
                     </div>
                  </div>
                  
                  <div className="flex-grow pt-7">
                     <button className="mtc-button-primary w-full h-14 flex items-center justify-center gap-3 text-lg">
                        <ShoppingCart size={22} />
                        Add to Cart
                     </button>
                  </div>
               </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 mb-10">
               <TrustBadge icon={<ShieldCheck size={20} />} label="Quality Guarantee" />
               <TrustBadge icon={<Truck size={20} />} label="Fast Delivery" />
               <TrustBadge icon={<RotateCcw size={20} />} label="14 Days Return" />
            </div>
          </div>
        </div>

        {/* Detailed Info Tabs */}
        <div className="mb-20">
           <div className="flex border-b border-white/10 mb-8">
              <TabButton active={activeTab === 'description'} onClick={() => setActiveTab('description')} label="Description" />
              <TabButton active={activeTab === 'specs'} onClick={() => setActiveTab('specs')} label="Specifications" />
              <TabButton active={activeTab === 'reviews'} onClick={() => setActiveTab('reviews')} label="Reviews" />
              <TabButton active={activeTab === 'faq'} onClick={() => setActiveTab('faq')} label="FAQ" />
           </div>
           
           <div className="mtc-glass p-8 md:p-12 rounded-[2.5rem]">
              {activeTab === 'description' && (
                <div className="max-w-4xl">
                   <h3 className="mtc-heading-sm mb-6">Product Information</h3>
                   <p className="mtc-body-lg text-white/70 mb-6">
                      This premium product is meticulously crafted using the highest quality materials. 
                      Designed with both style and functionality in mind, it's the perfect addition to your collection.
                   </p>
                   <ul className="space-y-4">
                      {['Premium build quality', 'Eco-friendly materials', 'Water resistant', '2-year warranty'].map((item, i) => (
                        <li key={i} className="flex items-center gap-3 text-white/80">
                           <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                           {item}
                        </li>
                      ))}
                   </ul>
                </div>
              )}

              {activeTab === 'specs' && (
                <div className="max-w-2xl">
                   <table className="w-full">
                      <tbody className="divide-y divide-white/5">
                         <SpecRow label="Category" value={product.category} />
                         <SpecRow label="Brand" value={store?.name} />
                         <SpecRow label="Model Year" value="2024" />
                         <SpecRow label="Origin" value="Imported" />
                         <SpecRow label="Material" value="Premium Composite" />
                         <SpecRow label="Warranty" value="2 Years International" />
                      </tbody>
                   </table>
                </div>
              )}

              {activeTab === 'reviews' && (
                <ReviewsSection entityType="product" entityId={productId} entityName={product.name} />
              )}
              
              {activeTab === 'faq' && (
                <div className="space-y-6 max-w-3xl">
                   <FaqItem question="When will I receive my order?" answer="Orders within Samarkand are delivered within 24 hours. For other regions, it takes 2-3 business days." />
                   <FaqItem question="Can I return the product if I don't like it?" answer="Yes, we offer a 14-day return policy for unused products in their original packaging." />
                   <FaqItem question="Is there a warranty included?" answer="Every product comes with a minimum 1-year manufacturer warranty, with extended options available." />
                </div>
              )}
           </div>
        </div>

        {/* Similar Products */}
        <section className="mb-20">
           <div className="flex items-center justify-between mb-8">
              <h2 className="mtc-heading-md">Similar Products</h2>
              <button className="flex items-center gap-2 text-blue-400 font-medium hover:gap-3 transition-all">
                 Browse All <ChevronRight size={18} />
              </button>
           </div>
           <div className="mtc-grid mtc-grid-4 gap-6">
              {productsData.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4).map((p, i) => (
                <MTCProductCard key={p.id} product={p} delay={i * 0.1} />
              ))}
           </div>
        </section>
      </div>
    </div>
  )
}

function TrustBadge({ icon, label }) {
  return (
    <div className="flex flex-col items-center text-center p-4 rounded-3xl bg-white/5 border border-white/10">
       <div className="text-blue-400 mb-2">{icon}</div>
       <span className="text-[10px] font-bold uppercase tracking-wider text-white/60">{label}</span>
    </div>
  )
}

function TabButton({ active, onClick, label }) {
  return (
    <button 
      onClick={onClick}
      className={`px-8 py-4 font-semibold text-sm transition-all border-b-2 ${
        active ? 'border-blue-500 text-blue-500' : 'border-transparent text-white/40 hover:text-white'
      }`}
    >
      {label}
    </button>
  )
}

function SpecRow({ label, value }) {
  return (
    <tr>
       <td className="py-4 text-white/40 font-medium">{label}</td>
       <td className="py-4 text-white font-bold text-right">{value}</td>
    </tr>
  )
}

function FaqItem({ question, answer }) {
  return (
    <div className="space-y-2 border-b border-white/5 pb-6">
       <h4 className="font-bold text-lg flex items-center gap-3">
          <HelpCircle size={18} className="text-blue-400" />
          {question}
       </h4>
       <p className="text-white/60 pl-8">{answer}</p>
    </div>
  )
}
