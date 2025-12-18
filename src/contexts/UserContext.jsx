import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const UserContext = createContext()

export function useUser() {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within UserProvider')
  }
  return context
}

const FAVORITES_STORAGE_KEY = 'mtc_favorites_v1'

const safeParse = (raw, fallback) => {
  if (!raw) return fallback
  try {
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

const normalizeFavorites = (value) => {
  const base = {
    malls: [],
    stores: [],
    products: []
  }

  if (!value || typeof value !== 'object') return base

  return {
    malls: Array.isArray(value.malls) ? value.malls : [],
    stores: Array.isArray(value.stores) ? value.stores : [],
    products: Array.isArray(value.products) ? value.products : []
  }
}

export function UserProvider({ children }) {
  const [user, setUser] = useState(() => safeParse(localStorage.getItem('user'), null))

  const [isAdmin, setIsAdmin] = useState(() => safeParse(localStorage.getItem('isAdmin'), false))

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem('token')
  })

  const [favorites, setFavorites] = useState(() => {
    return normalizeFavorites(safeParse(localStorage.getItem(FAVORITES_STORAGE_KEY), null))
  })

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user))
    } else {
      localStorage.removeItem('user')
    }
  }, [user])

  useEffect(() => {
    localStorage.setItem('isAdmin', JSON.stringify(isAdmin))
  }, [isAdmin])

  useEffect(() => {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites))
  }, [favorites])

  useEffect(() => {
    const token = localStorage.getItem('token')
    setIsAuthenticated(!!token)
  }, [])

  const login = (userData, token = null) => {
    setUser(userData)

    const role = userData?.role
    const adminRoles = new Set(['admin', 'owner', 'superadmin'])
    setIsAdmin(adminRoles.has(role))

    const finalToken = token || localStorage.getItem('token') || `user_token_${Date.now()}`
    localStorage.setItem('token', finalToken)
    setIsAuthenticated(true)
  }

  const logout = () => {
    setUser(null)
    setIsAdmin(false)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('isAdmin')
    setIsAuthenticated(false)
  }

  const updateProfile = (profileData) => {
    const updatedUser = { ...(user || {}), ...profileData }
    setUser(updatedUser)
  }

  const toggleFavorite = (kind, id) => {
    if (!id || !['malls', 'stores', 'products'].includes(kind)) return

    setFavorites((prev) => {
      const list = prev[kind]
      const exists = list.includes(id)
      const next = exists ? list.filter((x) => x !== id) : [id, ...list]
      return { ...prev, [kind]: next }
    })
  }

  const isFavorite = (kind, id) => {
    if (!id || !['malls', 'stores', 'products'].includes(kind)) return false
    return favorites[kind].includes(id)
  }

  const value = useMemo(
    () => ({
      user,
      isAdmin,
      isAuthenticated,
      favorites,
      login,
      logout,
      updateProfile,
      toggleFavorite,
      isFavorite
    }),
    [user, isAdmin, isAuthenticated, favorites]
  )

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}
