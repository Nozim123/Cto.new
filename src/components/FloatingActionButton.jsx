import { useState } from 'react'
import Button3D from './Button3D'

export default function FloatingActionButton() {
  const [isOpen, setIsOpen] = useState(false)

  const actions = [
    { icon: '💬', label: 'Chat Support', color: 'from-blue-500 to-blue-700' },
    { icon: '📍', label: 'Find Location', color: 'from-green-500 to-green-700' },
    { icon: '🎁', label: 'Special Offers', color: 'from-pink-500 to-pink-700' },
  ]

  return (
    <div className="fixed bottom-20 md:bottom-8 right-4 md:right-8 z-40">
      {/* Action items */}
      <div className={`flex flex-col-reverse gap-3 mb-3 transition-all duration-500 ${
        isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}>
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={() => {
              console.log(action.label)
              setIsOpen(false)
            }}
            className={`group flex items-center gap-3 bg-gradient-to-r ${action.color} text-white px-4 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105`}
            style={{
              animationDelay: `${index * 50}ms`,
            }}
          >
            <span className="text-xl">{action.icon}</span>
            <span className="font-semibold text-sm whitespace-nowrap">{action.label}</span>
          </button>
        ))}
      </div>

      {/* Main FAB */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full bg-gradient-to-r from-purple-500 to-purple-700 text-white shadow-lg hover:shadow-2xl transition-all duration-300 flex items-center justify-center text-2xl transform hover:scale-110 ${
          isOpen ? 'rotate-45' : 'rotate-0'
        }`}
        aria-label="Quick actions"
      >
        {isOpen ? '✕' : '✨'}
      </button>
    </div>
  )
}
