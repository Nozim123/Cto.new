import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { publicAPI } from '../services/publicApi'
import { getSocket } from '../services/realtime'

const PublicDataContext = createContext(null)

export function PublicDataProvider({ children }) {
  const [loading, setLoading] = useState(true)
  const [connected, setConnected] = useState(false)
  const [data, setData] = useState({
    malls: [],
    stores: [],
    products: [],
    banners: [],
    settings: null
  })

  useEffect(() => {
    let mounted = true

    const load = async () => {
      try {
        const res = await publicAPI.bootstrap()
        if (!mounted) return
        setData(res.data)
      } catch {
        if (!mounted) return
        setData({ malls: [], stores: [], products: [], banners: [], settings: null })
      } finally {
        if (mounted) setLoading(false)
      }
    }

    load()

    return () => {
      mounted = false
    }
  }, [])

  useEffect(() => {
    const socket = getSocket()

    const onConnect = () => setConnected(true)
    const onDisconnect = () => setConnected(false)

    const onPublicUpdate = (payload) => {
      if (!payload?.resource) return
      setData((prev) => ({
        ...prev,
        [payload.resource]: payload.data
      }))
    }

    socket.on('connect', onConnect)
    socket.on('disconnect', onDisconnect)
    socket.on('public:update', onPublicUpdate)

    return () => {
      socket.off('connect', onConnect)
      socket.off('disconnect', onDisconnect)
      socket.off('public:update', onPublicUpdate)
    }
  }, [])

  const value = useMemo(
    () => ({
      ...data,
      loading,
      connected
    }),
    [data, loading, connected]
  )

  return <PublicDataContext.Provider value={value}>{children}</PublicDataContext.Provider>
}

export function usePublicData() {
  const ctx = useContext(PublicDataContext)
  if (!ctx) {
    throw new Error('usePublicData must be used within PublicDataProvider')
  }
  return ctx
}
