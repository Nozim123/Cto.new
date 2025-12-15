import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const UserContext = createContext(null)

const STORAGE_KEY = 'sme_user_v1'
const PREFS_KEY = 'sme_prefs_v1'

const defaultUser = {
  name: 'Guest',
  email: 'guest@example.com',
  phone: ''
}

const defaultPrefs = {
  animations: true
}

export function UserProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultUser
    try {
      return { ...defaultUser, ...JSON.parse(raw) }
    } catch {
      return defaultUser
    }
  })

  const [prefs, setPrefs] = useState(() => {
    const raw = window.localStorage.getItem(PREFS_KEY)
    if (!raw) return defaultPrefs
    try {
      return { ...defaultPrefs, ...JSON.parse(raw) }
    } catch {
      return defaultPrefs
    }
  })

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
  }, [user])

  useEffect(() => {
    window.localStorage.setItem(PREFS_KEY, JSON.stringify(prefs))
    if (prefs.animations) {
      document.documentElement.classList.remove('reduce-motion')
    } else {
      document.documentElement.classList.add('reduce-motion')
    }
  }, [prefs])

  const value = useMemo(
    () => ({
      user,
      setUser,
      prefs,
      setPrefs
    }),
    [user, prefs]
  )

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

export function useUser() {
  const ctx = useContext(UserContext)
  if (!ctx) throw new Error('useUser must be used within UserProvider')
  return ctx
}
