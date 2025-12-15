import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { Navigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { userAuthAPI } from '../services/userApi'

const UserAuthContext = createContext(null)

export function UserAuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('userToken')
      if (!token) {
        setLoading(false)
        return
      }

      const response = await userAuthAPI.getProfile()
      setUser(response.data)
    } catch (error) {
      localStorage.removeItem('userToken')
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (credentials) => {
    try {
      const response = await userAuthAPI.login(credentials)
      const { token, user: nextUser } = response.data

      localStorage.setItem('userToken', token)
      setUser(nextUser)
      toast.success('Welcome back!')
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed'
      toast.error(message)
      return { success: false, error: message }
    }
  }

  const register = async (payload) => {
    try {
      const response = await userAuthAPI.register(payload)
      const { token, user: nextUser } = response.data

      localStorage.setItem('userToken', token)
      setUser(nextUser)
      toast.success('Account created')
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed'
      toast.error(message)
      return { success: false, error: message }
    }
  }

  const logout = () => {
    localStorage.removeItem('userToken')
    setUser(null)
    toast.success('Signed out')
  }

  const value = useMemo(
    () => ({ user, loading, isAuthenticated: !!user, login, register, logout, checkAuth }),
    [user, loading]
  )

  return <UserAuthContext.Provider value={value}>{children}</UserAuthContext.Provider>
}

export const useUserAuth = () => {
  const ctx = useContext(UserAuthContext)
  if (!ctx) throw new Error('useUserAuth must be used within UserAuthProvider')
  return ctx
}

export const UserProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useUserAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-full max-w-md px-4">
          <div className="h-10 rounded-lg bg-gray-200 dark:bg-gray-800 animate-pulse" />
          <div className="mt-4 h-40 rounded-2xl bg-gray-200 dark:bg-gray-800 animate-pulse" />
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}
