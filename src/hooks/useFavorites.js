import { useCallback, useMemo } from 'react'
import { useUser } from '../contexts/UserContext'
import useLocalStorageState from './useLocalStorageState'

const initial = {
  malls: [],
  stores: [],
  products: [],
}

export default function useFavorites() {
  const { user } = useUser()
  const key = `sme_favorites:${user?.id || 'guest'}`
  const [favorites, setFavorites] = useLocalStorageState(key, initial)

  const isFavorite = useCallback(
    (type, id) => {
      const list = favorites?.[type] || []
      return list.includes(id)
    },
    [favorites]
  )

  const toggleFavorite = useCallback(
    (type, id) => {
      setFavorites((prev) => {
        const list = prev?.[type] || []
        const exists = list.includes(id)
        const nextList = exists ? list.filter((x) => x !== id) : [id, ...list]
        return { ...initial, ...prev, [type]: nextList }
      })
    },
    [setFavorites]
  )

  const counts = useMemo(
    () => ({
      malls: favorites.malls?.length || 0,
      stores: favorites.stores?.length || 0,
      products: favorites.products?.length || 0,
    }),
    [favorites]
  )

  return { favorites, counts, isFavorite, toggleFavorite }
}
