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

export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode')
    return saved ? JSON.parse(saved) : false
  })
  
  const [season, setSeason] = useState(getCurrentSeason())

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode))
    
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  useEffect(() => {
    setSeason(getCurrentSeason())
  }, [])

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev)
  }

  const seasonalColors = {
    winter: {
      primary: '#5CA4D8',
      secondary: '#E8F4F8',
      accent: '#A8D5E2',
      gradient: 'from-blue-100 via-blue-50 to-white'
    },
    spring: {
      primary: '#81C784',
      secondary: '#E8F5E9',
      accent: '#C8E6C9',
      gradient: 'from-green-100 via-pink-50 to-white'
    },
    summer: {
      primary: '#5CA4D8',
      secondary: '#E8F4F8',
      accent: '#A8D5E2',
      gradient: 'from-sky-100 via-cyan-50 to-white'
    },
    autumn: {
      primary: '#8FA89A',
      secondary: '#F4EFE7',
      accent: '#E8B4B8',
      gradient: 'from-emerald-50 via-rose-50 to-white'
    }
  }

  const value = {
    darkMode,
    toggleDarkMode,
    season,
    seasonalColors: seasonalColors[season]
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}
