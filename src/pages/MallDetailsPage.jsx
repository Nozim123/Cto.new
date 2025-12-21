import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useTheme } from '../contexts/ThemeContext'
import { trackBehavior } from '../services/behavior'
import mallsData from '../data/malls.json'
import storesData from '../data/stores.json'
import StoreCard from '../components/StoreCard'
import StoriesCarousel from '../components/StoriesCarousel'
import InteractiveFloorPlan from '../components/InteractiveFloorPlan'
import InteractiveMap from '../components/InteractiveMap'
import RealTimeHours from '../components/RealTimeHours'
import Button3D from '../components/Button3D'
import ReviewsSection from '../components/ReviewsSection'
import SmartRecommendations from '../components/SmartRecommendations'

export default function MallDetailsPage() {
  const { mallId } = useParams()
  const [mall, setMall] = useState(null)
  const [stores, setStores] = useState([])
  const [allStores, setAllStores] = useState([])
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
    }
  }, [mallId])

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
    <div className="min-h-screen pb-20">
      {/* Cinematic Hero */}
      <div className="relative h-[60vh] w-full overflow-hidden">
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        <img
          src={mall.bannerImage}
          alt={mall.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 z-20 flex flex-col justify-center items-center text-center px-4">
            <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-6 animate-fade-in-up">
                {mall.name}
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-2xl mb-8 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
                {mall.location}
            </p>
            <div className="animate-fade-in-up" style={{animationDelay: '0.4s'}}>
                <a href="#stores" className="inline-block">
                    <Button3D variant="primary" size="lg">Explore Stores</Button3D>
                </a>
            </div>
        </div>
      </div>

      {/* Quick Info Bar */}
      <div className="bg-white/10 backdrop-blur-md border-b border-white/10 relative z-20 -mt-20 max-w-6xl mx-auto rounded-t-2xl overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-white/10 text-white">
            <div className="p-6 text-center bg-black/40 backdrop-blur-md">
                <span className="block text-gold text-xs font-bold uppercase tracking-wider mb-1">Hours</span>
                <RealTimeHours mall={mall} />
            </div>
            <div className="p-6 text-center bg-black/40 backdrop-blur-md">
                <span className="block text-gold text-xs font-bold uppercase tracking-wider mb-1">Address</span>
                <span className="text-lg font-medium">{mall.address}</span>
            </div>
            <div className="p-6 text-center bg-black/40 backdrop-blur-md">
                <span className="block text-gold text-xs font-bold uppercase tracking-wider mb-1">Contact</span>
                <span className="text-lg font-medium">{mall.phone}</span>
            </div>
            <div className="p-6 text-center bg-black/40 backdrop-blur-md">
                <span className="block text-gold text-xs font-bold uppercase tracking-wider mb-1">Stores</span>
                <span className="text-lg font-medium">{mall.storeCount} Retailers</span>
            </div>
        </div>
      </div>

      {/* Categories */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-16">
         <h2 className="text-3xl font-display font-bold text-center mb-10 dark:text-white">Shop by Category</h2>
         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat, idx) => (
                <div key={cat} className="group p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-gold/50 transition-all cursor-pointer text-center">
                    <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-gold/20 to-purple-500/20 rounded-full flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                        {/* Simple icon mapping based on text could go here, for now generic */}
                        🛍️
                    </div>
                    <span className="font-medium text-sm dark:text-gray-200 group-hover:text-gold transition-colors">{cat}</span>
                </div>
            ))}
         </div>
      </div>

      {/* Stories Section */}
      {allStores.length > 0 && (
        <div className="py-10 border-y border-white/5 bg-black/20 backdrop-blur-sm mb-16">
          <div className="max-w-7xl mx-auto">
            <h3 className="px-4 lg:px-8 mb-6 font-display text-xl font-bold dark:text-white flex items-center gap-2">
              <span className="text-gold">●</span> Live Stories
            </h3>
            <StoriesCarousel stores={allStores} />
          </div>
        </div>
      )}

      {/* Interactive Map & Location */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 mb-20">
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
                <h2 className="text-3xl font-display font-bold mb-6 dark:text-white">About {mall.name}</h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                    {mall.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-8">
                    {mall.features?.map(feature => (
                        <span key={feature} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-gray-400">
                            {feature}
                        </span>
                    ))}
                </div>
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <span className="text-gold">📍</span>
                        <div>
                            <div className="font-medium dark:text-white">Address</div>
                            <div className="text-gray-400">{mall.address}</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-gold">📞</span>
                        <div>
                            <div className="font-medium dark:text-white">Phone</div>
                            <div className="text-gray-400">{mall.phone}</div>
                        </div>
                    </div>
                    {mall.website && (
                        <div className="flex items-center gap-3">
                            <span className="text-gold">🌐</span>
                            <div>
                                <div className="font-medium dark:text-white">Website</div>
                                <div className="text-gray-400">{mall.website}</div>
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
                    className="shadow-2xl"
                />
            </div>
         </div>
      </section>

      {/* Interactive Floor Plan */}
      {allStores.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 lg:px-8 mb-20">
           <h2 className="text-3xl font-display font-bold mb-8 dark:text-white text-center">Interactive Map</h2>
          <InteractiveFloorPlan stores={allStores} mallId={mallId} />
        </section>
      )}

      {/* Store Directory Preview */}
      <section id="stores" className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
                <h2 className="text-3xl font-display font-bold dark:text-white">Stores</h2>
                <p className="text-gray-400 mt-2">Explore top brands and local boutiques</p>
            </div>
            <Link to={`/mall/${mallId}/stores`}>
                <Button3D variant="outline" size="sm">View All Stores</Button3D>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stores.map((store, index) => (
               <StoreCard key={store.id} store={store} mallId={mallId} />
            ))}
          </div>
          
          <div className="mt-12 text-center">
             <Link to={`/mall/${mallId}/stores`}>
                <Button3D variant="secondary" size="lg" className="w-full md:w-auto px-12">
                    Browse All {allStores.length} Stores
                </Button3D>
             </Link>
          </div>
      </section>

      {/* Reviews Section */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 mb-12">
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
