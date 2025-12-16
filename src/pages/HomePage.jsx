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
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-purple-400/10 rounded-full blur-xl animate-float"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-purple-600/10 rounded-full blur-xl animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-40 left-1/4 w-40 h-40 bg-purple-300/10 rounded-full blur-xl animate-float" style={{animationDelay: '4s'}}></div>
        <div className="absolute top-1/2 right-10 w-28 h-28 bg-purple-500/10 rounded-full blur-xl animate-float" style={{animationDelay: '1s'}}></div>
      </div>

      {/* Hero Section */}
      <div className="relative z-10">
        <HeroSection />
      </div>

      {/* About Section */}
      <section id="about" className="relative z-10 section-padding max-w-7xl mx-auto">
        <div className="text-center max-w-4xl mx-auto mb-16 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-sm font-medium mb-6 animate-pulse-glow">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-ping"></div>
            {t('home.subtitle')}
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-6xl font-bold mb-6 sm:mb-8 leading-tight">
            <span className="bg-gradient-to-r from-purple-400 via-purple-600 to-purple-800 bg-clip-text text-transparent animate-gradient">
              {t('home.title')}
            </span>
          </h2>

          <div className="grid sm:grid-cols-2 gap-6 sm:gap-8 text-left max-w-4xl mx-auto">
            <div className="group animate-slide-in-left">
              <div className="p-6 rounded-2xl bg-white/50 dark:bg-gray-900/50 backdrop-blur-lg border border-purple-200/20 dark:border-purple-700/20 hover:bg-white/70 dark:hover:bg-gray-900/70 transition-all duration-500 transform hover:-translate-y-2 hover:shadow-purple-glow">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-400 to-purple-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <span className="text-white text-xl">🏪</span>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                  {t('home.discover')}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Comprehensive guide to the finest shopping destinations in historic Samarkand, from premium fashion to traditional crafts.
                </p>
              </div>
            </div>

            <div className="group animate-slide-in-right" style={{animationDelay: '0.2s'}}>
              <div className="p-6 rounded-2xl bg-white/50 dark:bg-gray-900/50 backdrop-blur-lg border border-purple-200/20 dark:border-purple-700/20 hover:bg-white/70 dark:hover:bg-gray-900/70 transition-all duration-500 transform hover:-translate-y-2 hover:shadow-purple-glow">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-400 to-purple-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <span className="text-white text-xl">✨</span>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                  {t('home.experiences')}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Discover vibrant retail landscape with dining, entertainment, and cultural experiences across all shopping centers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Malls Section */}
      <section id="malls" className="relative z-10 section-padding max-w-7xl mx-auto">
        <div className="text-center mb-16 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30 text-purple-700 dark:text-purple-300 text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
            {t('home.explore')}
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-purple-500 to-purple-700 bg-clip-text text-transparent">
              {t('home.subtitle')}
            </span>
          </h2>

          <p className={`text-xl max-w-3xl mx-auto leading-relaxed ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            From luxury shopping to traditional markets, discover Samarkand's premier destinations featuring over 1000+ stores across 10+ locations
          </p>
        </div>

        {/* Real-time Mall Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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

        {/* Real-time Stats */}
        <div className="mt-12 sm:mt-16 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 animate-fade-in-up" style={{animationDelay: '0.8s'}}>
          {[
            { label: t('home.activeMalls'), value: 6, icon: '🏢' },
            { label: t('home.totalStores'), value: 845, suffix: '+', icon: '🏪' },
            { label: t('home.comingSoon'), value: 4, icon: '🚧' },
            { label: t('home.happyVisitors'), value: 50, suffix: 'K+', icon: '😊' }
          ].map((stat, index) => (
            <div 
              key={index}
              className="group p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-white/60 dark:bg-gray-900/60 backdrop-blur-lg border border-purple-200/30 dark:border-purple-700/30 hover:bg-white/80 dark:hover:bg-gray-900/80 transition-all duration-500 transform hover:-translate-y-2 hover:shadow-3d text-center"
            >
              <div className="text-2xl sm:text-3xl mb-2 group-hover:scale-110 transition-transform">
                {stat.icon}
              </div>
              <div className="text-xl sm:text-2xl mb-1">
                <AnimatedCounter 
                  end={stat.value} 
                  suffix={stat.suffix || ''} 
                  duration={2000}
                  className="bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent"
                />
              </div>
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Next-Gen Discovery Sections */}
      <div className="relative z-10">
        <NextGenDiscoverySections />
      </div>

      {/* CTA Section */}
      <section className="relative z-10 py-20 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/90 via-purple-700/90 to-purple-800/90 backdrop-blur-sm"></div>
        <div className="relative max-w-7xl mx-auto text-center px-4">
          <div className="animate-fade-in-up">
            <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6">
              {t('home.virtual')}
            </h2>
            <p className="text-xl text-purple-100 mb-12 max-w-2xl mx-auto leading-relaxed">
              Experience the future of shopping with virtual tours, real-time updates, and interactive features
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
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

      {/* Contact Section */}
      <section id="contact" className="relative z-10 section-padding max-w-7xl mx-auto">
        <div className="text-center max-w-4xl mx-auto animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30 text-purple-700 dark:text-purple-300 text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
            Get in Touch
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 sm:mb-8">
            <span className="bg-gradient-to-r from-purple-500 to-purple-700 bg-clip-text text-transparent">
              {t('home.questions')}
            </span>
          </h2>

          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-8 sm:mb-12 leading-relaxed">
            {t('home.questionsDescription')}
          </p>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            {[
              { icon: '📞', title: 'Call Us', info: '+998 (99) 689-24-80', color: 'from-blue-400 to-blue-600' },
              { icon: '✉️', title: 'Email Us', info: 'info: roziyevnozim43@gmail.com', color: 'from-green-400 to-green-600' },
              { icon: '📍', title: 'Visit Us', info: 'Samarkand, Uzbekistan', color: 'from-purple-400 to-purple-600' }
            ].map((contact, index) => (
              <div 
                key={index}
                className="group p-6 sm:p-8 rounded-2xl bg-white/60 dark:bg-gray-900/60 backdrop-blur-lg border border-purple-200/30 dark:border-purple-700/30 hover:bg-white/80 dark:hover:bg-gray-900/80 transition-all duration-500 transform hover:-translate-y-3 hover:shadow-purple-glow-lg animate-bounce-in"
                style={{animationDelay: `${index * 0.2}s`}}
              >
                <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-r ${contact.color} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                  <span className="text-white text-xl sm:text-2xl">{contact.icon}</span>
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {contact.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 break-words">
                  {contact.info}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
