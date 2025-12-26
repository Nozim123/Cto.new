import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useTheme } from '../contexts/ThemeContext'
import { trackBehavior } from '../services/behavior'
import mallsData from '../data/malls.json'
import storesData from '../data/stores.json'
import StoreCard from '../components/StoreCard'
import InstagramStories from '../components/InstagramStories'
import InteractiveFloorPlan from '../components/InteractiveFloorPlan'
import InteractiveMap from '../components/InteractiveMap'
import RealTimeHours from '../components/RealTimeHours'
import Button3D from '../components/Button3D'
import ReviewsSection from '../components/ReviewsSection'
import SmartRecommendations from '../components/SmartRecommendations'
import TicketsEventsHub from '../components/TicketsEventsHub'
import { MapPin, Phone, Globe, ShoppingBag, Clock, Navigation, Info } from 'lucide-react'

export default function MallDetailsPage() {
  const { mallId } = useParams()
  const [mall, setMall] = useState(null)
  const [stores, setStores] = useState([])
  const [allStores, setAllStores] = useState([])
  const [stories, setStories] = useState([])
  const { darkMode } = useTheme()

  useEffect(() => {
    window.scrollTo(0, 0)
    const mallData = mallsData.find((m) => m.id === mallId)
    setMall(mallData)

    if (mallData) {
      trackBehavior({ type: 'mall', id: mallId })
    }

    if (mallData) { // Always load stores if mall exists
      const mallStores = storesData.filter((s) => s.mallId === mallId)
      setAllStores(mallStores)
      setStores(mallStores.slice(0, 12)) // Show more stores by default for better navigation

      // Fetch stories from API
      fetchStories(mallId)
    }
  }, [mallId])

  const fetchStories = async (mallId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/stories?mall_id=${mallId}`)
      if (response.ok) {
        const data = await response.json()
        setStories(data)
      }
    } catch (error) {
      console.error('Failed to fetch stories:', error)
      // Create fallback stories from stores
      const fallbackStories = allStores.slice(0, 6).map(store => ({
        id: store.id,
        mall_id: mallId,
        title: store.name,
        thumbnail: store.logo,
        media: store.image,
        type: 'image',
        content: {
          title: store.promoTitle || 'Special Offer',
          description: store.promoDescription || 'Visit us for exclusive deals!',
          discount: store.promoDiscount || '20% OFF',
          cta: 'Shop Now'
        },
        isPromoted: store.hasPromo || false,
        hasNew: true,
        viewed: false,
        timestamp: '2h ago',
        isActive: true
      }))
      setStories(fallbackStories)
    }
  }

  if (!mall) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="heading-large mb-4">Mall Not Found</h1>
          <Link to="/" className="button-primary inline-block">Back to Home</Link>
        </div>
      </div>
    )
  }

  const categories = [...new Set(allStores.map(s => s.category))]

  if (mall.status === 'coming_soon') {
      // ... (keep existing coming soon logic or update it)
      return (
        <div className="section-padding max-w-6xl mx-auto text-center py-20">
             <h1 className="text-4xl font-bold mb-4">{mall.name}</h1>
             <p className="text-xl text-gold mb-8">Coming Soon</p>
             <Link to="/" className="button-primary">Back to Home</Link>
        </div>
      )
  }

  return (
    <div className="min-h-screen pb-24">
      {/* Cinematic Hero */}
      <div className="relative h-[60vh] md:h-[70vh] w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60 z-10"></div>
        <img
          src={mall.bannerImage}
          alt={mall.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 z-20 flex flex-col justify-center items-center text-center px-4">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold text-white mb-6 animate-fade-in-up">
                {mall.name}
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl text-white/90 max-w-2xl mb-8 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
                {mall.location}
            </p>
            <div className="animate-fade-in-up" style={{animationDelay: '0.4s'}}>
                <a href="#stores" className="inline-block">
                    <Button3D variant="primary" size="lg">Explore Stores</Button3D>
                </a>
            </div>
        </div>
      </div>

      {/* Quick Info Bar - Modernized */}
      <div className="bg-white/10 backdrop-blur-xl border-b border-white/10 relative z-20 -mt-20 max-w-7xl mx-auto rounded-t-3xl overflow-hidden shadow-2xl">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 divide-x divide-white/10">
            <div className="p-5 md:p-6 bg-black/40 backdrop-blur-md text-white">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Clock size={18} className="text-purple-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-purple-300">Hours</span>
                </div>
                <RealTimeHours mall={mall} />
            </div>
            <div className="p-5 md:p-6 bg-black/40 backdrop-blur-md text-white">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <MapPin size={18} className="text-purple-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-purple-300">Address</span>
                </div>
                <span className="text-sm md:text-lg font-medium">{mall.address}</span>
            </div>
            <div className="p-5 md:p-6 bg-black/40 backdrop-blur-md text-white border-t lg:border-t-0">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Phone size={18} className="text-purple-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-purple-300">Contact</span>
                </div>
                <span className="text-sm md:text-lg font-medium">{mall.phone}</span>
            </div>
            <div className="p-5 md:p-6 bg-black/40 backdrop-blur-md text-white border-t lg:border-t-0">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <ShoppingBag size={18} className="text-purple-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-purple-300">Stores</span>
                </div>
                <span className="text-sm md:text-lg font-medium">{mall.storeCount} Retailers</span>
            </div>
        </div>
      </div>

      {/* Categories */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12 md:py-16">
         <h2 className="text-2xl md:text-3xl font-display font-bold text-center mb-8 md:mb-10 dark:text-white">Shop by Category</h2>
         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
            {categories.map((cat, idx) => (
                <div key={cat} className="group p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 hover:border-purple-500/50 transition-all cursor-pointer text-center">
                    <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                        {/* Simple icon mapping based on text could go here, for now generic */}
                        🛍️
                    </div>
                    <span className="font-medium text-sm dark:text-gray-200 group-hover:text-purple-400 transition-colors">{cat}</span>
                </div>
            ))}
         </div>
      </div>

      {/* Instagram Stories Section */}
      {stories.length > 0 && (
        <div className="py-10 border-y border-white/5 bg-gradient-to-r from-purple-900/20 via-pink-900/20 to-yellow-900/20 backdrop-blur-sm mb-16">
          <div className="max-w-7xl mx-auto">
            <h3 className="px-4 lg:px-8 mb-6 font-display text-xl font-bold dark:text-white flex items-center gap-2">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-yellow-500">●</span>
              Live Stories
            </h3>
            <InstagramStories stories={stories} />
          </div>
        </div>
      )}

      {/* Tickets & Events Hub */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 mb-16 md:mb-20">
        <TicketsEventsHub mallId={mallId} mallName={mall.name} />
      </section>

      {/* Interactive Map & Location */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 mb-16 md:mb-20">
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
            <div>
                <h2 className="text-2xl md:text-3xl font-display font-bold mb-6 dark:text-white">About {mall.name}</h2>
                <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                    {mall.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-8">
                    {mall.features?.map(feature => (
                        <span key={feature} className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm text-gray-400 dark:text-gray-300">
                            {feature}
                        </span>
                    ))}
                </div>
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                          <MapPin size={20} className="text-purple-400" />
                        </div>
                        <div>
                            <div className="font-medium dark:text-white">Address</div>
                            <div className="text-gray-400 text-sm">{mall.address}</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                          <Phone size={20} className="text-purple-400" />
                        </div>
                        <div>
                            <div className="font-medium dark:text-white">Phone</div>
                            <div className="text-gray-400 text-sm">{mall.phone}</div>
                        </div>
                    </div>
                    {mall.website && (
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                              <Globe size={20} className="text-purple-400" />
                            </div>
                            <div>
                                <div className="font-medium dark:text-white">Website</div>
                                <div className="text-gray-400 text-sm">{mall.website}</div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <div>
                <h3 className="text-xl font-bold mb-4 dark:text-white">Interactive Map</h3>
                <InteractiveMap
                    selectedMallId={mallId}
                    showDirections={true}
                    className="shadow-2xl rounded-2xl overflow-hidden"
                />
            </div>
         </div>
      </section>

      {/* Interactive Floor Plan */}
      {allStores.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 lg:px-8 mb-16 md:mb-20">
           <h2 className="text-2xl md:text-3xl font-display font-bold mb-8 dark:text-white text-center">Interactive Floor Plan</h2>
          <InteractiveFloorPlan stores={allStores} mallId={mallId} />
        </section>
      )}

      {/* Store Directory Preview */}
      <section id="stores" className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 md:mb-10 gap-4">
            <div>
                <h2 className="text-2xl md:text-3xl font-display font-bold dark:text-white">Stores</h2>
                <p className="text-gray-400 mt-2">Explore top brands and local boutiques</p>
            </div>
            <Link to={`/mall/${mallId}/stores`}>
                <Button3D variant="outline" size="sm">View All Stores</Button3D>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {stores.map((store, index) => (
               <StoreCard key={store.id} store={store} mallId={mallId} />
            ))}
          </div>

          <div className="mt-10 md:mt-12 text-center">
             <Link to={`/mall/${mallId}/stores`}>
                <Button3D variant="secondary" size="lg" className="w-full md:w-auto px-12">
                    Browse All {allStores.length} Stores
                </Button3D>
             </Link>
          </div>
      </section>

      {/* Reviews Section */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 mt-16 md:mt-20 mb-12">
        <ReviewsSection
          entityType="mall"
          entityId={mallId}
          entityName={mall.name}
        />
      </section>

      {/* Smart Recommendations */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 mb-12">
        <SmartRecommendations
          type="mall"
          id={mallId}
          limit={4}
        />
      </section>
    </div>
  )
}
