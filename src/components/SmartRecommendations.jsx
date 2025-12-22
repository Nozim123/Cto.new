import { useState, useEffect, useMemo } from 'react'
import { useTheme } from '../contexts/ThemeContext'
import { useUser } from '../contexts/UserContext'
import { useEcosystem } from '../contexts/EcosystemContext'
import ModernProductCard from './ModernProductCard'
import StoreCard from './StoreCard'
import MallCard from './MallCard'

export default function SmartRecommendations({ type, id, category, limit = 8 }) {
  const { darkMode } = useTheme()
  const { favorites } = useUser() || {}
  const { products, stores, malls, userBehavior } = useEcosystem() || {}
  const [recommendations, setRecommendations] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // Safe versions of arrays
  const productsArr = Array.isArray(products) ? products : []
  const storesArr = Array.isArray(stores) ? stores : []
  const mallsArr = Array.isArray(malls) ? malls : []
  const favoritesSafe = favorites || { stores: [], products: [], malls: [] }

  const removeDuplicates = (items, idKey = 'id') => {
    const unique = []
    const seen = new Set()
    items.forEach(item => {
      const id = item?.[idKey]
      if (id === undefined) return
      if (!seen.has(id)) {
        seen.add(id)
        unique.push(item)
      }
    })
    return unique
  }

  // PRODUCT recommendations
  const getProductRecommendations = (productId, cat) => {
    if (!productId) return []
    const recs = []

    // 1. Similar products (same category)
    if (cat) {
      const similarProducts = productsArr.filter(p => p?.category === cat && p?.id !== productId)
      recs.push(...similarProducts.map(p => ({ ...p, reason: 'Similar products' })))
    }

    // 2. Products from the same store
    const product = productsArr.find(p => p?.id === productId)
    if (product) {
      const sameStoreProducts = productsArr.filter(p => p?.storeId === product.storeId && p?.id !== productId)
      recs.push(...sameStoreProducts.map(p => ({ ...p, reason: 'From the same store' })))
    }

    // 3. Popular items
    const popularProducts = productsArr.filter(p => (p?.rating || 0) >= 4.5 || p?.tag === 'Best Seller')
    recs.push(...popularProducts.map(p => ({ ...p, reason: 'Popular choice' })))

    // 4. Based on user's favorite stores
    if (Array.isArray(favoritesSafe.stores) && favoritesSafe.stores.length > 0) {
      const favoriteStoreProducts = productsArr.filter(p => favoritesSafe.stores.includes(p?.storeId) && p?.id !== productId)
      recs.push(...favoriteStoreProducts.map(p => ({ ...p, reason: 'From your favorite stores' })))
    }

    return removeDuplicates(recs, 'id').sort(() => Math.random() - 0.5)
  }

  // STORE recommendations
  const getStoreRecommendations = (storeId, cat) => {
    if (!storeId) return []
    const recs = []

    // 1. Similar stores (same category)
    if (cat) {
      const similarStores = storesArr.filter(s => s?.category === cat && s?.id !== storeId)
      recs.push(...similarStores.map(s => ({ ...s, reason: 'Similar stores' })))
    }

    // 2. Stores in the same mall
    const store = storesArr.find(s => s?.id === storeId)
    if (store) {
      const sameMallStores = storesArr.filter(s => s?.mallId === store.mallId && s?.id !== storeId)
      recs.push(...sameMallStores.map(s => ({ ...s, reason: 'In the same mall' })))
    }

    // 3. Popular stores
    const popularStores = storesArr.filter(s => (s?.rating || 0) >= 4.5)
    recs.push(...popularStores.map(s => ({ ...s, reason: 'Popular choice' })))

    return removeDuplicates(recs, 'id').sort(() => Math.random() - 0.5)
  }

  // MALL recommendations
  const getMallRecommendations = (mallId) => {
    if (!mallId) return []
    if (!Array.isArray(mallsArr)) return []

    const recs = []
    const currentMall = mallsArr.find(m => String(m?.id) === String(mallId))
    if (currentMall) {
      const similarMalls = mallsArr.filter(m => {
        if (!m) return false
        if (String(m.id) === String(mallId)) return false
        const sc = Number(m.storeCount) || 0
        const cc = Number(currentMall.storeCount) || 0
        return sc >= cc * 0.7 && sc <= cc * 1.3
      })
      recs.push(...similarMalls.map(m => ({ ...m, reason: 'Similar size malls' })))
    }

    const popularMalls = mallsArr.filter(m => (m?.rating || 0) >= 4.5 && (m?.storeCount || 0) >= 50)
    recs.push(...popularMalls.map(m => ({ ...m, reason: 'Popular choice' })))

    return removeDuplicates(recs, 'id').sort(() => Math.random() - 0.5)
  }

  const getGeneralRecommendations = () => {
    const recs = []

    const popularProducts = productsArr.filter(p => (p?.rating || 0) >= 4.5 || p?.tag === 'Best Seller')
    recs.push(...popularProducts.map(p => ({ ...p, reason: 'Popular now' })))

    const popularStores = storesArr.filter(s => (s?.rating || 0) >= 4.5)
    recs.push(...popularStores.map(s => ({ ...s, reason: 'Top rated' })))

    if (Array.isArray(favoritesSafe.stores) && favoritesSafe.stores.length > 0) {
      const favoriteCategories = storesArr
        .filter(s => favoritesSafe.stores.includes(s?.id))
        .map(s => s?.category)
        .filter((cat, idx, arr) => cat && arr.indexOf(cat) === idx)

      favoriteCategories.forEach(cat => {
        const categoryProducts = productsArr.filter(p => p?.category === cat)
        recs.push(...categoryProducts.map(p => ({ ...p, reason: `Based on your ${cat} preference` })))
      })
    }

    return removeDuplicates(recs, 'id').slice(0, limit)
  }

  // generateRecommendations is declared before useEffect to avoid reference issues
  const generateRecommendations = () => {
    setIsLoading(true)
    let recs = []

    try {
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
    } catch (err) {
      console.warn('SmartRecommendations: error generating recommendations', err)
      recs = []
    }

    setRecommendations(recs.slice(0, limit))
    setIsLoading(false)
  }

  // Recompute whenever relevant inputs change
  useEffect(() => {
    generateRecommendations()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, id, category, JSON.stringify(favoritesSafe), JSON.stringify(userBehavior || {}), productsArr.length, storesArr.length, mallsArr.length])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  if (!Array.isArray(recommendations) || recommendations.length === 0) {
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
          if (item == null) return null

          // Product card (heuristic: has price or stock)
          if (item.price !== undefined) {
            return <ModernProductCard key={`p-${item.id}`} product={item} />
          }

          // Store card (heuristic: has storeCount undefined? stores have storeCount maybe undefined)
          if (item.storeCount === undefined && item.mallId !== undefined) {
            return <StoreCard key={`s-${item.id}`} store={item} mallId={item.mallId} />
          }

          // Mall card fallback
          return <MallCard key={`m-${item.id}`} mall={item} />
        })}
      </div>
    </div>
  )
}
