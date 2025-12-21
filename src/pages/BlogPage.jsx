import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useTheme } from '../contexts/ThemeContext'
import Button3D from '../components/Button3D'
import { motion } from 'framer-motion'


const blogPosts = [
  {
    id: 'mall-news-1',
    title: 'New Luxury Wing Opening at Mega Mall',
    excerpt: 'Discover the latest high-end brands and premium dining experiences coming to our flagship location.',
    content: `The wait is over! Mega Mall is proud to announce the opening of our new Luxury Wing, featuring over 50 premium brands including Louis Vuitton, Gucci, and Prada. The wing also houses a collection of fine dining restaurants with panoramic city views.

Key highlights:
• 50+ luxury brands
• 10 new restaurants
• Valet parking service
• Personal shopping assistants`,
    category: 'mall-news',
    author: 'Mega Travel Center',
    date: '2024-01-15',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&h=400&fit=crop',
    tags: ['luxury', 'new-opening', 'shopping']
  },
  {
    id: 'trends-1',
    title: '2024 Shopping Trends: What Samarkand Consumers Want',
    excerpt: 'Latest research reveals emerging consumer preferences and shopping behaviors in our region.',
    content: `Our latest consumer research shows exciting trends for 2024. Eco-conscious shopping is on the rise, with 68% of consumers preferring sustainable brands. Mobile shopping continues to grow, and experiential retail is becoming a key differentiator.

Top trends:
• Sustainable and eco-friendly products
• Mobile-first shopping experiences
• Experiential retail spaces
• Local brand preference`,
    category: 'trends',
    author: 'Market Research Team',
    date: '2024-01-10',
    image: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=800&h=400&fit=crop',
    tags: ['trends', 'research', 'consumer-behavior']
  },
  {
    id: 'tips-1',
    title: 'Smart Shopping: How to Find the Best Deals',
    excerpt: 'Expert tips and strategies for saving money while shopping at Samarkand premier malls.',
    content: `Want to shop smarter? Here are our top tips for finding the best deals:

1. **Timing is everything**: Shop during off-peak hours for better service and sometimes better prices.
2. **Loyalty programs**: Join mall loyalty programs for exclusive discounts.
3. **Price comparison**: Use our app to compare prices across stores.
4. **Seasonal sales**: Plan purchases around major sale events.
5. **Flash sale alerts**: Enable notifications for time-sensitive deals.`,
    category: 'tips',
    author: 'Shopping Experts',
    date: '2024-01-05',
    image: 'https://images.unsplash.com/photo-1556742393-d75f468bfcb0?w=800&h=400&fit=crop',
    tags: ['tips', 'savings', 'deals']
  },
  {
    id: 'mall-news-2',
    title: 'Family Park Mall Gets Major Renovation',
    excerpt: 'Exciting upgrades coming to Family Park Mall including new entertainment zones and expanded food court.',
    content: `Family Park Mall is undergoing a major renovation to enhance your shopping experience. The project includes:

• New family entertainment zone with arcade and playground
• Expanded food court with 15 new vendors
• Modernized parking system with digital displays
• Improved WiFi throughout the mall
• New restroom facilities with family rooms`,
    category: 'mall-news',
    author: 'Construction Team',
    date: '2024-01-03',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=400&fit=crop',
    tags: ['renovation', 'family', 'entertainment']
  },
  {
    id: 'trends-2',
    title: 'The Rise of Local Uzbek Brands',
    excerpt: 'Discover the homegrown fashion and lifestyle brands making waves in Samarkand retail scene.',
    content: `Uzbek brands are taking center stage in 2024. From traditional crafts to modern fashion, local entrepreneurs are creating unique products that celebrate our culture while appealing to contemporary tastes.

Featured brands:
• Samarqand Style - Modern fashion with traditional patterns
• Silk Road Collection - Luxury textiles and home goods
• Bukhara Crafts - Handcrafted jewelry and accessories
• Ceramics - Traditional pottery with modern designs`,
    category: 'trends',
    author: 'Local Business Review',
    date: '2023-12-28',
    image: 'https://images.unsplash.com/photo-1520006403909-838d6b92c22e?w=800&h=400&fit=crop',
    tags: ['local-brands', 'uzbek-crafts', 'fashion']
  },
  {
    id: 'tips-2',
    title: 'Navigating Samarkand Malls: Transportation Guide',
    excerpt: 'Complete guide to reaching all major shopping centers using public transport, taxis, and personal vehicles.',
    content: `Getting to Samarkand malls has never been easier with multiple transportation options:

**Public Transport:**
• Bus routes 5, 12, 18, and 24 serve all major malls
• Metro stations within walking distance of Mega Mall and Samarkand City Center
• Shuttle services from city center every 30 minutes

**Taxi Services:**
• Yandex Go and MyTaxi recommended
• Designated pickup/drop-off zones at all malls
• Average cost: 15,000-25,000 sum from city center

**Driving:**
• Free parking available at all locations
• Electric vehicle charging stations at Mega Mall and Family Park
• Real-time parking availability through our app`,
    category: 'tips',
    author: 'Transport Team',
    date: '2023-12-20',
    image: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=800&h=400&fit=crop',
    tags: ['transport', 'parking', 'directions']
  }
]

