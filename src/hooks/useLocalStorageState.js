import { useCallback, useEffect, useState } from 'react'

export default function useLocalStorageState(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key)
      if (raw === null) return initialValue
      return JSON.parse(raw)
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // ignore quota / serialization errors
    }
  }, [key, value])

  const reset = useCallback(() => {
    setValue(initialValue)
  }, [initialValue])

  return [value, setValue, reset]
}
