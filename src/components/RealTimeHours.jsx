import { useState, useEffect } from 'react'
import { useTheme } from '../contexts/ThemeContext'

export default function RealTimeHours({ mall, className = '' }) {
  const { darkMode } = useTheme()
  const [currentTime, setCurrentTime] = useState(new Date())
  const [timeUntilAction, setTimeUntilAction] = useState('')
  const [status, setStatus] = useState('closed')

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setCurrentTime(now)

      if (mall.status === 'coming_soon') {
        setStatus('coming_soon')
        setTimeUntilAction('Opening 2025')
        return
      }

      const currentHour = now.getHours()
      const currentMinute = now.getMinutes()
      const currentTimeMinutes = currentHour * 60 + currentMinute

      const openTime = mall.openTime ? mall.openTime.split(':') : ['10', '00']
      const closeTime = mall.closeTime ? mall.closeTime.split(':') : ['22', '00']

      const openMinutes = parseInt(openTime[0]) * 60 + parseInt(openTime[1])
      const closeMinutes = parseInt(closeTime[0]) * 60 + parseInt(closeTime[1])

      let isOpen = false

      // Handle overnight hours (e.g., 10:00 AM to 12:00 AM)
      if (closeMinutes < openMinutes) {
        isOpen = currentTimeMinutes >= openMinutes || currentTimeMinutes < closeMinutes
      } else {
        isOpen = currentTimeMinutes >= openMinutes && currentTimeMinutes < closeMinutes
      }

      if (isOpen) {
        setStatus('open')
        
        // Calculate time until closing
        let timeUntilClose
        if (closeMinutes < openMinutes) {
          // Overnight hours
          timeUntilClose = currentTimeMinutes < closeMinutes 
            ? closeMinutes - currentTimeMinutes
            : (24 * 60) - currentTimeMinutes + closeMinutes
        } else {
          timeUntilClose = closeMinutes - currentTimeMinutes
        }

        const hours = Math.floor(timeUntilClose / 60)
        const minutes = timeUntilClose % 60

        if (hours > 0) {
          setTimeUntilAction(`${hours}h ${minutes}m until closing`)
        } else {
          setTimeUntilAction(`${minutes}m until closing`)
        }
      } else {
        setStatus('closed')
        
        // Calculate time until opening
        let timeUntilOpen
        if (closeMinutes < openMinutes) {
          // Overnight hours
          timeUntilOpen = currentTimeMinutes >= closeMinutes 
            ? openMinutes + (24 * 60) - currentTimeMinutes
            : openMinutes - currentTimeMinutes
        } else {
          if (currentTimeMinutes < openMinutes) {
            timeUntilOpen = openMinutes - currentTimeMinutes
          } else {
            timeUntilOpen = (24 * 60) - currentTimeMinutes + openMinutes
          }
        }

        const hours = Math.floor(timeUntilOpen / 60)
        const minutes = timeUntilOpen % 60

        if (hours > 0) {
          setTimeUntilAction(`${hours}h ${minutes}m until opening`)
        } else {
          setTimeUntilAction(`${minutes}m until opening`)
        }
      }
    }

    updateTime()
    const interval = setInterval(updateTime, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [mall.openTime, mall.closeTime, mall.status])

  const getStatusColor = () => {
    switch (status) {
      case 'open':
        return 'text-green-400'
      case 'closed':
        return 'text-red-400'
      case 'coming_soon':
        return 'text-yellow-400'
      default:
        return darkMode ? 'text-gray-400' : 'text-gray-600'
    }
  }

  const getStatusIcon = () => {
    switch (status) {
      case 'open':
        return '🟢'
      case 'closed':
        return '🔴'
      case 'coming_soon':
        return '🟡'
      default:
        return '⚪'
    }
  }

  if (!mall) return null

  return (
    <div className={`${className}`}>
      <div className="bg-black/20 backdrop-blur-md border border-white/10 rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{getStatusIcon()}</span>
            <span className={`font-semibold ${getStatusColor()}`}>
              {status === 'open' && 'Open Now'}
              {status === 'closed' && 'Closed'}
              {status === 'coming_soon' && 'Coming Soon'}
            </span>
          </div>
          <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {mall.hours}
          </span>
        </div>
        
        {status !== 'coming_soon' && (
          <div className={`text-sm font-medium ${getStatusColor()}`}>
            {timeUntilAction}
          </div>
        )}
        
        <div className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Current time: {currentTime.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
          })}
        </div>
      </div>
    </div>
  )
}