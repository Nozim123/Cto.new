import { useState, useEffect } from 'react'
import { useTheme } from '../contexts/ThemeContext'
import { useLanguage } from '../contexts/LanguageContext'
import HeroSection from '../components/HeroSection'
import MallCard from '../components/MallCard'
import NextGenDiscoverySections from '../components/NextGenDiscoverySections'
import { SkeletonMallCard } from '../components/SkeletonCard'
import AnimatedCounter from '../components/AnimatedCounter'
import Button3D from '../components/Button3D'
import { useScrollReveal } from '../hooks/useScrollReveal'
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
          <h3 className="text-lg font-bold text-white mb-4 text-center">
            {t('home.explore')}
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <Button3D 
              variant="primary" 
              className="py-3 text-sm"
              onClick={() => window.location.href = '/map'}
            >
              <span className="mr-2">🗺️</span>
              {t('map.title')}
            </Button3D>
            <Button3D 
              variant="secondary" 
              className="py-3 text-sm"
              onClick={() => window.location.href = '/stores'}
            >
              <span className="mr-2">🏪</span>
              {t('stores.title')}
            </Button3D>
          </div>
        </div>
      </section>

      {/* About Section - Enhanced Mobile */}
      <section id="about" className="relative z-10 py-12 md:py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/20 text-purple-300 text-xs md:text-sm font-medium mb-4 md:mb-6 animate-pulse-glow">
              <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-purple-400 rounded-full animate-ping"></div>
              {t('home.subtitle')}
            </div>
            
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold mb-4 md:mb-6 leading-tight">
              <span className="bg-gradient-to-r from-purple-400 via-purple-600 to-purple-800 bg-clip-text text-transparent animate-gradient">
                {t('home.title')}
              </span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mt-8 md:mt-12">
              <div className="group animate-slide-in-left">
                <div className="p-4 md:p-6 rounded-xl md:rounded-2xl bg-white/10 backdrop-blur-lg border border-white/10 hover:bg-white/20 transition-all duration-500 transform hover:-translate-y-2 hover:shadow-purple-glow">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-gradient-to-r from-purple-400 to-purple-600 flex items-center justify-center mb-3 md:mb-4 group-hover:scale-110 transition-transform">
                    <span className="text-white text-lg md:text-xl">🏪</span>
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-3 text-white">
                    {t('home.discover')}
                  </h3>
                  <p className="text-sm md:text-base text-gray-300 leading-relaxed">
                    Comprehensive guide to the finest shopping destinations in historic Samarkand, from premium fashion to traditional crafts.
                  </p>
                </div>
              </div>

              <div className="group animate-slide-in-right" style={{animationDelay: '0.2s'}}>
                <div className="p-4 md:p-6 rounded-xl md:rounded-2xl bg-white/10 backdrop-blur-lg border border-white/10 hover:bg-white/20 transition-all duration-500 transform hover:-translate-y-2 hover:shadow-purple-glow">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-gradient-to-r from-purple-400 to-purple-600 flex items-center justify-center mb-3 md:mb-4 group-hover:scale-110 transition-transform">
                    <span className="text-white text-lg md:text-xl">✨</span>
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-3 text-white">
                    {t('home.experiences')}
                  </h3>
                  <p className="text-sm md:text-base text-gray-300 leading-relaxed">
                    Discover vibrant retail landscape with dining, entertainment, and cultural experiences across all shopping centers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Malls Section - Mobile Optimized */}
      <section id="malls" className="relative z-10 py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8 md:mb-16 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-500/20 to-purple-600/20 text-purple-300 text-xs md:text-sm font-medium mb-4 md:mb-6">
              <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-purple-400 rounded-full animate-pulse"></span>
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
          <div className="mt-8 md:mt-16 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 animate-fade-in-up" style={{animationDelay: '0.8s'}}>
            {[
              { label: t('home.activeMalls'), value: mallsData.filter((m) => m.status === 'open').length, icon: '🏢' },
              { label: t('home.totalStores'), value: mallsData.filter((m) => m.status === 'open').reduce((acc, m) => acc + (Number(m.storeCount) || 0), 0), suffix: '+', icon: '🏪' },
              { label: t('home.comingSoon'), value: mallsData.filter((m) => m.status === 'coming_soon').length, icon: '🚧' },
              { label: t('home.happyVisitors'), value: 50, suffix: 'K+', icon: '😊' }
            ].map((stat, index) => (
              <div
                key={index}
                className="group p-3 md:p-6 rounded-lg md:rounded-2xl bg-white/10 backdrop-blur-lg border border-white/10 hover:bg-white/20 transition-all duration-500 transform hover:-translate-y-2 text-center"
              >
                <div className="text-xl md:text-3xl mb-2 group-hover:scale-110 transition-transform">
                  {stat.icon}
                </div>
                <div className="text-lg md:text-2xl mb-1">
                  <AnimatedCounter 
                    end={stat.value} 
                    suffix={stat.suffix || ''} 
                    duration={2000}
                    className="bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent"
                  />
                </div>
                <div className="text-xs md:text-sm text-gray-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Next-Gen Discovery Sections */}
      <div className="relative z-10">
        <NextGenDiscoverySections />
      </div>

      {/* Enhanced CTA Section */}
      <section className="relative z-10 py-16 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/90 via-purple-700/90 to-purple-800/90 backdrop-blur-sm"></div>
        <div className="relative max-w-6xl mx-auto text-center px-4">
          <div className="animate-fade-in-up">
            <h2 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-white mb-4 md:mb-6">
              {t('home.virtual')}
            </h2>
            <p className="text-lg md:text-xl text-purple-100 mb-8 md:mb-12 max-w-2xl mx-auto leading-relaxed">
              Experience the future of shopping with virtual tours, real-time updates, and interactive features
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 md:gap-6 justify-center items-center">
              <Button3D 
                variant="ghost" 
                size="lg"
                className="!bg-white !text-purple-700 hover:!bg-purple-50 w-full sm:w-auto"
              >
                {t('buttons.startVirtualTour')}
              </Button3D>
              
              <Button3D 
                variant="outline" 
                size="lg"
                className="!border-2 !border-white/30 !text-white hover:!bg-white/10 !backdrop-blur-sm w-full sm:w-auto"
              >
                <span className="mr-2">📍</span>
                {t('buttons.liveMallStatus')}
              </Button3D>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section - Enhanced Mobile */}
      <section id="contact" className="relative z-10 py-12 md:py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-500/20 to-purple-600/20 text-purple-300 text-xs md:text-sm font-medium mb-4 md:mb-6">
              <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-purple-400 rounded-full animate-pulse"></span>
              Get in Touch
            </div>
            
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">
              <span className="bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
                {t('home.questions')}
              </span>
            </h2>

            <p className="text-sm md:text-lg text-gray-300 mb-6 md:mb-12 leading-relaxed">
              {t('home.questionsDescription')}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
              {[
                { icon: '📞', title: 'Call Us', info: '+998 (99) 689-24-80', color: 'from-blue-400 to-blue-600' },
                { icon: '✉️', title: 'Email Us', info: 'roziyevnozim43@gmail.com', color: 'from-green-400 to-green-600' },
                { icon: '📍', title: 'Visit Us', info: 'Samarkand Mikrarayon bozorchasi', color: 'from-purple-400 to-purple-600' }
              ].map((contact, index) => (
                <div 
                  key={index}
                  className="group p-4 md:p-8 rounded-xl md:rounded-2xl bg-white/10 backdrop-blur-lg border border-white/10 hover:bg-white/20 transition-all duration-500 transform hover:-translate-y-3 animate-bounce-in"
                  style={{animationDelay: `${index * 0.2}s`}}
                >
                  <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-gradient-to-r ${contact.color} flex items-center justify-center mx-auto mb-3 md:mb-4 group-hover:scale-110 transition-transform`}>
                    <span className="text-white text-lg md:text-xl">{contact.icon}</span>
                  </div>
                  <h3 className="text-sm md:text-lg font-semibold text-white mb-2">
                    {contact.title}
                  </h3>
                  <p className="text-xs md:text-sm text-gray-300 break-words">
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
