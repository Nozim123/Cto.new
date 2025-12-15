import { useTheme } from '../contexts/ThemeContext'

export default function DarkModeToggle() {
  const { darkMode, toggleDarkMode } = useTheme()

  return (
    <button
      onClick={toggleDarkMode}
      className={`relative w-14 h-7 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 ${
        darkMode ? 'bg-slate-700' : 'bg-cyan-500'
      }`}
      aria-label="Toggle dark mode"
    >
      <span 
        className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white shadow-md 
                   transform transition-transform duration-300 flex items-center justify-center text-xs
                   ${darkMode ? 'translate-x-7' : 'translate-x-0'}`}
      >
        {darkMode ? '🌙' : '☀️'}
      </span>
    </button>
  )
}
