import { useLanguage } from '../contexts/LanguageContext'
import { useTheme } from '../contexts/ThemeContext'

const labels = {
  uz: 'UZ',
  ru: 'RU',
  en: 'EN'
}

export default function LanguageSwitcher({ className = '' }) {
  const { language, setLanguage, available } = useLanguage()
  const { darkMode } = useTheme()

  return (
    <div className={`inline-flex items-center ${className}`}>
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        className={`text-sm font-semibold rounded-lg px-3 py-2 border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gold ${
          darkMode
            ? 'bg-gray-800 border-gray-700 text-cream'
            : 'bg-white border-gray-200 text-navy'
        }`}
        aria-label="Language"
      >
        {available.map((l) => (
          <option key={l} value={l}>
            {labels[l] || l.toUpperCase()}
          </option>
        ))}
      </select>
    </div>
  )
}
