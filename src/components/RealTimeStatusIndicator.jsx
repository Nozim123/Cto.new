import { useState, useEffect } from 'react'
import { useTheme } from '../contexts/ThemeContext'
import realTimeService from '../services/realTimeService'

export default function RealTimeStatusIndicator() {
  const [connectionStatus, setConnectionStatus] = useState({ isConnected: false, activeSubscriptions: 0 })
  const [lastUpdate, setLastUpdate] = useState(null)
  const { darkMode } = useTheme()

  useEffect(() => {
    // Update connection status periodically
    const updateStatus = () => {
      const status = realTimeService.getConnectionStatus()
      setConnectionStatus(status)
      setLastUpdate(new Date().toLocaleTimeString())
    }

    // Update immediately and then every 10 seconds
    updateStatus()
    const interval = setInterval(updateStatus, 10000)

    return () => clearInterval(interval)
  }, [])

  const getStatusColor = () => {
    if (connectionStatus.isConnected) {
      return connectionStatus.activeSubscriptions > 0 ? 'text-green-500' : 'text-yellow-500'
    }
    return 'text-red-500'
  }

  const getStatusText = () => {
    if (connectionStatus.isConnected) {
      return connectionStatus.activeSubscriptions > 0 ? 'Live' : 'Connected'
    }
    return 'Offline'
  }

  const getStatusIcon = () => {
    if (connectionStatus.isConnected) {
      return connectionStatus.activeSubscriptions > 0 ? '🟢' : '🟡'
    }
    return '🔴'
  }

  return (
    <div className={`fixed bottom-4 right-4 z-50 ${
      darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    } border rounded-lg p-3 shadow-lg backdrop-blur-sm`}>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">{getStatusIcon()}</span>
          <div>
            <div className={`text-sm font-medium ${getStatusColor()}`}>
              Real-time {getStatusText()}
            </div>
            {lastUpdate && (
              <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Last update: {lastUpdate}
              </div>
            )}
          </div>
        </div>
        
        {connectionStatus.activeSubscriptions > 0 && (
          <div className={`text-xs px-2 py-1 rounded-full ${
            darkMode ? 'bg-green-900/20 text-green-400' : 'bg-green-100 text-green-700'
          }`}>
            {connectionStatus.activeSubscriptions} active
          </div>
        )}
      </div>
    </div>
  )
}