const makeKey = (userId) => `sme_notifications_v1_${userId || 'guest'}`

const safeParse = (value, fallback) => {
  if (!value) return fallback
  try {
    return JSON.parse(value)
  } catch {
    return fallback
  }
}

export const getNotifications = (userId) => {
  if (typeof window === 'undefined') return []
  const stored = safeParse(window.localStorage.getItem(makeKey(userId)), null)
  return Array.isArray(stored) ? stored : []
}

const saveNotifications = (userId, list) => {
  window.localStorage.setItem(makeKey(userId), JSON.stringify(list))
  window.dispatchEvent(
    new CustomEvent('sme:notifications', {
      detail: {
        userId: userId || 'guest'
      }
    })
  )
}

export const pushNotification = (userId, notification) => {
  const current = getNotifications(userId)
  const next = [
    {
      id: `${Date.now()}_${Math.random().toString(16).slice(2)}`,
      createdAt: Date.now(),
      read: false,
      ...notification
    },
    ...current
  ].slice(0, 50)

  saveNotifications(userId, next)
  return next
}

export const markNotificationRead = (userId, notificationId) => {
  const current = getNotifications(userId)
  const next = current.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
  saveNotifications(userId, next)
  return next
}

export const clearNotifications = (userId) => {
  saveNotifications(userId, [])
}
