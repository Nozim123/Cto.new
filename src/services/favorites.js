const makeKey = (userId) => `sme_favorites_v1_${userId || 'guest'}`

const safeParse = (value, fallback) => {
  if (!value) return fallback
  try {
    return JSON.parse(value)
  } catch {
    return fallback
  }
}

export const getFavorites = (userId) => {
  if (typeof window === 'undefined') {
    return { malls: [], stores: [], products: [] }
  }

  const stored = safeParse(window.localStorage.getItem(makeKey(userId)), null)
  const base = { malls: [], stores: [], products: [] }

  if (!stored || typeof stored !== 'object') return base

  return {
    malls: Array.isArray(stored.malls) ? stored.malls : base.malls,
    stores: Array.isArray(stored.stores) ? stored.stores : base.stores,
    products: Array.isArray(stored.products) ? stored.products : base.products
  }
}

const saveFavorites = (userId, favorites) => {
  window.localStorage.setItem(makeKey(userId), JSON.stringify(favorites))
  window.dispatchEvent(
    new CustomEvent('sme:favorites', {
      detail: {
        userId: userId || 'guest'
      }
    })
  )
}

export const isFavorite = ({ userId, type, id }) => {
  const favorites = getFavorites(userId)
  const key = type === 'mall' ? 'malls' : type === 'store' ? 'stores' : 'products'
  return favorites[key].includes(id)
}

export const toggleFavorite = ({ userId, type, id }) => {
  const favorites = getFavorites(userId)
  const key = type === 'mall' ? 'malls' : type === 'store' ? 'stores' : 'products'

  const next = {
    ...favorites,
    [key]: favorites[key].includes(id)
      ? favorites[key].filter((x) => x !== id)
      : [...favorites[key], id]
  }

  saveFavorites(userId, next)
  return next[key].includes(id)
}

export const clearFavorites = (userId) => {
  if (typeof window === 'undefined') return
  saveFavorites(userId, { malls: [], stores: [], products: [] })
}
