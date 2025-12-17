import { useState } from 'react'
import { useTheme } from '../contexts/ThemeContext'
import { useLanguage } from '../contexts/LanguageContext'

export default function ImmersiveContentSection() {
  const { darkMode } = useTheme()
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = useState('360')

  const tabs = [
    { id: '360', icon: '🌐', label: '360° Tour' },
    { id: 'video', icon: '🎥', label: 'Video' },
    { id: 'ar', icon: '📱', label: 'AR View' }
  ]

  return (
    <section id="immersive-content" className="relative z-10 py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-purple-600/20 text-purple-300 text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></span>
            {t('immersive.subtitle')}
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
              {t('immersive.title')}
            </span>
          </h2>

          <p className={`text-lg md:text-xl max-w-3xl mx-auto leading-relaxed ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            {t('immersive.description')}
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center gap-2 md:gap-4 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 md:px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-purple-500 to-purple-700 text-white shadow-lg shadow-purple-500/50 scale-105'
                  : darkMode
                  ? 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                  : 'bg-white/50 text-gray-700 hover:bg-white/70'
              }`}
            >
              <span className="text-xl md:text-2xl">{tab.icon}</span>
              <span className="hidden md:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className={`relative rounded-3xl overflow-hidden border-2 ${
          darkMode ? 'border-purple-500/30 bg-gray-900/50' : 'border-purple-200/50 bg-white/50'
        } backdrop-blur-xl shadow-2xl`}>
          {/* Placeholder Content */}
          <div className="aspect-video relative">
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-purple-800/30 to-purple-900/40">
              <div className="absolute inset-0 opacity-20">
                <div className="w-full h-full" style={{
                  backgroundImage: `
                    radial-gradient(circle at 1px 1px, rgba(139, 92, 246, 0.3) 1px, transparent 0),
                    linear-gradient(rgba(139, 92, 246, 0.1) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(139, 92, 246, 0.1) 1px, transparent 1px)
                  `,
                  backgroundSize: '20px 20px, 40px 40px, 40px 40px'
                }}></div>
              </div>
            </div>

            {/* Center Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
              <div className="text-center space-y-6">
                {/* Icon */}
                <div className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-r from-purple-500 to-purple-700 shadow-lg shadow-purple-500/50 animate-pulse-glow">
                  <span className="text-4xl md:text-5xl">
                    {tabs.find(tab => tab.id === activeTab)?.icon}
                  </span>
                </div>

                {/* Text */}
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                    {activeTab === '360' && t('immersive.360.title')}
                    {activeTab === 'video' && t('immersive.video.title')}
                    {activeTab === 'ar' && t('immersive.ar.title')}
                  </h3>
                  <p className="text-gray-300 text-sm md:text-base max-w-2xl mx-auto">
                    {activeTab === '360' && t('immersive.360.description')}
                    {activeTab === 'video' && t('immersive.video.description')}
                    {activeTab === 'ar' && t('immersive.ar.description')}
                  </p>
                </div>

                {/* Coming Soon Badge */}
                <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-gold/20 to-gold/10 border-2 border-gold/50 text-gold font-medium">
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {t('immersive.comingSoon')}
                </div>
              </div>
            </div>

            {/* Corner Decorations */}
            <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-2 rounded-lg bg-black/40 backdrop-blur-sm text-white text-sm">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
              <span>LIVE</span>
            </div>
          </div>

          {/* Feature Tags */}
          <div className="p-4 md:p-6 border-t border-purple-500/20">
            <div className="flex flex-wrap gap-2 md:gap-3 justify-center">
              {activeTab === '360' && (
                <>
                  <span className="px-3 py-1.5 rounded-full bg-purple-500/20 text-purple-300 text-xs md:text-sm">
                    🎯 Interactive Navigation
                  </span>
                  <span className="px-3 py-1.5 rounded-full bg-purple-500/20 text-purple-300 text-xs md:text-sm">
                    🖱️ Mouse/Touch Control
                  </span>
                  <span className="px-3 py-1.5 rounded-full bg-purple-500/20 text-purple-300 text-xs md:text-sm">
                    📍 Hotspot Information
                  </span>
                </>
              )}
              {activeTab === 'video' && (
                <>
                  <span className="px-3 py-1.5 rounded-full bg-purple-500/20 text-purple-300 text-xs md:text-sm">
                    🎬 HD Quality
                  </span>
                  <span className="px-3 py-1.5 rounded-full bg-purple-500/20 text-purple-300 text-xs md:text-sm">
                    🔊 Immersive Audio
                  </span>
                  <span className="px-3 py-1.5 rounded-full bg-purple-500/20 text-purple-300 text-xs md:text-sm">
                    ⏯️ Guided Tours
                  </span>
                </>
              )}
              {activeTab === 'ar' && (
                <>
                  <span className="px-3 py-1.5 rounded-full bg-purple-500/20 text-purple-300 text-xs md:text-sm">
                    📱 Mobile AR
                  </span>
                  <span className="px-3 py-1.5 rounded-full bg-purple-500/20 text-purple-300 text-xs md:text-sm">
                    🎯 Real-time Overlay
                  </span>
                  <span className="px-3 py-1.5 rounded-full bg-purple-500/20 text-purple-300 text-xs md:text-sm">
                    🗺️ Navigation Assist
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mt-8">
          {[
            {
              icon: '🎨',
              title: t('immersive.features.realistic'),
              description: t('immersive.features.realisticDesc')
            },
            {
              icon: '⚡',
              title: t('immersive.features.interactive'),
              description: t('immersive.features.interactiveDesc')
            },
            {
              icon: '🌟',
              title: t('immersive.features.accessible'),
              description: t('immersive.features.accessibleDesc')
            }
          ].map((feature, index) => (
            <div
              key={index}
              className={`p-6 rounded-2xl border transition-all duration-500 hover:-translate-y-2 ${
                darkMode
                  ? 'bg-gray-900/50 border-purple-500/20 hover:bg-gray-900/70'
                  : 'bg-white/50 border-purple-200/30 hover:bg-white/70'
              } backdrop-blur-xl animate-bounce-in`}
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="text-3xl md:text-4xl mb-4">{feature.icon}</div>
              <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {feature.title}
              </h3>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
