import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { MapPin, Phone, Globe, ShoppingBag, Clock, Navigation, Info, Utensils, Zap, Calendar, Tag, ChevronRight, Star, Heart, Share2 } from 'lucide-react'
import mallsData from '../data/malls.json'
import storesData from '../data/stores.json'
import MTCStoreCard from '../components/MTCStoreCard'
import InteractiveFloorPlan from '../components/InteractiveFloorPlan'
import InteractiveMap from '../components/InteractiveMap'
import RealTimeHours from '../components/RealTimeHours'
import ReviewsSection from '../components/ReviewsSection'
import SmartRecommendations from '../components/SmartRecommendations'
import TicketsEventsHub from '../components/TicketsEventsHub'
import InstagramStories from '../components/InstagramStories'
import LiveMallStatus from '../components/LiveMallStatus'
import Interactive3DMallMap from '../components/Interactive3DMallMap'
import SustainabilitySection from '../components/SustainabilitySection'
import GiftCardsSection from '../components/GiftCardsSection'

export default function MallDetailsPage() {
  const { mallId } = useParams()
  const [mall, setMall] = useState(null)
  const [stores, setStores] = useState([])
  const [allStores, setAllStores] = useState([])
  const [stories, setStories] = useState([])
  const [activeTab, setActiveTab] = useState('shops')

  useEffect(() => {
    window.scrollTo(0, 0)
    const mallData = mallsData.find((m) => m.id === mallId)
    setMall(mallData)

    if (mallData) {
      const mallStores = storesData.filter((s) => s.mallId === mallId)
      setAllStores(mallStores)
      setStores(mallStores)
      
      // Mock stories if not available
      setStories(mallStores.slice(0, 6).map(store => ({
        id: store.id,
        mall_id: mallId,
        title: store.name,
        thumbnail: store.logo,
        media: store.image || 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=400&h=600&fit=crop',
        type: 'image',
        content: {
          title: 'Special Offer',
          description: 'Visit us for exclusive deals!',
          discount: '20% OFF',
          cta: 'Shop Now'
        },
        hasNew: true,
        viewed: false,
        timestamp: '2h ago'
      })))
    }
  }, [mallId])

  if (!mall) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-mtc-bg">
        <div className="text-center">
          <h1 className="mtc-heading-lg mb-4">Mall Not Found</h1>
          <Link to="/" className="mtc-button-primary inline-block">Back to Home</Link>
        </div>
      </div>
    )
  }

  const foodStores = allStores.filter(s => s.category?.toLowerCase().includes('food') || s.category?.toLowerCase().includes('restaurant'))
  const entertainmentStores = allStores.filter(s => s.category?.toLowerCase().includes('entertainment') || s.category?.toLowerCase().includes('cinema') || s.category?.toLowerCase().includes('kids'))
  const categories = [...new Set(allStores.map(s => s.category))]

  return (
    <div className="min-h-screen bg-mtc-bg text-white pb-24">
      {/* Hero Section */}
      <div className="relative h-[60vh] md:h-[80vh] w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-[rgba(37,40,54,1)] z-10" />
        <img
          src={mall.bannerImage || mall.image}
          alt={mall.name}
          className="w-full h-full object-cover animate-mtc-scale-in"
          style={{ animationDuration: '10s' }}
        />
        
        <div className="absolute inset-0 z-20 flex flex-col justify-center items-center text-center px-4">
          <div className="mtc-badge mtc-badge-primary mb-4 animate-mtc-slide-up">Premium Destination</div>
          <h1 className="mtc-heading-xl mb-4 animate-mtc-slide-up" style={{ animationDelay: '0.1s' }}>
            {mall.name}
          </h1>
          <p className="mtc-body-lg max-w-2xl mb-8 animate-mtc-slide-up" style={{ animationDelay: '0.2s' }}>
            {mall.description}
          </p>
          
          <div className="flex flex-wrap justify-center gap-3 animate-mtc-slide-up" style={{ animationDelay: '0.3s' }}>
            <NavButton icon={<ShoppingBag size={18} />} label="Shops" href="#shops" />
            <NavButton icon={<Utensils size={18} />} label="Restaurants" href="#food" />
            <NavButton icon={<Zap size={18} />} label="Attractions" href="#entertainment" />
            <NavButton icon={<Tag size={18} />} label="Deals" href="#deals" />
            <NavButton icon={<Navigation size={18} />} label="Parking" href="#parking" />
            <NavButton icon={<Phone size={18} />} label="Contact" href="#contact" />
          </div>
        </div>
      </div>

      {/* Quick Info Bar */}
      <div className="mtc-container relative z-20 -mt-16">
        <div className="mtc-glass rounded-3xl overflow-hidden grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10">
          <InfoItem icon={<Clock className="text-blue-400" />} label="Opening Hours" value={<RealTimeHours mall={mall} />} />
          <InfoItem icon={<MapPin className="text-purple-400" />} label="Location" value={mall.address} />
          <InfoItem icon={<Phone className="text-emerald-400" />} label="Contact" value={mall.phone} />
          <InfoItem icon={<ShoppingBag className="text-yellow-400" />} label="Total Shops" value={`${mall.storeCount || allStores.length} Retailers`} />
        </div>
      </div>

      {/* Stories Section */}
      <section className="mtc-container mtc-section">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <h3 className="mtc-heading-sm">Live Updates & Offers</h3>
        </div>
        <InstagramStories stories={stories} />
      </section>

      {/* Main Content Tabs */}
      <section className="mtc-container mtc-section" id="shops">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
          <div>
            <h2 className="mtc-heading-lg mb-2">Explore {mall.name}</h2>
            <div className="flex flex-wrap gap-2 mt-4">
              {['shops', 'food', 'entertainment', 'deals'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-2 rounded-full font-medium transition-all ${
                    activeTab === tab 
                      ? 'bg-blue-500 text-white shadow-mtc-glow' 
                      : 'bg-white/5 text-white/60 hover:bg-white/10'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex gap-4">
             <button className="mtc-button-secondary flex items-center gap-2">
                <Calendar size={18} />
                Events Calendar
             </button>
          </div>
        </div>

        {/* Dynamic Content Grid */}
        <div className="mtc-grid mtc-grid-3 md:mtc-grid-4 gap-6">
          {(activeTab === 'shops' ? allStores : 
            activeTab === 'food' ? foodStores : 
            activeTab === 'entertainment' ? entertainmentStores : 
            allStores.filter(s => s.hasPromo)).map((store, index) => (
            <MTCStoreCard key={store.id} store={store} delay={index * 0.05} />
          ))}
        </div>
        
        {activeTab === 'food' && foodStores.length === 0 && (
          <div className="text-center py-20 mtc-glass rounded-3xl">
             <Utensils size={48} className="mx-auto mb-4 text-white/20" />
             <p className="mtc-body text-white/50">No dining options found for this mall yet.</p>
          </div>
        )}
      </section>

      {/* Entertainment & Attractions Section */}
      <section className="mtc-container mtc-section" id="entertainment">
        <div className="mtc-glass rounded-[3rem] p-8 md:p-12 overflow-hidden relative">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="mtc-badge mtc-badge-success mb-6">Fun for Everyone</div>
              <h2 className="mtc-heading-lg mb-6">Entertainment & Attractions</h2>
              <p className="mtc-body-lg mb-8">
                Discover a world of excitement! From state-of-the-art cinemas and VR zones to kids' playgrounds and interactive experiences.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <AttractionFeature icon="🎬" title="Cinema Multiplex" />
                <AttractionFeature icon="🎮" title="VR Game Zone" />
                <AttractionFeature icon="🎠" title="Kids Park" />
                <AttractionFeature icon="🎳" title="Bowling Alley" />
              </div>
            </div>
            <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1513106580091-1d82408b8cd6?w=800&h=600&fit=crop" 
                alt="Entertainment" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                <button className="mtc-button-primary">Book Tickets Now</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Map & Floor Plan */}
      <section className="mtc-container mtc-section" id="parking">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-8">
              <h2 className="mtc-heading-md">Interactive Floor Plan</h2>
              <div className="flex gap-2">
                <button className="px-3 py-1 rounded-lg bg-white/10 text-xs">Floor 1</button>
                <button className="px-3 py-1 rounded-lg bg-white/5 text-xs text-white/50">Floor 2</button>
              </div>
            </div>
            <div className="mtc-card h-[500px] relative overflow-hidden">
               <InteractiveFloorPlan stores={allStores} mallId={mallId} />
            </div>
          </div>
          
          <div className="space-y-6">
            <h2 className="mtc-heading-md">Parking & Navigation</h2>
            <div className="mtc-glass p-6 rounded-3xl space-y-4">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-blue-500/20 text-blue-400">
                  <Navigation size={24} />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Smart Parking</h4>
                  <p className="mtc-body-sm">2,500+ spaces with real-time availability tracking.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-purple-500/20 text-purple-400">
                  <Zap size={24} />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">EV Charging</h4>
                  <p className="mtc-body-sm">12 high-speed charging stations on Level B1.</p>
                </div>
              </div>
            </div>
            
            <div className="mtc-card aspect-square rounded-3xl overflow-hidden">
              <InteractiveMap selectedMallId={mallId} showDirections={true} />
            </div>
          </div>
        </div>
      </section>

      {/* Events Hub */}
      <section className="mtc-container mtc-section">
        <TicketsEventsHub mallId={mallId} mallName={mall.name} />
      </section>

      {/* Live Mall Status */}
      <section className="mtc-container mtc-section">
        <LiveMallStatus mallId={mallId} />
      </section>

      {/* Interactive 3D Map */}
      <section className="mtc-container mtc-section">
        <Interactive3DMallMap mallId={mallId} mallName={mall.name} />
      </section>

      {/* Sustainability Section */}
      <section className="mtc-container mtc-section">
        <SustainabilitySection />
      </section>

      {/* Gift Cards Section */}
      <section className="mtc-container mtc-section">
        <GiftCardsSection />
      </section>

      {/* Reviews & Social */}
      <section className="mtc-container mtc-section" id="contact">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
             <ReviewsSection entityType="mall" entityId={mallId} entityName={mall.name} />
          </div>
          <div className="space-y-6">
            <div className="mtc-glass p-8 rounded-3xl">
              <h3 className="mtc-heading-sm mb-6">Connect with Us</h3>
              <div className="space-y-4">
                <SocialLink icon={<Globe size={20} />} label="Official Website" value={mall.website || 'www.mtc-mall.uz'} />
                <SocialLink icon={<Phone size={20} />} label="Customer Service" value={mall.phone} />
                <SocialLink icon={<Share2 size={20} />} label="Social Media" value="@mtc_mall_uz" />
              </div>
              <button className="mtc-button-primary w-full mt-8">Send Message</button>
            </div>
          </div>
        </div>
      </section>

      {/* Recommendations */}
      <section className="mtc-container mtc-section">
        <h2 className="mtc-heading-md mb-8">You Might Also Like</h2>
        <SmartRecommendations type="mall" id={mallId} limit={4} />
      </section>
    </div>
  )
}

function NavButton({ icon, label, href }) {
  return (
    <a 
      href={href}
      className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 hover:bg-white/20 transition-all hover:scale-105"
    >
      <span className="text-blue-400">{icon}</span>
      <span className="text-sm font-medium">{label}</span>
    </a>
  )
}

function InfoItem({ icon, label, value }) {
  return (
    <div className="p-6 text-center">
      <div className="flex justify-center mb-2">{icon}</div>
      <div className="mtc-caption mb-1">{label}</div>
      <div className="font-semibold text-white/90">{value}</div>
    </div>
  )
}

function AttractionFeature({ icon, title }) {
  return (
    <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10">
      <span className="text-2xl">{icon}</span>
      <span className="font-medium">{title}</span>
    </div>
  )
}

function SocialLink({ icon, label, value }) {
  return (
    <div className="flex items-center gap-4">
      <div className="text-blue-400">{icon}</div>
      <div>
        <div className="mtc-caption">{label}</div>
        <div className="font-medium">{value}</div>
      </div>
    </div>
  )
}