const categories = [
  { id: 'all', name: 'All Articles', icon: '📚' },
  { id: 'mall-news', name: 'Mall News', icon: '🏬' },
  { id: 'trends', name: 'Trends', icon: '📈' },
  { id: 'tips', name: 'Shopping Tips', icon: '💡' }
]

export default function BlogPage() {
  const { darkMode } = useTheme()
  const { t } = useLanguage()
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredPosts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    return blogPosts.filter(post => {
      if (selectedCategory !== 'all' && post.category !== selectedCategory) return false
      if (!q) return true
      return (
        post.title.toLowerCase().includes(q) ||
        post.excerpt.toLowerCase().includes(q) ||
        post.content.toLowerCase().includes(q)
      )
    })
  }, [selectedCategory, searchQuery])

  return (
    <div className={`min-h-screen pb-20 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className="relative h-64 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-purple-800"></div>
        <div className="absolute inset-0 bg-black/30"></div>
        
        <div className="relative z-10 max-w-6xl mx-auto px-4 lg:px-8 h-full flex items-center">
          <div className="text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">📰 Mega Travel Center Blog</h1>
            <p className="text-xl text-white/90">Latest news, trends, and shopping tips from Samarkand</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 lg:px-8 -mt-8">
        {/* Search and Categories */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <input
              type="text"
              aria-label="Search articles"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`flex-1 px-4 py-3 rounded-lg border focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                darkMode 
                  ? 'bg-gray-800 border-gray-700 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full font-medium transition-all ${
                  selectedCategory === category.id
                    ? 'bg-purple-600 text-white'
                    : darkMode 
                      ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredPosts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={`rounded-2xl overflow-hidden border ${darkMode ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-white'} transition-all hover:shadow-lg`}
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  loading="lazy"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    darkMode ? 'bg-purple-900/30 text-purple-300' : 'bg-purple-100 text-purple-700'
                  }`}>
                    {categories.find(c => c.id === post.category)?.name}
                  </span>
                  <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {new Date(post.date).toLocaleDateString()}
                  </span>
                </div>
                
                <h2 className={`text-xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'} line-clamp-2`}>
                  {post.title}
                </h2>
                
                <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'} line-clamp-3`}>
                  {post.excerpt}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
                      {post.author?.charAt(0) ?? '?'}
                    </div>
                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {post.author || 'Unknown'}
                    </span>
                  </div>
                  
                  <Link to={`/blog/${post.id}`}>
                    <Button3D variant="outline" size="sm">Read More</Button3D>
                  </Link>
                </div>
                
                <div className="flex flex-wrap gap-1 mt-4">
                  {post.tags.map(tag => (
                    <span key={tag} className={`text-xs px-2 py-1 rounded ${
                      darkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600'
                    }`}>
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              No articles found
            </h3>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Try adjusting your search or category filter
            </p>
          </div>
        )}

        {/* Newsletter Signup */}
        <div className={`rounded-2xl border ${darkMode ? 'border-white/10 bg-gradient-to-r from-purple-900/20 to-purple-800/20' : 'border-purple-200 bg-gradient-to-r from-purple-50 to-purple-100'} p-8 text-center mb-12`}>
          <h3 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            📧 Subscribe to Our Newsletter
          </h3>
          <p className={`mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Get the latest mall news, exclusive deals, and shopping tips delivered to your inbox
          </p>
          <div className="max-w-md mx-auto flex gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              className={`flex-1 px-4 py-3 rounded-lg border focus:ring-2 focus:ring-purple-500 ${
                darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300'
              }`}
            />
            <Button3D variant="primary">Subscribe</Button3D>
          </div>
        </div>
      </div>
    </div>
  )
}