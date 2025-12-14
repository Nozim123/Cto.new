import { useMemo } from 'react'
import useLocalStorageState from './useLocalStorageState'

const empty = { malls: {}, stores: {}, products: {} }

export default function useTrending() {
  const [data] = useLocalStorageState('sme_trending', empty)

  const getTop = useMemo(
    () => (type, limit = 6) => {
      const map = data?.[type] || {}
      return Object.entries(map)
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit)
        .map(([id, score]) => ({ id, score }))
    },
    [data]
  )

  return { data, getTop }
}
