import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}

function getCurrentSeason() {
  const month = new Date().getMonth()
  
  if (month >= 2 && month <= 4) return 'spring'
  if (month >= 5 && month <= 7) return 'summer'
  if (month >= 8 && month <= 10) return 'autumn'
  return 'winter'
}

const colorPresets = {
  purple: {
    primary: '#8B5CF6',
    secondary: '#C4B5FD', 
    accent: '#A78BFA',
    gradient: 'from-purple-400 via-purple-500 to-purple-600'
  },
  blue: {
    primary: '#3B82F6',
    secondary: '#93C5FD',
    accent: '#60A5FA',
    gradient: 'from-blue-400 via-blue-500 to-blue-600'
  },
  green: {
    primary: '#10B981',
    secondary: '#6EE7B7',
    accent: '#34D399',
    gradient: 'from-green-400 via-green-500 to-green-600'
  },
  red: {
    primary: '#EF4444',
    secondary: '#FCA5A5',
    accent: '#F87171',
    gradient: 'from-red-400 via-red-500 to-red-600'
  },
  orange: {
    primary: '#F97316',
    secondary: '#FDBA74',
    accent: '#FB923C',
    gradient: 'from-orange-400 via-orange-500 to-orange-600'
  },
  pink: {
    primary: '#EC4899',
    secondary: '#F9A8D4',
    accent: '#F472B6',
    gradient: 'from-pink-400 via-pink-500 to-pink-600'
  }
}

export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode')
    return saved ? JSON.parse(saved) : false
  })

  const [seasonMode, setSeasonMode] = useState(() => localStorage.getItem('seasonMode') || 'auto')
  const [seasonOverride, setSeasonOverride] = useState(() => localStorage.getItem('seasonOverride') || getCurrentSeason())
  const [season, setSeason] = useState(() => {
    const mode = localStorage.getItem('seasonMode') || 'auto'
    const override = localStorage.getItem('seasonOverride') || getCurrentSeason()
    return mode === 'auto' ? getCurrentSeason() : override
  })

  const [accentColor, setAccentColor] = useState(() => {
    const saved = localStorage.getItem('accentColor')
    return saved || 'purple' // Default to purple instead of gold
  })

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode))
    
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  useEffect(() => {
    localStorage.setItem('accentColor', accentColor)
    
    // Update CSS custom properties for the accent color
    const root = document.documentElement
    const colors = colorPresets[accentColor]
    
    root.style.setProperty('--accent-primary', colors.primary)
    root.style.setProperty('--accent-secondary', colors.secondary)
    root.style.setProperty('--accent-accent', colors.accent)
    root.style.setProperty('--accent-gradient', colors.gradient)
  }, [accentColor])

  useEffect(() => {
    localStorage.setItem('seasonMode', seasonMode)
  }, [seasonMode])

  useEffect(() => {
    localStorage.setItem('seasonOverride', seasonOverride)
  }, [seasonOverride])

  useEffect(() => {
    if (seasonMode === 'auto') {
      setSeason(getCurrentSeason())
      const interval = window.setInterval(() => {
        setSeason(getCurrentSeason())
      }, 60 * 60 * 1000)
      return () => window.clearInterval(interval)
    }

    setSeason(seasonOverride)
  }, [seasonMode, seasonOverride])

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev)
  }

  const changeAccentColor = (color) => {
    setAccentColor(color)
  }

  const seasonalColors = {
    winter: {
      primary: colorPresets[accentColor].primary,
      secondary: colorPresets[accentColor].secondary,
      accent: colorPresets[accentColor].accent,
      gradient: `from-blue-100 via-blue-50 to-white`
    },
    spring: {
      primary: colorPresets[accentColor].primary,
      secondary: colorPresets[accentColor].secondary,
      accent: colorPresets[accentColor].accent,
      gradient: `from-green-100 via-pink-50 to-white`
    },
    summer: {
      primary: colorPresets[accentColor].primary,
      secondary: colorPresets[accentColor].secondary,
      accent: colorPresets[accentColor].accent,
      gradient: `from-yellow-100 via-orange-50 to-white`
    },
    autumn: {
      primary: colorPresets[accentColor].primary,
      secondary: colorPresets[accentColor].secondary,
      accent: colorPresets[accentColor].accent,
      gradient: `from-orange-100 via-red-50 to-white`
    }
  }

  const value = {
    darkMode,
    toggleDarkMode,
    season,
    seasonMode,
    seasonOverride,
    setSeasonMode,
    setSeasonOverride,
    accentColor,
    changeAccentColor,
    colorPresets,
    seasonalColors: seasonalColors[season]
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}