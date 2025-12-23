// Real-time update service for live data
import { useState, useEffect } from 'react'

class RealTimeService {
  constructor() {
    this.subscribers = new Map()
    this.updateInterval = null
    this.isConnected = false
  }

  // Subscribe to updates for a specific entity
  subscribe(entityType, entityId, callback) {
    const key = `${entityType}:${entityId}`
    
    if (!this.subscribers.has(key)) {
      this.subscribers.set(key, new Set())
    }
    
    this.subscribers.get(key).add(callback)
    
    // Start periodic updates if not already running
    if (!this.updateInterval) {
      this.startPeriodicUpdates()
    }
    
    // Return unsubscribe function
    return () => {
      const callbacks = this.subscribers.get(key)
      if (callbacks) {
        callbacks.delete(callback)
        if (callbacks.size === 0) {
          this.subscribers.delete(key)
        }
      }
      
      // Stop updates if no more subscribers
      if (this.subscribers.size === 0) {
        this.stopPeriodicUpdates()
      }
    }
  }

  // Start periodic updates every 30 seconds
  startPeriodicUpdates() {
    this.updateInterval = setInterval(() => {
      this.broadcastUpdates()
    }, 30000) // 30 seconds
    
    this.isConnected = true
    console.log('Real-time service started')
  }

  // Stop periodic updates
  stopPeriodicUpdates() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval)
      this.updateInterval = null
      this.isConnected = false
      console.log('Real-time service stopped')
    }
  }

  // Broadcast updates to all subscribers
  async broadcastUpdates() {
    for (const [key, callbacks] of this.subscribers) {
      const [entityType, entityId] = key.split(':')
      
      try {
        // Simulate real-time data fetch
        const updateData = await this.fetchLatestData(entityType, entityId)
        
        // Notify all callbacks for this entity
        callbacks.forEach(callback => {
          try {
            callback(updateData)
          } catch (error) {
            console.error('Error in real-time callback:', error)
          }
        })
      } catch (error) {
        console.error(`Failed to fetch updates for ${key}:`, error)
      }
    }
  }

  // Simulate fetching latest data (in real app, this would call APIs)
  async fetchLatestData(entityType, entityId) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, Math.random() * 1000))
    
    const baseData = {
      timestamp: new Date().toISOString(),
      entityType,
      entityId
    }

    switch (entityType) {
      case 'mall':
        return {
          ...baseData,
          status: 'open', // or 'closed' based on time
          visitorCount: Math.floor(Math.random() * 1000) + 500,
          activeStores: Math.floor(Math.random() * 50) + 80,
          lastUpdated: new Date().toLocaleTimeString()
        }
      
      case 'store':
        return {
          ...baseData,
          status: 'open',
          productCount: Math.floor(Math.random() * 200) + 50,
          recentActivity: Math.random() > 0.7 ? 'new_products' : 'normal',
          lastUpdated: new Date().toLocaleTimeString()
        }
      
      case 'subscription':
        return {
          ...baseData,
          notifications: Math.floor(Math.random() * 5),
          newProducts: Math.floor(Math.random() * 10),
          discounts: Math.random() > 0.8 ? ['20% off electronics', 'Buy 1 Get 1 Free'] : [],
          lastUpdated: new Date().toLocaleTimeString()
        }
      
      default:
        return baseData
    }
  }

  // Get connection status
  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      activeSubscriptions: this.subscribers.size
    }
  }

  // Force immediate update for specific entity
  async forceUpdate(entityType, entityId) {
    const key = `${entityType}:${entityId}`
    const callbacks = this.subscribers.get(key)
    
    if (callbacks) {
      try {
        const updateData = await this.fetchLatestData(entityType, entityId)
        callbacks.forEach(callback => callback(updateData))
      } catch (error) {
        console.error(`Failed to force update for ${key}:`, error)
      }
    }
  }
}

// Create singleton instance
const realTimeService = new RealTimeService()

export default realTimeService

// React hook for using real-time updates
export const useRealTimeUpdates = (entityType, entityId) => {
  const [updates, setUpdates] = useState(null)
  const [connectionStatus, setConnectionStatus] = useState({ isConnected: false, activeSubscriptions: 0 })

  useEffect(() => {
    if (!entityType || !entityId) return

    // Subscribe to updates
    const unsubscribe = realTimeService.subscribe(entityType, entityId, (updateData) => {
      setUpdates(updateData)
    })

    // Get initial connection status
    setConnectionStatus(realTimeService.getConnectionStatus())

    return () => {
      unsubscribe()
    }
  }, [entityType, entityId])

  const forceUpdate = () => {
    realTimeService.forceUpdate(entityType, entityId)
  }

  return {
    updates,
    connectionStatus,
    forceUpdate
  }
}