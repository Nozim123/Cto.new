import { createContext, useContext, useState, useEffect } from 'react'

const UserContext = createContext()

export function useUser() {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within UserProvider')
  }
  return context
}

export function UserProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user')
    return saved ? JSON.parse(saved) : null
  })

  const [isAdmin, setIsAdmin] = useState(() => {
    const saved = localStorage.getItem('isAdmin')
    return saved ? JSON.parse(saved) : false
  })

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem('token')
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
    const token = localStorage.getItem('token')
    setIsAuthenticated(!!token)
  }, [])

  const login = (userData, adminToken = null) => {
    setUser(userData)
    if (adminToken) {
      setIsAdmin(true)
      localStorage.setItem('token', adminToken)
    }
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
    const updatedUser = { ...user, ...profileData }
    setUser(updatedUser)
  }

  const value = {
    user,
    isAdmin,
    isAuthenticated,
    login,
    logout,
    updateProfile
  }

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  )
}