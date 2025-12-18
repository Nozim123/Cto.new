export const SEARCH_TYPES = {
  all: 'all',
  malls: 'malls',
  stores: 'stores',
  products: 'products'
}

export const normalizeText = (value) => {
  if (!value) return ''
  return String(value)
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
}

const tokenize = (value) => normalizeText(value).split(/\s+/).filter(Boolean)

const scoreText = (text, queryTokens) => {
  if (!text || queryTokens.length === 0) return 0

  const haystack = normalizeText(text)

  let score = 0
  for (const token of queryTokens) {
    const idx = haystack.indexOf(token)
    if (idx === -1) return 0

    // Prefer prefix matches, then earlier occurrences.
    score += idx === 0 ? 8 : idx < 10 ? 5 : 3
    score += Math.max(0, 10 - idx)
  }

  return score
}

export function searchMarketplace({
  query,
  type = SEARCH_TYPES.all,
  malls,
  stores,
  products,
  limit = 8
}) {
  const queryTokens = tokenize(query)

  if (queryTokens.length === 0) {
    return {
      malls: [],
      stores: [],
      products: [],
      flat: []
    }
  }

  const mallsById = new Map(malls.map((m) => [m.id, m]))
  const storesById = new Map(stores.map((s) => [s.id, s]))

  const mallResults = malls
    .map((mall) => {
      const score = scoreText(`${mall.name} ${mall.location} ${mall.description}`, queryTokens)
      return { mall, score }
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)

  const storeResults = stores
    .map((store) => {
      const mall = mallsById.get(store.mallId)
      const score = scoreText(
        `${store.name} ${store.category} ${store.description} ${store.about} ${mall?.name || ''}`,
        queryTokens
      )
      return { store, mall, score }
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)

  const productResults = products
    .map((product) => {
      const store = storesById.get(product.storeId)
      const mall = store ? mallsById.get(store.mallId) : null
      const score = scoreText(
        `${product.name} ${product.category} ${product.tag || ''} ${product.brand || ''} ${product.description || ''} ${store?.name || ''} ${mall?.name || ''}`,
        queryTokens
      )
      return { product, store, mall, score }
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)

  const pick = (t) => {
    switch (t) {
      case SEARCH_TYPES.malls:
        return { malls: mallResults, stores: [], products: [] }
      case SEARCH_TYPES.stores:
        return { malls: [], stores: storeResults, products: [] }
      case SEARCH_TYPES.products:
        return { malls: [], stores: [], products: productResults }
      default:
        return { malls: mallResults, stores: storeResults, products: productResults }
    }
  }

  const { malls: pickedMalls, stores: pickedStores, products: pickedProducts } = pick(type)

  const flat = [
    ...pickedMalls.map((r) => ({ type: SEARCH_TYPES.malls, score: r.score, item: r.mall })),
    ...pickedStores.map((r) => ({ type: SEARCH_TYPES.stores, score: r.score, item: r.store })),
    ...pickedProducts.map((r) => ({ type: SEARCH_TYPES.products, score: r.score, item: r.product }))
  ]
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)

  return {
    malls: pickedMalls,
    stores: pickedStores,
    products: pickedProducts,
    flat
  }
}
