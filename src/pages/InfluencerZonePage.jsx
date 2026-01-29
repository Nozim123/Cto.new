import { useState, useEffect } from 'react'
import { Play, Star, TrendingUp, Heart, Share2, Eye, Calendar, ChevronRight } from 'lucide-react'
import MTCProductCard from '../components/MTCProductCard'

export default function InfluencerZonePage() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [selectedVideo, setSelectedVideo] = useState(null)

  const influencers = [
    {
      id: 1,
      name: "Sofia Style",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
      followers: "125K",
      verified: true,
      specialty: "Fashion & Lifestyle"
    },
    {
      id: 2,
      name: "Ahmad Tech",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
      followers: "89K",
      verified: true,
      specialty: "Gadgets & Reviews"
    },
    {
      id: 3,
      name: "Nilu Beauty",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
      followers: "67K",
      verified: false,
      specialty: "Beauty & Cosmetics"
    }
  ]

  const videos = [
    {
      id: 1,
      title: "Best Sneakers Collection 2024",
      thumbnail: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=400&fit=crop",
      influencer: "Ahmad Tech",
      views: "45K",
      likes: "2.3K",
      duration: "12:34",
      category: "fashion",
      date: "2 days ago"
    },
    {
      id: 2,
      title: "Spring Fashion Trends at Family Park",
      thumbnail: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&h=400&fit=crop",
      influencer: "Sofia Style",
      views: "78K",
      likes: "4.5K",
      duration: "15:20",
      category: "fashion",
      date: "3 days ago"
    },
    {
      id: 3,
      title: "Top 10 Beauty Products",
      thumbnail: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=400&fit=crop",
      influencer: "Nilu Beauty",
      views: "32K",
      likes: "1.8K",
      duration: "8:45",
      category: "beauty",
      date: "1 week ago"
    },
    {
      id: 4,
      title: "Tech Gadgets Under $100",
      thumbnail: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=600&h=400&fit=crop",
      influencer: "Ahmad Tech",
      views: "56K",
      likes: "3.2K",
      duration: "18:12",
      category: "tech",
      date: "4 days ago"
    }
  ]

  const trendingProducts = [
    {
      id: "trend-1",
      storeId: "terra-pro",
      name: "Pro Running Shoes",
      price: 89.99,
      originalPrice: 119.99,
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
      category: "Footwear",
      tag: "Trending",
      rating: 4.8,
      reviews: 234
    },
    {
      id: "trend-2",
      storeId: "elegance-boutique",
      name: "Designer Handbag",
      price: 159.99,
      originalPrice: 199.99,
      image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop",
      category: "Accessories",
      tag: "Hot",
      rating: 4.9,
      reviews: 156
    },
    {
      id: "trend-3",
      storeId: "tech-world",
      name: "Wireless Earbuds Pro",
      price: 79.99,
      originalPrice: 99.99,
      image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&h=400&fit=crop",
      category: "Electronics",
      tag: "Best Seller",
      rating: 4.7,
      reviews: 312
    },
    {
      id: "trend-4",
      storeId: "nilu-beauty",
      name: "Luxury Skincare Set",
      price: 129.99,
      originalPrice: 169.99,
      image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop",
      category: "Beauty",
      tag: "New",
      rating: 4.9,
      reviews: 89
    }
  ]

  const topPicks = [
    {
      id: "pick-1",
      name: "Summer Collection 2024",
      influencer: "Sofia Style",
      products: [trendingProducts[0], trendingProducts[1]],
      image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&h=400&fit=crop"
    },
    {
      id: "pick-2",
      name: "Must-Have Tech Accessories",
      influencer: "Ahmad Tech",
      products: [trendingProducts[2]],
      image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&h=400&fit=crop"
    }
  ]

  const categories = ['all', 'fashion', 'tech', 'beauty', 'lifestyle']

  return (
    <div className="min-h-screen bg-mtc-bg text-white pb-24">
      {/* Hero Section */}
      <div className="relative h-[50vh] md:h-[60vh] w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/90 via-blue-900/80 to-purple-900/90" />
        <img
          src="https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?w=1920&h=1080&fit=crop"
          alt="Influencer Zone"
          className="w-full h-full object-cover mix-blend-overlay"
        />
        
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4">
          <div className="mtc-badge mtc-badge-primary mb-6 animate-mtc-slide-up">✨ Influencer Zone</div>
          <h1 className="mtc-heading-xl mb-4 animate-mtc-slide-up" style={{ animationDelay: '0.1s' }}>
            Discover What's Trending
          </h1>
          <p className="mtc-body-lg max-w-2xl mb-8 animate-mtc-slide-up" style={{ animationDelay: '0.2s' }}>
            Get inspired by top bloggers, watch video reviews, and find the hottest products recommended by your favorite influencers.
          </p>
        </div>
      </div>

      <div className="mtc-container mtc-section">
        {/* Featured Influencers */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="mtc-heading-md">Featured Influencers</h2>
            <button className="text-blue-400 text-sm font-medium hover:underline">View All</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {influencers.map(influencer => (
              <InfluencerCard key={influencer.id} influencer={influencer} />
            ))}
          </div>
        </section>

        {/* Video Reviews */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="mtc-heading-md">Video Reviews</h2>
            <div className="flex gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    activeCategory === cat 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-white/5 text-white/60 hover:bg-white/10'
                  }`}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {videos
              .filter(v => activeCategory === 'all' || v.category === activeCategory)
              .map(video => (
              <VideoCard 
                key={video.id} 
                video={video} 
                onClick={() => setSelectedVideo(video)}
              />
            ))}
          </div>
        </section>

        {/* Top Picks This Week */}
        <section className="mb-16">
          <div className="flex items-center gap-2 mb-8">
            <TrendingUp className="text-emerald-400" size={24} />
            <h2 className="mtc-heading-md">Top Picks This Week</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {topPicks.map(pick => (
              <TopPickCard key={pick.id} pick={pick} />
            ))}
          </div>
        </section>

        {/* Trending Products */}
        <section>
          <div className="flex items-center gap-2 mb-8">
            <Star className="text-yellow-400" size={24} />
            <h2 className="mtc-heading-md">Trending Products</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {trendingProducts.map(product => (
              <MTCProductCard key={product.id} product={product} delay={0} />
            ))}
          </div>
        </section>
      </div>

      {/* Video Modal */}
      {selectedVideo && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedVideo(null)}
        >
          <div className="max-w-4xl w-full" onClick={e => e.stopPropagation()}>
            <div className="relative aspect-video bg-black rounded-2xl overflow-hidden">
              <img src={selectedVideo.thumbnail} alt={selectedVideo.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 flex items-center justify-center">
                <button className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-all">
                  <Play size={32} className="text-white fill-white ml-1" />
                </button>
              </div>
            </div>
            <div className="mt-6">
              <h3 className="text-2xl font-bold mb-2">{selectedVideo.title}</h3>
              <div className="flex items-center gap-4 text-white/60">
                <span>By {selectedVideo.influencer}</span>
                <span>•</span>
                <span>{selectedVideo.views} views</span>
                <span>•</span>
                <span>{selectedVideo.date}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function InfluencerCard({ influencer }) {
  return (
    <div className="mtc-glass p-6 rounded-3xl text-center hover:bg-white/10 transition-all cursor-pointer group">
      <div className="relative w-24 h-24 mx-auto mb-4">
        <img 
          src={influencer.avatar} 
          alt={influencer.name}
          className="w-full h-full rounded-full object-cover border-4 border-white/10 group-hover:border-blue-500/50 transition-all"
        />
        {influencer.verified && (
          <div className="absolute bottom-0 right-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center border-4 border-[#252836]">
            <span className="text-sm">✓</span>
          </div>
        )}
      </div>
      <h3 className="font-semibold text-lg mb-1">{influencer.name}</h3>
      <p className="text-white/60 text-sm mb-3">{influencer.specialty}</p>
      <div className="flex items-center justify-center gap-2 text-sm">
        <span className="text-blue-400 font-semibold">{influencer.followers}</span>
        <span className="text-white/40">followers</span>
      </div>
    </div>
  )
}

function VideoCard({ video, onClick }) {
  return (
    <div 
      onClick={onClick}
      className="mtc-glass rounded-2xl overflow-hidden cursor-pointer group hover:bg-white/10 transition-all"
    >
      <div className="relative aspect-video overflow-hidden">
        <img 
          src={video.thumbnail} 
          alt={video.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-all" />
        <div className="absolute bottom-2 right-2 bg-black/70 px-2 py-1 rounded text-xs">
          {video.duration}
        </div>
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
          <button className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Play size={24} className="text-white fill-white ml-1" />
          </button>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold mb-2 line-clamp-2">{video.title}</h3>
        <div className="flex items-center justify-between text-sm text-white/60">
          <span>{video.influencer}</span>
          <span className="flex items-center gap-1">
            <Eye size={14} />
            {video.views}
          </span>
        </div>
        <div className="flex items-center gap-4 mt-3 text-sm text-white/40">
          <span className="flex items-center gap-1">
            <Heart size={14} />
            {video.likes}
          </span>
          <span className="flex items-center gap-1">
            <Calendar size={14} />
            {video.date}
          </span>
        </div>
      </div>
    </div>
  )
}

function TopPickCard({ pick }) {
  return (
    <div className="mtc-glass rounded-3xl overflow-hidden">
      <div className="relative aspect-[21/9] overflow-hidden">
        <img 
          src={pick.image} 
          alt={pick.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="mtc-badge mtc-badge-primary mb-2 w-fit">Curated by {pick.influencer}</div>
          <h3 className="text-xl font-bold mb-2">{pick.name}</h3>
        </div>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-2 gap-4">
          {pick.products.map(product => (
            <div key={product.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
              <img src={product.image} alt={product.name} className="w-16 h-16 rounded-lg object-cover" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm line-clamp-1">{product.name}</p>
                <p className="text-blue-400 font-bold">${product.price}</p>
              </div>
            </div>
          ))}
        </div>
        <button className="mt-4 w-full mtc-button-primary flex items-center justify-center gap-2">
          View Collection <ChevronRight size={18} />
        </button>
      </div>
    </div>
  )
}
