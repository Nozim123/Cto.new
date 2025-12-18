import { useState, useEffect } from 'react'
import { useTheme } from '../contexts/ThemeContext'
import { useLanguage } from '../contexts/LanguageContext'
import HeroSection from '../components/HeroSection'
import MallCard from '../components/MallCard'
import { SkeletonMallCard } from '../components/SkeletonCard'
import SponsoredContentSection from '../components/SponsoredContentSection'
import RecentlyViewedSection from '../components/RecentlyViewedSection'
import TrustSection from '../components/TrustSection'
import mallsData from '../data/malls.json'

export default function HomePage() {
  const [malls, setMalls] = useState([])
  const [featuredMalls, setFeaturedMalls] = useState([])
  const [loading, setLoading] = useState(true)
  const { darkMode } = useTheme()
  const { t } = useLanguage()

  useEffect(() => {
    // Simulate real-time data loading with staggered effect
    const timer1 = setTimeout(() => {
      const allMalls = mallsData
      setMalls(allMalls)
      
      const timer2 = setTimeout(() => {
        setFeaturedMalls(allMalls.filter(mall => mall.featured).slice(0, 6))
        setLoading(false)
      }, 400)
      
      return () => clearTimeout(timer2)
    }, 600)
    
    return () => clearTimeout(timer1)
  }, [])

  return (
    <div className="min-h-screen overflow-hidden pb-20 md:pb-0">
      {/* Enhanced Mobile-First Hero Section */}
      <div className="relative z-10">
        <HeroSection />
      </div>

      {/* Quick Actions - Mobile Optimized */}
      <section className="relative z-10 px-4 py-8 md:hidden">
        <div className="max-w-md mx-auto">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 text-center">
            {t('home.explore')}
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <button 
              className="py-3 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
              onClick={() => window.location.href = '/map'}
            >
              <span className="mr-2">🗺️</span>
              {t('map.title')}
            </button>
            <button 
              className="py-3 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
              onClick={() => window.location.href = '/stores'}
            >
              <span className="mr-2">🏪</span>
              {t('stores.title')}
            </button>
          </div>
        </div>
      </section>

      {/* About Section - Enhanced Mobile */}
      <section id="about" className="relative z-10 py-12 md:py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300 text-xs md:text-sm font-medium mb-4 md:mb-6 animate-pulse-glow">
              <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-purple-500 dark:bg-purple-400 rounded-full animate-ping"></div>
              {t('home.subtitle')}
            </div>
            
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold mb-4 md:mb-6 leading-tight">
              <span className="bg-gradient-to-r from-purple-400 via-purple-600 to-purple-800 bg-clip-text text-transparent animate-gradient">
                {t('home.title')}
              </span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mt-8 md:mt-12">
              <div className="group animate-slide-in-left">
                <div className="p-4 md:p-6 rounded-xl md:rounded-2xl bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 shadow-sm dark:shadow-none hover:bg-gray-50 dark:hover:bg-white/20 backdrop-blur-lg transition-all duration-500 transform hover:-translate-y-2 hover:shadow-purple-glow">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-gradient-to-r from-purple-400 to-purple-600 flex items-center justify-center mb-3 md:mb-4 group-hover:scale-110 transition-transform">
                    <span className="text-white text-lg md:text-xl">🏪</span>
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-3 text-gray-900 dark:text-white">
                    {t('home.discover')}
                  </h3>
                  <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                    Comprehensive guide to the finest shopping destinations in historic Samarkand, from premium fashion to traditional crafts.
                  </p>
                </div>
              </div>

              <div className="group animate-slide-in-right" style={{animationDelay: '0.2s'}}>
                <div className="p-4 md:p-6 rounded-xl md:rounded-2xl bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 shadow-sm dark:shadow-none hover:bg-gray-50 dark:hover:bg-white/20 backdrop-blur-lg transition-all duration-500 transform hover:-translate-y-2 hover:shadow-purple-glow">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-gradient-to-r from-purple-400 to-purple-600 flex items-center justify-center mb-3 md:mb-4 group-hover:scale-110 transition-transform">
                    <span className="text-white text-lg md:text-xl">✨</span>
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-3 text-gray-900 dark:text-white">
                    {t('home.experiences')}
                  </h3>
                  <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                    Discover vibrant retail landscape with dining, entertainment, and cultural experiences across all shopping centers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SponsoredContentSection />
      <RecentlyViewedSection />

      {/* Featured Malls Section - Mobile Optimized */}
      <section id="malls" className="relative z-10 py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="text-center mb-8 md:mb-16 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-100 text-purple-700 dark:bg-gradient-to-r dark:from-purple-500/20 dark:to-purple-600/20 dark:text-purple-300 text-xs md:text-sm font-medium mb-4 md:mb-6">
              <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-purple-500 dark:bg-purple-400 rounded-full animate-pulse"></span>
              {t('home.explore')}
            </div>
            
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">
              <span className="bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
                {t('malls.featured')}
              </span>
            </h2>

            <p className={`text-base md:text-xl max-w-3xl mx-auto leading-relaxed ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              From luxury shopping to traditional markets, discover Samarkand's premier destinations featuring over 1000+ stores across 10+ locations
            </p>
          </div>

          {/* Mobile-optimized mall grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
            {loading
              ? [...Array(6)].map((_, i) => <SkeletonMallCard key={i} />)
              : featuredMalls.map((mall, index) => (
                  <div 
                    key={mall.id} 
                    className="animate-bounce-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <MallCard mall={mall} index={index} />
                  </div>
                ))}
          </div>

          {/* Enhanced Real-time Stats */}
          <div className="mt-8 md:mt-16 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
            {[
              { label: t('home.activeMalls'), value: mallsData.filter((m) => m.status === 'open').length, icon: '🏢' },
              { label: t('home.totalStores'), value: mallsData.filter((m) => m.status === 'open').reduce((acc, m) => acc + (Number(m.storeCount) || 0), 0), suffix: '+', icon: '🏪' },
              { label: t('home.comingSoon'), value: mallsData.filter((m) => m.status === 'coming_soon').length, icon: '🚧' },
              { label: t('home.happyVisitors'), value: 50, suffix: 'K+', icon: '😊' }
            ].map((stat, index) => (
              <div
                key={index}
                className="p-3 md:p-6 rounded-lg bg-white dark:bg-white/10 backdrop-blur-lg border border-gray-200 dark:border-white/10 shadow-sm dark:shadow-none text-center"
              >
                <div className="text-xl md:text-3xl mb-2">
                  {stat.icon}
                </div>
                <div className="text-lg md:text-2xl mb-1 text-purple-600 dark:text-purple-300">
                  {stat.value}{stat.suffix || ''}
                </div>
                <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <TrustSection />

      {/* CTA Section */}
      <section className="relative z-10 py-16 md:py-32">
        <div className="max-w-6xl mx-auto px-4">
          <div className="relative text-center rounded-3xl overflow-hidden border border-gray-200 dark:border-white/10 bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 p-8 md:p-14 shadow-xl">
            <div className="animate-fade-in-up">
              <h2 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-white mb-4 md:mb-6">
                {t('home.virtual')}
              </h2>
              <p className="text-lg md:text-xl text-white/85 mb-8 md:mb-12 max-w-2xl mx-auto leading-relaxed">
                Experience the future of shopping with virtual tours, real-time updates, and interactive features
              </p>

              <div className="flex flex-col sm:flex-row gap-3 md:gap-6 justify-center items-center">
                <button
                  className="bg-white text-purple-700 px-6 py-3 rounded-lg hover:bg-purple-50 transition-colors font-semibold w-full sm:w-auto"
                >
                  {t('buttons.startVirtualTour')}
                </button>

                <button
                  className="border-2 border-white/40 text-white px-6 py-3 rounded-lg hover:bg-white/10 backdrop-blur-sm transition-colors font-semibold w-full sm:w-auto"
                >
                  <span className="mr-2">📍</span>
                  {t('buttons.liveMallStatus')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section - Enhanced Mobile */}
      <section id="contact" className="relative z-10 py-12 md:py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-100 text-purple-700 dark:bg-gradient-to-r dark:from-purple-500/20 dark:to-purple-600/20 dark:text-purple-300 text-xs md:text-sm font-medium mb-4 md:mb-6">
              <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-purple-500 dark:bg-purple-400 rounded-full animate-pulse"></span>
              Get in Touch
            </div>
            
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">
              <span className="bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
                {t('home.questions')}
              </span>
            </h2>

            <p className="text-sm md:text-lg text-gray-600 dark:text-gray-300 mb-6 md:mb-12 leading-relaxed">
              {t('home.questionsDescription')}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
              {[
                { icon: '📞', title: 'Call Us', info: '+998 (66) 233-30-30', color: 'from-blue-400 to-blue-600' },
                { icon: '✉️', title: 'Email Us', info: 'info@megatravelcenter.com', color: 'from-green-400 to-green-600' },
                { icon: '📍', title: 'Visit Us', info: 'Mirzo Ulugbek Street 1, Samarkand 140100', color: 'from-purple-400 to-purple-600' }
              ].map((contact, index) => (
                <div 
                  key={index}
                  className="group p-4 md:p-8 rounded-xl md:rounded-2xl bg-white dark:bg-white/10 backdrop-blur-lg border border-gray-200 dark:border-white/10 shadow-sm dark:shadow-none hover:bg-gray-50 dark:hover:bg-white/20 transition-all duration-500 transform hover:-translate-y-3 animate-bounce-in"
                  style={{animationDelay: `${index * 0.2}s`}}
                >
                  <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-gradient-to-r ${contact.color} flex items-center justify-center mx-auto mb-3 md:mb-4 group-hover:scale-110 transition-transform`}>
                    <span className="text-white text-lg md:text-xl">{contact.icon}</span>
                  </div>
                  <h3 className="text-sm md:text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {contact.title}
                  </h3>
                  <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300 break-words">
                    {contact.info}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
