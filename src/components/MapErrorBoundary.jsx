import { useTheme } from '../contexts/ThemeContext'

export default function MapErrorBoundary({ children }) {
  const { darkMode } = useTheme()
  
  const hasApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY && 
    import.meta.env.VITE_GOOGLE_MAPS_API_KEY !== 'your_google_maps_api_key_here'

  if (!hasApiKey) {
    return (
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-gray-50'} border border-dashed border-gray-300 rounded-lg p-8 text-center`}>
        <div className="text-6xl mb-4">🗺️</div>
        <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Interactive Map Setup Required
        </h3>
        <p className={`text-sm mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          To enable interactive maps with turn-by-turn directions, you need to:
        </p>
        <ol className={`text-sm text-left max-w-md mx-auto space-y-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          <li>1. Get a Google Maps API key from Google Cloud Console</li>
          <li>2. Enable Maps JavaScript API and Places API</li>
          <li>3. Add the key to your environment variables</li>
        </ol>
        <div className={`mt-4 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          File: .env (VITE_GOOGLE_MAPS_API_KEY=your_key_here)
        </div>
      </div>
    )
  }

  return children
}