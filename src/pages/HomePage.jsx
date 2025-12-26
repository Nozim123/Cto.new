import { useState, useEffect } from 'react'
import { useTheme } from '../contexts/ThemeContext'
import { useLanguage } from '../contexts/LanguageContext'
import HeroSection from '../components/HeroSection'
import MallCard from '../components/MallCard'
import { SkeletonMallCard } from '../components/SkeletonCard'
import RecentlyViewedSection from '../components/RecentlyViewedSection'
import TrustSection from '../components/TrustSection'
import { Map, Building2, Store, Users, Phone, Mail, MapPin, Navigation, Sparkles } from 'lucide-react'
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
      const allMalls = mallsData.filter(mall => mall.status === 'open') // Show only open malls
      setMalls(allMalls)

      const timer2 = setTimeout(() => {
        // Show all open malls instead of just featured ones
        setFeaturedMalls(allMalls.slice(0, 6))
        setLoading(false)
      }, 400)

      return () => clearTimeout(timer2)
    }, 600)

    return () => clearTimeout(timer1)
  }, [])

  return (
    <div className="min-h-screen overflow-hidden pb-24 md:pb-0">
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
            <button
              className="py-4 px-4 bg-purple-600 text-white rounded-2xl hover:bg-purple-700 transition-colors font-semibold flex items-center justify-center gap-2 shadow-lg"
              onClick={() => window.location.href = '/map'}
            >
              <Map size={20} />
              {t('map.title')}
            </button>
            <button
              className="py-4 px-4 bg-purple-600 text-white rounded-2xl hover:bg-purple-700 transition-colors font-semibold flex items-center justify-center gap-2 shadow-lg"
              onClick={() => window.location.href = '/stores'}
            >
              <Store size={20} />
              {t('stores.title')}
            </button>
          </div>
        </div>
      </section>

      {/* About Section - Enhanced Mobile */}
      <section id="about" className="relative z-10 py-12 md:py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/20 text-purple-300 text-xs md:text-sm font-medium mb-4 md:mb-6 animate-pulse-glow">
              <Sparkles size={14} />
              {t('home.subtitle')}
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold mb-4 md:mb-6 leading-tight">
              <span className="bg-gradient-to-r from-purple-400 via-purple-600 to-purple-800 bg-clip-text text-transparent animate-gradient">
                {t('home.title')}
              </span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mt-8 md:mt-12">
              <div className="group animate-slide-in-left">
                <div className="p-5 md:p-6 rounded-xl md:rounded-2xl bg-white/10 backdrop-blur-lg border border-white/10 hover:bg-white/20 transition-all duration-500 transform hover:-translate-y-2 hover:shadow-purple-glow">
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-r from-purple-400 to-purple-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                    <Store className="text-white" size={24} />
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold mb-3 text-white">
                    {t('home.discover')}
                  </h3>
                  <p className="text-sm md:text-base text-gray-300 leading-relaxed">
                    Comprehensive guide to the finest shopping destinations in historic Samarkand, from premium fashion to traditional crafts.
                  </p>
                </div>
              </div>

              <div className="group animate-slide-in-right" style={{animationDelay: '0.2s'}}>
                <div className="p-5 md:p-6 rounded-xl md:rounded-2xl bg-white/10 backdrop-blur-lg border border-white/10 hover:bg-white/20 transition-all duration-500 transform hover:-translate-y-2 hover:shadow-purple-glow">
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-r from-purple-400 to-purple-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                    <Sparkles className="text-white" size={24} />
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold mb-3 text-white">
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

      <RecentlyViewedSection />

      {/* Featured Malls Section - Mobile Optimized */}
      <section id="malls" className="relative z-10 py-12 md:py-20">

          <div className="text-center mb-8 md:mb-16 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-500/20 to-purple-600/20 text-purple-300 text-xs md:text-sm font-medium mb-4 md:mb-6">
              <Building2 size={14} />
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
              { label: t('home.activeMalls'), value: malls.length, icon: Building2 },
              { label: t('home.totalStores'), value: malls.reduce((acc, m) => acc + (Number(m.storeCount) || 0), 0), suffix: '+', icon: Store },
              { label: t('home.comingSoon'), value: mallsData.filter((m) => m.status === 'coming_soon').length, icon: MapPin },
              { label: t('home.happyVisitors'), value: 50, suffix: 'K+', icon: Users }
            ].map((stat, index) => {
              const Icon = stat.icon
              return (
                <div
                  key={index}
                  className="p-4 md:p-6 rounded-xl bg-white/10 backdrop-blur-lg border border-white/10 text-center hover:bg-white/15 transition-all duration-300"
                >
                  <div className="flex items-center justify-center mb-3">
                    <Icon size={28} className="text-purple-400" />
                  </div>
                  <div className="text-lg md:text-2xl mb-1 text-purple-300 font-bold">
                    {stat.value}{stat.suffix || ''}
                  </div>
                  <div className="text-xs md:text-sm text-gray-400 font-medium">
                    {stat.label}
                  </div>
                </div>
              )
            })}
          </div>
      </section>

      <TrustSection />

      {/* CTA Section */}
      <section className="relative z-10 py-16 md:py-32">

        <div className="relative max-w-6xl mx-auto text-center px-4">
          <div className="animate-fade-in-up">
            <h2 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-white mb-4 md:mb-6">
              {t('home.virtual')}
            </h2>
            <p className="text-lg md:text-xl text-purple-100 mb-8 md:mb-12 max-w-2xl mx-auto leading-relaxed">
              Experience the future of shopping with virtual tours, real-time updates, and interactive features
            </p>

            <div className="flex flex-col sm:flex-row gap-3 md:gap-6 justify-center items-center">
              <button
                className="bg-white text-purple-700 px-8 py-4 rounded-2xl hover:bg-purple-50 transition-colors font-bold w-full sm:w-auto shadow-xl hover:shadow-2xl flex items-center justify-center gap-2"
              >
                {t('buttons.startVirtualTour')}
              </button>

              <button
                className="border-2 border-white/30 text-white px-8 py-4 rounded-2xl hover:bg-white/10 backdrop-blur-sm transition-colors font-bold w-full sm:w-auto shadow-xl flex items-center justify-center gap-2"
              >
                <MapPin size={20} />
                {t('buttons.liveMallStatus')}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section - Enhanced Mobile */}
      <section id="contact" className="relative z-10 py-12 md:py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-500/20 to-purple-600/20 text-purple-300 text-xs md:text-sm font-medium mb-4 md:mb-6">
              <Mail size={14} />
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
                { icon: Phone, title: 'Call Us', info: '+998 (99) 689-24-80', color: 'from-blue-400 to-blue-600' },
                { icon: Mail, title: 'Email Us', info: 'roziyevnozim43@gmail.com', color: 'from-emerald-400 to-emerald-600' },
                { icon: MapPin, title: 'Visit Us', info: 'Samarqand viloyat, Mikrarayon bozorchasi', color: 'from-purple-400 to-purple-600' }
              ].map((contact, index) => {
                const Icon = contact.icon
                return (
                  <div
                    key={index}
                    className="group p-5 md:p-8 rounded-xl md:rounded-2xl bg-white/10 backdrop-blur-lg border border-white/10 hover:bg-white/20 transition-all duration-500 transform hover:-translate-y-3 animate-bounce-in"
                    style={{animationDelay: `${index * 0.2}s`}}
                  >
                    <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-gradient-to-r ${contact.color} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                      <Icon className="text-white" size={24} />
                    </div>
                    <h3 className="text-sm md:text-lg font-semibold text-white mb-2">
                      {contact.title}
                    </h3>
                    <p className="text-xs md:text-sm text-gray-300 break-words">
                      {contact.info}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
