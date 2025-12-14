import { useCallback } from 'react'
import { useUser } from '../contexts/UserContext'

const generateId = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`

const bumpTrending = (type, id) => {
  try {
    const raw = localStorage.getItem('sme_trending')
    const data = raw ? JSON.parse(raw) : { malls: {}, stores: {}, products: {} }

    data[type] = data[type] || {}
    data[type][id] = (data[type][id] || 0) + 1

    localStorage.setItem('sme_trending', JSON.stringify(data))
  } catch {
    // ignore
  }
}

export default function useActivity() {
  const { user } = useUser()

  const track = useCallback(
    ({ type, id, title, meta = {} }) => {
      if (!type || !id) return

      const userKey = `sme_activity:${user?.id || 'guest'}`
      try {
        const existing = JSON.parse(localStorage.getItem(userKey) || '[]')
        const next = [
          {
            id: generateId(),
            type,
            entityId: id,
            title,
            meta,
            createdAt: new Date().toISOString(),
          },
          ...existing,
        ].slice(0, 100)

        localStorage.setItem(userKey, JSON.stringify(next))
      } catch {
        // ignore
      }

      bumpTrending(type, id)
    },
    [user?.id]
  )

  return { track }
}
