import { useTheme } from '../contexts/ThemeContext'
import { useLanguage } from '../contexts/LanguageContext'
import { usePublicData } from '../contexts/PublicDataContext'
import HeroSection from '../components/HeroSection'
import MallCard from '../components/MallCard'
import NextGenDiscoverySections from '../components/NextGenDiscoverySections'
import { SkeletonMallCard } from '../components/SkeletonCard'

export default function HomePage() {
  const { malls, loading } = usePublicData()
  const { darkMode } = useTheme()
  const { t } = useLanguage()


  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection />

      {/* About Section */}
      <section id="about" className="section-padding max-w-6xl mx-auto fade-in-up">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="heading-medium mb-6">
            {t('home.aboutTitle')}
          </h2>

          <p
            className={`text-lg mb-4 leading-relaxed ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}
          >
            {t('home.aboutP1')}
          </p>

          <p
            className={`text-lg leading-relaxed ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}
          >
            {t('home.aboutP2')}
          </p>
        </div>
      </section>

      {/* Malls Section */}
      <section id="malls" className="section-padding max-w-6xl mx-auto">
        <div className="mb-12 fade-in-up">
          <h2 className="heading-medium mb-4 text-center">
            {t('home.featuredTitle')}
          </h2>

          <p
            className={`text-center text-lg max-w-2xl mx-auto ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}
          >
            {t('home.featuredSubtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading
            ? [...Array(6)].map((_, i) => <SkeletonMallCard key={i} />)
            : malls.map((mall, index) => (
                <MallCard key={mall.id} mall={mall} index={index} />
              ))}
        </div>
      </section>

      {/* Next-Gen Discovery Sections */}
      <NextGenDiscoverySections />

      {/* CTA Section */}
      <section
        className={`py-12 lg:py-20 transition-colors duration-300 ${
          darkMode ? 'bg-gray-800' : 'bg-navy'
        }`}
      >
        <div className="max-w-6xl mx-auto text-center px-4">
          <h2 className="heading-medium text-cream mb-4">
            {t('home.ctaTitle')}
          </h2>

          <p className="text-cream text-opacity-80 mb-8 text-lg">
            {t('home.ctaSubtitle')}
          </p>

          <a href="#malls" className="button-primary inline-block">
            {t('home.viewAll')}
          </a>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="section-padding max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto fade-in-up">
          <h2 className="heading-medium mb-6">{t('home.contactTitle')}</h2>

          <p
            className={`mb-6 ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}
          >
            {t('home.contactSubtitle')}
          </p>

          <div
            className={`space-y-2 ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}
          >
            <p>📞 +998 (99) 689-24-80</p>
            <p>✉️ info:roziyevnozim43@gmail.com</p>
            <p>📍 Samarkand, Uzbekistan</p>
          </div>
        </div>
      </section>
    </div>
  )
}
