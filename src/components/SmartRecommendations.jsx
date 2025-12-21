import { useState, useEffect, useMemo } from 'react'
import { useTheme } from '../contexts/ThemeContext'
import { useUser } from '../contexts/UserContext'
import { useEcosystem } from '../contexts/EcosystemContext'
import ModernProductCard from './ModernProductCard'
import StoreCard from './StoreCard'
import MallCard from './MallCard'

export default function SmartRecommendations({ type, id, category, limit = 8 }) {
  const { darkMode } = useTheme()
  const { favorites } = useUser()
  const { products, stores, malls, userBehavior, getProductsByStore } = useEcosystem()
  const [recommendations, setRecommendations] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    generateRecommendations()
  }, [type, id, category, favorites, userBehavior])

  const generateRecommendations = () => {
    setIsLoading(true)
    let recs = []
    
    switch (type) {
      case 'product':
        recs = getProductRecommendations(id, category)
        break
      case 'store':
        recs = getStoreRecommendations(id, category)
        break
      case 'mall':
        recs = getMallRecommendations(id)
        break
      default:
        recs = getGeneralRecommendations()
    }
    
    setRecommendations(recs.slice(0, limit))
    setIsLoading(false)
  }

  // Collaborative filtering based recommendations
  const getProductRecommendations = (productId, category) => {
    const recs = []
    
    // 1. Similar products (same category)
    const similarProducts = products.filter(p => 
      p.category === category && p.id !== productId
    )
    recs.push(...similarProducts.map(p => ({ ...p, reason: 'Similar products' })))
    
    // 2. Products from the same store
    const product = products.find(p => p.id === productId)
    if (product) {
      const sameStoreProducts = products.filter(p => 
        p.storeId === product.storeId && p.id !== productId
      )
      recs.push(...sameStoreProducts.map(p => ({ ...p, reason: 'From the same store' })))
    }
    
    // 3. Popular items (high rating or "Best Seller" tag)
    const popularProducts = products.filter(p => 
      p.rating >= 4.5 || p.tag === 'Best Seller'
    )
    recs.push(...popularProducts.map(p => ({ ...p, reason: 'Popular choice' })))
    
    // 4. Based on user's favorite stores
    if (favorites.stores.length > 0) {
      const favoriteStoreProducts = products.filter(p => 
        favorites.stores.includes(p.storeId) && p.id !== productId
      )
      recs.push(...favoriteStoreProducts.map(p => ({ ...p, reason: 'From your favorite stores' })))
    }
    
    // Remove duplicates and shuffle
    return removeDuplicates(recs, 'id').sort(() => Math.random() - 0.5)
  }

  const getStoreRecommendations = (storeId, category) => {
    const recs = []
    
    // 1. Similar stores (same category)
    const similarStores = stores.filter(s => 
      s.category === category && s.id !== storeId
    )
    recs.push(...similarStores.map(s => ({ ...s, reason: 'Similar stores' })))
    
    // 2. Stores in the same mall
    const store = stores.find(s => s.id === storeId)
    if (store) {
      const sameMallStores = stores.filter(s => 
        s.mallId === store.mallId && s.id !== storeId
      )
      recs.push(...sameMallStores.map(s => ({ ...s, reason: 'In the same mall' })))
    }
    
    // 3. Popular stores (high rating)
    const popularStores = stores.filter(s => s.rating >= 4.5)
    recs.push(...popularStores.map(s => ({ ...s, reason: 'Popular choice' })))
    
    return removeDuplicates(recs, 'id').sort(() => Math.random() - 0.5)
  }

  const getMallRecommendations = (mallId) => {
    const recs = []
    
    // 1. Similar malls (based on features/characteristics)
    const currentMall = malls.find(m => m.id === mallId)
    if (currentMall) {
      const similarMalls = malls.filter(m => {
        if (m.id === mallId) return false
        // Simple similarity: same category of features or size
        return m.storeCount >= currentMall.storeCount * 0.7 && m.storeCount <= currentMall.storeCount * 1.3
      })
      recs.push(...similarMalls.map(m => ({ ...m, reason: 'Similar size malls' })))
    }
    
    // 2. Popular malls (high store count, good rating)
    const popularMalls = malls.filter(m => m.rating >= 4.5 && m.storeCount >= 50)
    recs.push(...popularMalls.map(m => ({ ...m, reason: 'Popular choice' })))
    
    return removeDuplicates(recs, 'id').sort(() => Math.random() - 0.5)
  }

  const getGeneralRecommendations = () => {
    const recs = []
    
    // Popular items across all categories
    const popularProducts = products.filter(p => p.rating >= 4.5 || p.tag === 'Best Seller')
    recs.push(...popularProducts.map(p => ({ ...p, reason: 'Popular now' })))
    
    const popularStores = stores.filter(s => s.rating >= 4.5)
    recs.push(...popularStores.map(s => ({ ...s, reason: 'Top rated' })))
    
    // If user has favorites, prioritize those categories
    if (favorites.stores.length > 0) {
      const favoriteCategories = stores
        .filter(s => favorites.stores.includes(s.id))
        .map(s => s.category)
        .filter((cat, idx, arr) => arr.indexOf(cat) === idx)
      
      favoriteCategories.forEach(cat => {
        const categoryProducts = products.filter(p => p.category === cat)
        recs.push(...categoryProducts.map(p => ({ ...p, reason: `Based on your ${cat} preference` })))
      })
    }
    
    return removeDuplicates(recs, 'id').slice(0, limit)
  }

  const removeDuplicates = (items, idKey) => {
    const unique = []
    const seen = new Set()
    
    items.forEach(item => {
      if (!seen.has(item[idKey])) {
        seen.add(item[idKey])
        unique.push(item)
      }
    })
    
    return unique
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  if (recommendations.length === 0) {
    return null
  }

  const title = type === 'product' ? '👍 You might also like' : 
                type === 'store' ? '🏬 Similar stores' : 
                '🎯 Recommended for you'

  return (
    <div className="mb-12">
      <h2 className={`text-2xl md:text-3xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        {title}
      </h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {recommendations.slice(0, limit).map((item) => {
          // Product card
          if (item.price) {
            return <ModernProductCard key={item.id} product={item} />
          }
          // Store card  
          if (item.storeCount === undefined) {
            return <StoreCard key={item.id} store={item} mallId={item.mallId} />
          }
          // Mall card
          return <MallCard key={item.id} mall={item} />
        })}
      </div>
    </div>
  )
}