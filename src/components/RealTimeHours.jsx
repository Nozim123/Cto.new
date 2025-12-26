import { useState, useEffect } from 'react'
import { useTheme } from '../contexts/ThemeContext'
import { Clock, Circle } from 'lucide-react'

export default function RealTimeHours({ mall }) {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [timeRemaining, setTimeRemaining] = useState('')
  const [status, setStatus] = useState('')
  const { darkMode } = useTheme()

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      setCurrentTime(now)

      if (mall) {
        const { openTime, closeTime } = mall
        const today = now.getDay()

        // Simple time parsing (assuming 24h format)
        const openHour = parseInt(openTime?.split(':')[0] || 10)
        const openMinute = parseInt(openTime?.split(':')[1] || 0)
        const closeHour = parseInt(closeTime?.split(':')[0] || 22)
        const closeMinute = parseInt(closeTime?.split(':')[1] || 0)

        const openTimeMinutes = openHour * 60 + openMinute
        const closeTimeMinutes = closeHour * 60 + closeMinute
        const currentTimeMinutes = now.getHours() * 60 + now.getMinutes()

        let mallStatus = 'closed'
        let remainingTime = ''

        if (currentTimeMinutes >= openTimeMinutes && currentTimeMinutes < closeTimeMinutes) {
          mallStatus = 'open'
          const minutesLeft = closeTimeMinutes - currentTimeMinutes
          const hoursLeft = Math.floor(minutesLeft / 60)
          const minsLeft = minutesLeft % 60

          if (hoursLeft > 0) {
            remainingTime = `${hoursLeft}h ${minsLeft}m until closing`
          } else {
            remainingTime = `${minsLeft}m until closing`
          }
        } else if (currentTimeMinutes < openTimeMinutes) {
          mallStatus = 'closed'
          const minutesUntilOpen = openTimeMinutes - currentTimeMinutes
          const hoursUntil = Math.floor(minutesUntilOpen / 60)
          const minsUntil = minutesUntilOpen % 60

          if (hoursUntil > 0) {
            remainingTime = `${hoursUntil}h ${minsUntil}m until opening`
          } else {
            remainingTime = `${minsUntil}m until opening`
          }
        }

        setStatus(mallStatus)
        setTimeRemaining(remainingTime)
      }
    }, 1000) // Update every second for real-time feel

    return () => clearInterval(timer)
  }, [mall])

  const getStatusColor = () => {
    switch (status) {
      case 'open':
        return 'text-emerald-500'
      case 'closed':
        return 'text-rose-500'
      default:
        return darkMode ? 'text-gray-400' : 'text-gray-600'
    }
  }

  const getStatusIconColor = () => {
    switch (status) {
      case 'open':
        return 'text-emerald-500'
      case 'closed':
        return 'text-rose-500'
      default:
        return 'text-gray-400'
    }
  }

  const getStatusText = () => {
    switch (status) {
      case 'open':
        return 'OPEN NOW'
      case 'closed':
        return 'CLOSED'
      default:
        return 'UNKNOWN'
    }
  }

  return (
    <div className={`rounded-xl p-4 transition-all duration-300 ${
      darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
    } shadow-lg`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-100 dark:bg-gray-700">
            {status === 'open' ? (
              <Clock size={20} className="text-emerald-500" />
            ) : (
              <Circle size={20} className={getStatusIconColor()} fill="currentColor" />
            )}
          </div>
          <div>
            <h3 className={`text-base md:text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {getStatusText()}
            </h3>
            <p className={`text-xs md:text-sm ${getStatusColor()}`}>
              {timeRemaining}
            </p>
          </div>
        </div>

        <div className="text-right">
          <div className={`text-xs md:text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Current Time
          </div>
          <div className={`text-sm md:text-lg font-mono ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {currentTime.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit'
            })}
          </div>
        </div>
      </div>

      {mall && (
        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-between text-sm">
            <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
              Today's Hours:
            </span>
            <span className={darkMode ? 'text-gray-200' : 'text-gray-800'}>
              {mall.hours || `${mall.openTime} - ${mall.closeTime}`}
            </span>
          </div>
        </div>
      )}

      {/* Progress bar for closing time */}
      {status === 'open' && mall && (
        <div className="mt-3">
          <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>
            Time until closing
          </div>
          <div className={`w-full h-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
            <div
              className="h-2 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full transition-all duration-1000"
              style={{
                width: timeRemaining ?
                  `${Math.max(0, 100 - (parseInt(timeRemaining) || 0) * 2)}%` : '100%'
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
