import { useTheme } from '../contexts/ThemeContext'

export default function LoadingScreen() {
  const { darkMode } = useTheme()

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${
      darkMode ? 'bg-gray-900' : 'bg-cream'
    }`}>
      <div className="text-center">
        {/* Animated logo/brand */}
        <div className="relative mb-8">
          <div className="text-6xl font-display font-bold bg-gradient-to-r from-purple-400 via-purple-600 to-purple-800 bg-clip-text text-transparent animate-gradient">
            MTC
          </div>
          <div className="mt-2 text-sm font-semibold text-purple-600 dark:text-purple-400 opacity-70">
            Mega Travel Center
          </div>
        </div>

        {/* Loading animation */}
        <div className="flex gap-2 justify-center mb-4">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-500 to-purple-700"
              style={{
                animation: `pulse 1.5s ease-in-out infinite`,
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </div>

        {/* Loading text */}
        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Loading premium experience...
        </p>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.5);
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  )
}
