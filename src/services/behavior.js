const STORAGE_KEY = 'sme_behavior_v1'

const safeParse = (value, fallback) => {
  if (!value) return fallback
  try {
    return JSON.parse(value)
  } catch {
    return fallback
  }
}

const getEmptyState = () => ({
  counts: {
    mall: {},
    store: {},
    product: {},
    category: {}
  },
  events: [],
  lastEventAt: null
})

export const getBehaviorState = () => {
  if (typeof window === 'undefined') return getEmptyState()

  const stored = safeParse(window.localStorage.getItem(STORAGE_KEY), null)
  if (!stored || typeof stored !== 'object') return getEmptyState()

  return {
    ...getEmptyState(),
    ...stored,
    counts: {
      ...getEmptyState().counts,
      ...(stored.counts || {})
    },
    events: Array.isArray(stored.events) ? stored.events : []
  }
}

const saveBehaviorState = (state) => {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export const trackBehavior = ({ type, id, category }) => {
  if (typeof window === 'undefined') return
  if (!type || !id) return

  const state = getBehaviorState()

  const next = {
    ...state,
    counts: {
      ...state.counts,
      [type]: {
        ...(state.counts[type] || {}),
        [id]: ((state.counts[type] || {})[id] || 0) + 1
      }
    },
    events: [
      {
        id: `${Date.now()}_${Math.random().toString(16).slice(2)}`,
        type,
        targetId: id,
        category: category || null,
        createdAt: Date.now()
      },
      ...(state.events || [])
    ].slice(0, 50),
    lastEventAt: Date.now()
  }

  if (category) {
    next.counts.category = {
      ...(next.counts.category || {}),
      [category]: ((next.counts.category || {})[category] || 0) + 1
    }
  }

  saveBehaviorState(next)
}

export const getTopBehaviorIds = (type, limit = 5) => {
  const state = getBehaviorState()
  const byId = state.counts?.[type] || {}

  return Object.entries(byId)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([id]) => id)
}

export const getTopCategories = (limit = 3) => {
  const state = getBehaviorState()
  const byCategory = state.counts?.category || {}

  return Object.entries(byCategory)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([category]) => category)
}

export const getRecentEvents = (limit = 10) => {
  const state = getBehaviorState()
  const list = Array.isArray(state.events) ? state.events : []
  return list.slice(0, limit)
}

export const clearBehavior = () => {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(STORAGE_KEY)
}
