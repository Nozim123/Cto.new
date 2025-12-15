import { useEffect, useMemo, useState } from 'react'
import { getFavorites } from '../services/favorites'

export default function useFavorites(userId) {
  const [version, setVersion] = useState(0)

  useEffect(() => {
    const handler = (e) => {
      const target = e?.detail?.userId
      if ((userId || 'guest') === target) {
        setVersion((v) => v + 1)
      }
    }

    window.addEventListener('sme:favorites', handler)
    return () => window.removeEventListener('sme:favorites', handler)
  }, [userId])

  const favorites = useMemo(() => getFavorites(userId), [userId, version])

  return favorites
}
