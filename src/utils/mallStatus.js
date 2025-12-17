/**
 * Utility functions for checking mall status in real-time
 * All times are in Uzbekistan timezone (UTC+5)
 */

/**
 * Get current time in Uzbekistan timezone
 * @returns {Date} Current date/time in Uzbekistan timezone
 */
export function getUzbekistanTime() {
  const now = new Date()
  // Convert to Uzbekistan timezone (UTC+5)
  const uzbekistanTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Tashkent' }))
  return uzbekistanTime
}

/**
 * Check if a mall is currently open based on Uzbekistan time
 * @param {object} mall - Mall object with openTime and closeTime properties
 * @returns {object} Status object with isOpen and message
 */
export function checkMallStatus(mall) {
  if (mall.status === 'coming_soon') {
    return {
      isOpen: false,
      status: 'coming_soon',
      message: 'Coming Soon'
    }
  }

  if (!mall.openTime || !mall.closeTime) {
    return {
      isOpen: true,
      status: 'unknown',
      message: 'Check Hours'
    }
  }

  const uzbekistanTime = getUzbekistanTime()
  const currentHour = uzbekistanTime.getHours()
  const currentMinute = uzbekistanTime.getMinutes()
  const currentTimeInMinutes = currentHour * 60 + currentMinute

  // Parse opening time
  const [openHour, openMinute] = mall.openTime.split(':').map(Number)
  const openTimeInMinutes = openHour * 60 + openMinute

  // Parse closing time (handle midnight crossing)
  const [closeHour, closeMinute] = mall.closeTime.split(':').map(Number)
  let closeTimeInMinutes = closeHour * 60 + closeMinute
  
  // If closing time is 24:00 or 00:00, treat it as end of day
  if (closeHour === 24 || (closeHour === 0 && mall.closeTime === '00:00')) {
    closeTimeInMinutes = 24 * 60
  }

  // Check if currently open
  const isOpen = currentTimeInMinutes >= openTimeInMinutes && currentTimeInMinutes < closeTimeInMinutes

  // Calculate time until opening/closing
  let message = ''
  if (isOpen) {
    const minutesUntilClose = closeTimeInMinutes - currentTimeInMinutes
    if (minutesUntilClose <= 60) {
      message = `Closes in ${minutesUntilClose} min`
    } else {
      const hoursUntilClose = Math.floor(minutesUntilClose / 60)
      message = `Open until ${mall.closeTime === '24:00' ? '12:00 AM' : formatTime(mall.closeTime)}`
    }
  } else {
    // Calculate time until opening
    let minutesUntilOpen
    if (currentTimeInMinutes < openTimeInMinutes) {
      minutesUntilOpen = openTimeInMinutes - currentTimeInMinutes
    } else {
      // Mall is closed and will open tomorrow
      minutesUntilOpen = (24 * 60 - currentTimeInMinutes) + openTimeInMinutes
    }
    
    if (minutesUntilOpen < 60) {
      message = `Opens in ${minutesUntilOpen} min`
    } else if (minutesUntilOpen < 24 * 60) {
      const hoursUntilOpen = Math.floor(minutesUntilOpen / 60)
      if (hoursUntilOpen < 12) {
        message = `Opens at ${formatTime(mall.openTime)}`
      } else {
        message = `Opens tomorrow at ${formatTime(mall.openTime)}`
      }
    }
  }

  return {
    isOpen,
    status: isOpen ? 'open' : 'closed',
    message: message || (isOpen ? 'Open Now' : 'Closed'),
    currentTime: uzbekistanTime,
    openTime: mall.openTime,
    closeTime: mall.closeTime
  }
}

/**
 * Format time string for display
 * @param {string} time - Time in HH:MM format
 * @returns {string} Formatted time string
 */
function formatTime(time) {
  const [hour, minute] = time.split(':').map(Number)
  
  if (hour === 24 || hour === 0) {
    return '12:00 AM'
  }
  
  if (hour < 12) {
    return `${hour}:${minute.toString().padStart(2, '0')} AM`
  } else if (hour === 12) {
    return `12:${minute.toString().padStart(2, '0')} PM`
  } else {
    return `${hour - 12}:${minute.toString().padStart(2, '0')} PM`
  }
}

/**
 * Get all malls with their real-time status
 * @param {array} malls - Array of mall objects
 * @returns {array} Malls with status information
 */
export function getMallsWithStatus(malls) {
  return malls.map(mall => ({
    ...mall,
    realTimeStatus: checkMallStatus(mall)
  }))
}

/**
 * Filter malls by open/closed status
 * @param {array} malls - Array of mall objects
 * @param {boolean} openOnly - Filter for open malls only
 * @returns {array} Filtered malls
 */
export function filterMallsByStatus(malls, openOnly = true) {
  return malls.filter(mall => {
    const status = checkMallStatus(mall)
    return openOnly ? status.isOpen : !status.isOpen
  })
}
