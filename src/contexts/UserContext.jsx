import { createContext, useCallback, useContext, useMemo } from 'react'
import useLocalStorageState from '../hooks/useLocalStorageState'

const UserContext = createContext(null)

const generateId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

const toHex = (buffer) => {
  const bytes = new Uint8Array(buffer)
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

const hashPassword = async (password) => {
  if (!password) return ''

  try {
    if (!crypto?.subtle) return password

    const data = new TextEncoder().encode(password)
    const digest = await crypto.subtle.digest('SHA-256', data)
    return toHex(digest)
  } catch {
    return password
  }
}

export function UserProvider({ children }) {
  const [users, setUsers] = useLocalStorageState('sme_users', [])
  const [sessionUserId, setSessionUserId] = useLocalStorageState('sme_session', null)

  const user = useMemo(() => {
    if (!sessionUserId) return null
    return users.find((u) => u.id === sessionUserId) || null
  }, [sessionUserId, users])

  const createNotification = useCallback((userId, notification) => {
    const key = `sme_notifications:${userId}`
    try {
      const existing = JSON.parse(localStorage.getItem(key) || '[]')
      const next = [
        {
          id: generateId(),
          createdAt: new Date().toISOString(),
          read: false,
          ...notification,
        },
        ...existing,
      ].slice(0, 50)
      localStorage.setItem(key, JSON.stringify(next))
    } catch {
      // ignore
    }
  }, [])

  const register = useCallback(
    async ({ name, email, password }) => {
      const normalizedEmail = String(email || '').trim().toLowerCase()
      if (!normalizedEmail || !password || !name) {
        return { success: false, error: 'Please fill all required fields.' }
      }

      const exists = users.some((u) => u.email.toLowerCase() === normalizedEmail)
      if (exists) return { success: false, error: 'An account with this email already exists.' }

      const passwordHash = await hashPassword(password)

      const newUser = {
        id: generateId(),
        name: String(name).trim(),
        email: normalizedEmail,
        passwordHash,
        role: 'user',
        city: 'Samarkand',
        avatarUrl: '',
        createdAt: new Date().toISOString(),
        preferences: {
          categories: [],
        },
      }

      setUsers((prev) => [newUser, ...prev])
      setSessionUserId(newUser.id)

      localStorage.setItem('sme_onboarding_pending', 'true')
      createNotification(newUser.id, {
        title: `Welcome, ${newUser.name}!`,
        message: 'Your dashboard is ready. Start by saving a few favorites to unlock smarter recommendations.',
        type: 'welcome',
      })

      return { success: true, user: newUser }
    },
    [createNotification, setSessionUserId, setUsers, users]
  )

  const login = useCallback(
    async ({ email, password }) => {
      const normalizedEmail = String(email || '').trim().toLowerCase()
      const existing = users.find((u) => u.email.toLowerCase() === normalizedEmail)
      if (!existing) return { success: false, error: 'Invalid credentials.' }

      const passwordHash = await hashPassword(password)
      if (existing.passwordHash !== passwordHash) return { success: false, error: 'Invalid credentials.' }

      setSessionUserId(existing.id)

      const onboarded = localStorage.getItem(`sme_onboarded:${existing.id}`) === 'true'
      if (!onboarded) localStorage.setItem('sme_onboarding_pending', 'true')

      return { success: true, user: existing }
    },
    [setSessionUserId, users]
  )

  const logout = useCallback(() => {
    setSessionUserId(null)
  }, [setSessionUserId])

  const updateProfile = useCallback(
    (partial) => {
      if (!user) return

      setUsers((prev) =>
        prev.map((u) => {
          if (u.id !== user.id) return u
          return { ...u, ...partial, updatedAt: new Date().toISOString() }
        })
      )
    },
    [setUsers, user]
  )

  const value = useMemo(
    () => ({
      user,
      users,
      isAuthenticated: !!user,
      register,
      login,
      logout,
      updateProfile,
      createNotification,
    }),
    [createNotification, login, logout, register, updateProfile, user, users]
  )

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

export function useUser() {
  const ctx = useContext(UserContext)
  if (!ctx) throw new Error('useUser must be used within UserProvider')
  return ctx
}
