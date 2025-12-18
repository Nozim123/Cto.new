import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import mallsData from '../data/malls.json'
import storesData from '../data/stores.json'
import productsData from '../data/products.json'
import { useUser } from './UserContext'

const EcosystemContext = createContext()

export function useEcosystem() {
  const context = useContext(EcosystemContext)
  if (!context) {
    throw new Error('useEcosystem must be used within EcosystemProvider')
  }
  return context
}

const STORAGE_KEY = 'mtc_ecosystem_v1'

const safeParse = (raw, fallback) => {
  if (!raw) return fallback
  try {
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

const getEmptyState = () => ({
  recentlyViewed: {
    stores: [],
    products: []
  },
  compare: {
    productIds: []
  },
  rewards: {
    pointsByUserId: {}
  },
  orders: {
    items: []
  },
  returns: {
    items: []
  },
  feedback: {
    items: []
  },
  cms: {
    pages: {}
  },
  seller: {
    requests: [],
    approvalsByUserId: {}
  },
  catalog: {
    productOverridesById: {},
    customProducts: []
  }
})

const mergeState = (value) => {
  const base = getEmptyState()
  if (!value || typeof value !== 'object') return base

  return {
    ...base,
    ...value,
    recentlyViewed: {
      ...base.recentlyViewed,
      ...(value.recentlyViewed || {})
    },
    compare: {
      ...base.compare,
      ...(value.compare || {})
    },
    rewards: {
      ...base.rewards,
      ...(value.rewards || {})
    },
    orders: {
      ...base.orders,
      ...(value.orders || {})
    },
    returns: {
      ...base.returns,
      ...(value.returns || {})
    },
    feedback: {
      ...base.feedback,
      ...(value.feedback || {})
    },
    cms: {
      ...base.cms,
      ...(value.cms || {})
    },
    seller: {
      ...base.seller,
      ...(value.seller || {})
    },
    catalog: {
      ...base.catalog,
      ...(value.catalog || {})
    }
  }
}

const dedupeById = (items) => {
  const seen = new Set()
  return items.filter((item) => {
    if (!item?.id) return false
    if (seen.has(item.id)) return false
    seen.add(item.id)
    return true
  })
}

const generateId = (prefix = 'id') => `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`

export function EcosystemProvider({ children }) {
  const { user } = useUser()
  const userId = user?.id || 'guest'

  const [state, setState] = useState(() => {
    const stored = safeParse(localStorage.getItem(STORAGE_KEY), null)
    return mergeState(stored)
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const addRecentlyViewed = (kind, id) => {
    if (!id || !['stores', 'products'].includes(kind)) return

    setState((prev) => {
      const list = Array.isArray(prev.recentlyViewed[kind]) ? prev.recentlyViewed[kind] : []
      const nextList = dedupeById([{ id, at: Date.now() }, ...list]).slice(0, 12)
      return {
        ...prev,
        recentlyViewed: {
          ...prev.recentlyViewed,
          [kind]: nextList
        }
      }
    })
  }

  const toggleCompare = (productId) => {
    if (!productId) return

    setState((prev) => {
      const ids = Array.isArray(prev.compare.productIds) ? prev.compare.productIds : []
      const exists = ids.includes(productId)
      const next = exists ? ids.filter((id) => id !== productId) : [productId, ...ids]
      return {
        ...prev,
        compare: {
          ...prev.compare,
          productIds: next.slice(0, 4)
        }
      }
    })
  }

  const clearCompare = () => {
    setState((prev) => ({
      ...prev,
      compare: {
        ...prev.compare,
        productIds: []
      }
    }))
  }

  const awardPoints = (amount, reason = '') => {
    if (!amount || Number.isNaN(Number(amount))) return

    const delta = Math.max(0, Number(amount))

    setState((prev) => {
      const current = Number(prev.rewards.pointsByUserId?.[userId] || 0)
      const nextPoints = current + delta

      return {
        ...prev,
        rewards: {
          ...prev.rewards,
          pointsByUserId: {
            ...(prev.rewards.pointsByUserId || {}),
            [userId]: nextPoints
          }
        },
        lastReward: {
          at: Date.now(),
          amount: delta,
          reason
        }
      }
    })
  }

  const getPoints = () => {
    return Number(state.rewards.pointsByUserId?.[userId] || 0)
  }

  const getTier = () => {
    const points = getPoints()
    if (points >= 2500) return 'Platinum'
    if (points >= 1000) return 'Gold'
    return 'Silver'
  }

  const upsertProductOverride = (productId, patch) => {
    if (!productId || !patch || typeof patch !== 'object') return

    setState((prev) => ({
      ...prev,
      catalog: {
        ...prev.catalog,
        productOverridesById: {
          ...(prev.catalog.productOverridesById || {}),
          [productId]: {
            ...(prev.catalog.productOverridesById || {})[productId],
            ...patch,
            updatedAt: Date.now()
          }
        }
      }
    }))
  }

  const createCustomProduct = (product) => {
    if (!product || typeof product !== 'object') return null

    const id = product.id || generateId('prod')
    const nextProduct = {
      ...product,
      id,
      createdAt: Date.now()
    }

    setState((prev) => ({
      ...prev,
      catalog: {
        ...prev.catalog,
        customProducts: [nextProduct, ...(prev.catalog.customProducts || [])]
      }
    }))

    return id
  }

  const deleteCustomProduct = (productId) => {
    if (!productId) return

    setState((prev) => ({
      ...prev,
      catalog: {
        ...prev.catalog,
        customProducts: (prev.catalog.customProducts || []).filter((p) => p.id !== productId)
      }
    }))
  }

  const getAllProducts = () => {
    const overrides = state.catalog.productOverridesById || {}
    const custom = state.catalog.customProducts || []

    const base = productsData.map((p) => {
      const patch = overrides[p.id]
      return patch ? { ...p, ...patch } : p
    })

    return [...custom, ...base]
  }

  const getProductById = (productId) => {
    if (!productId) return null
    return getAllProducts().find((p) => p.id === productId) || null
  }

  const getProductsByStore = (storeId) => {
    if (!storeId) return []
    return getAllProducts().filter((p) => p.storeId === storeId)
  }

  const getStoreById = (storeId) => {
    return storesData.find((s) => s.id === storeId) || null
  }

  const getMallById = (mallId) => {
    return mallsData.find((m) => m.id === mallId) || null
  }

  const submitFeedback = ({ type = 'feedback', message = '', email = '' }) => {
    const trimmed = message.trim()
    if (!trimmed) return null

    const item = {
      id: generateId('fb'),
      type,
      message: trimmed,
      email: email.trim(),
      userId,
      status: 'open',
      createdAt: Date.now()
    }

    setState((prev) => ({
      ...prev,
      feedback: {
        ...prev.feedback,
        items: [item, ...(prev.feedback.items || [])]
      }
    }))

    return item.id
  }

  const updateFeedbackStatus = (id, status) => {
    if (!id) return

    setState((prev) => ({
      ...prev,
      feedback: {
        ...prev.feedback,
        items: (prev.feedback.items || []).map((item) =>
          item.id === id ? { ...item, status: status || item.status, updatedAt: Date.now() } : item
        )
      }
    }))
  }

  const requestSellerAccess = ({ storeId }) => {
    if (!storeId) return null

    const store = getStoreById(storeId)
    const next = {
      id: generateId('seller_req'),
      userId,
      email: user?.email || '',
      storeId,
      storeName: store?.name || storeId,
      status: 'pending',
      createdAt: Date.now()
    }

    setState((prev) => ({
      ...prev,
      seller: {
        ...prev.seller,
        requests: [next, ...(prev.seller.requests || [])]
      }
    }))

    return next.id
  }

  const updateSellerRequestStatus = (requestId, status) => {
    if (!requestId) return

    setState((prev) => ({
      ...prev,
      seller: {
        ...prev.seller,
        requests: (prev.seller.requests || []).map((req) =>
          req.id === requestId ? { ...req, status, updatedAt: Date.now() } : req
        )
      }
    }))
  }

  const approveSeller = (requestId) => {
    const req = (state.seller.requests || []).find((r) => r.id === requestId)
    if (!req) return

    setState((prev) => {
      const approvals = prev.seller.approvalsByUserId || {}
      const existing = approvals[req.userId]?.storeIds || []
      const nextStoreIds = Array.from(new Set([req.storeId, ...existing]))

      return {
        ...prev,
        seller: {
          ...prev.seller,
          approvalsByUserId: {
            ...approvals,
            [req.userId]: {
              storeIds: nextStoreIds,
              approvedAt: Date.now()
            }
          },
          requests: (prev.seller.requests || []).map((r) =>
            r.id === requestId ? { ...r, status: 'approved', updatedAt: Date.now() } : r
          )
        }
      }
    })
  }

  const rejectSeller = (requestId) => {
    updateSellerRequestStatus(requestId, 'rejected')
  }

  const isSellerApprovedForStore = (storeId) => {
    if (!storeId) return false
    const storeIds = state.seller.approvalsByUserId?.[userId]?.storeIds || []
    return storeIds.includes(storeId)
  }

  const getCmsPage = (slug) => {
    if (!slug) return null
    return state.cms.pages?.[slug] || null
  }

  const upsertCmsPage = (slug, page) => {
    if (!slug || !page || typeof page !== 'object') return

    setState((prev) => ({
      ...prev,
      cms: {
        ...prev.cms,
        pages: {
          ...(prev.cms.pages || {}),
          [slug]: {
            ...(prev.cms.pages || {})[slug],
            ...page,
            updatedAt: Date.now()
          }
        }
      }
    }))
  }

  const createDemoOrder = (productId) => {
    const product = getProductById(productId)
    if (!product) return null

    const order = {
      id: generateId('order'),
      userId,
      storeId: product.storeId,
      productIds: [product.id],
      total: product.price,
      status: 'ready_for_pickup',
      pickupCode: generateId('pickup').slice(-10).toUpperCase(),
      createdAt: Date.now()
    }

    setState((prev) => ({
      ...prev,
      orders: {
        ...prev.orders,
        items: [order, ...(prev.orders.items || [])]
      }
    }))

    return order.id
  }

  const confirmPickup = (orderId) => {
    if (!orderId) return

    setState((prev) => ({
      ...prev,
      orders: {
        ...prev.orders,
        items: (prev.orders.items || []).map((o) =>
          o.id === orderId ? { ...o, status: 'picked_up', pickedUpAt: Date.now() } : o
        )
      }
    }))
  }

  const submitReturnRequest = ({ orderId, reason = '' }) => {
    if (!orderId) return null

    const order = (state.orders.items || []).find((o) => o.id === orderId)
    if (!order) return null

    const item = {
      id: generateId('return'),
      orderId,
      userId,
      storeId: order.storeId,
      productIds: order.productIds,
      reason: reason.trim(),
      status: 'requested',
      storeMessage: '',
      createdAt: Date.now()
    }

    setState((prev) => ({
      ...prev,
      returns: {
        ...prev.returns,
        items: [item, ...(prev.returns.items || [])]
      }
    }))

    return item.id
  }

  const updateReturn = (returnId, patch) => {
    if (!returnId || !patch) return

    setState((prev) => ({
      ...prev,
      returns: {
        ...prev.returns,
        items: (prev.returns.items || []).map((r) =>
          r.id === returnId ? { ...r, ...patch, updatedAt: Date.now() } : r
        )
      }
    }))
  }

  const value = useMemo(
    () => ({
      userId,
      state,
      recentlyViewed: state.recentlyViewed,
      compareProductIds: state.compare.productIds,
      addRecentlyViewed,
      toggleCompare,
      clearCompare,
      awardPoints,
      getPoints,
      getTier,
      getAllProducts,
      getProductsByStore,
      getProductById,
      getStoreById,
      getMallById,
      upsertProductOverride,
      createCustomProduct,
      deleteCustomProduct,
      submitFeedback,
      updateFeedbackStatus,
      requestSellerAccess,
      approveSeller,
      rejectSeller,
      isSellerApprovedForStore,
      getCmsPage,
      upsertCmsPage,
      createDemoOrder,
      confirmPickup,
      submitReturnRequest,
      updateReturn
    }),
    [state, userId]
  )

  return <EcosystemContext.Provider value={value}>{children}</EcosystemContext.Provider>
}
