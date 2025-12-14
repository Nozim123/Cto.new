import { useState, useEffect } from 'react'
import { useTheme } from '../contexts/ThemeContext'
import HeroSection from '../components/HeroSection'
import MallCard from '../components/MallCard'
import { SkeletonMallCard } from '../components/SkeletonCard'
import mallsData from '../data/malls.json'

export default function HomePage() {
  const [malls, setMalls] = useState([])
  const [loading, setLoading] = useState(true)
  const { darkMode } = useTheme()

  useEffect(() => {
    setTimeout(() => {
      setMalls(mallsData)
      setLoading(false)
    }, 800)
  }, [])

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection />

      {/* About Section */}
      <section id="about" className="section-padding max-w-6xl mx-auto fade-in-up">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="heading-medium mb-6">About Samarkand Mall Directory</h2>
          <p className={`text-lg mb-4 leading-relaxed ${
            darkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Welcome to Samarkand Mall Directory, your comprehensive guide to the finest shopping destinations in the historic city of Samarkand. We connect shoppers with premium malls, diverse stores, and exclusive brands across the city.
          </p>
          <p className={`text-lg leading-relaxed ${
            darkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Whether you're looking for fashion, electronics, dining, or entertainment, our platform makes it easy to discover and explore Samarkand's vibrant retail landscape. Start your shopping journey today and experience the best that Samarkand has to offer.
          </p>
        </div>
      </section>

      {/* Malls Section */}
      <section id="malls" className="section-padding max-w-6xl mx-auto">
        <div className="mb-12 fade-in-up">
          <h2 className="heading-medium mb-4 text-center">
            Featured Shopping Destinations
          </h2>
          <p className={`text-center text-lg max-w-2xl mx-auto ${
            darkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            From premium fashion to electronics, find everything you need in Samarkand's premier shopping centers
          </p>
        </div>

        {/* Malls Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            <>
              {[...Array(6)].map((_, i) => (
                <SkeletonMallCard key={i} />
              ))}
            </>
          ) : (
            malls.map((mall, index) => (
              <MallCard key={mall.id} mall={mall} index={index} />
            ))
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className={`py-12 lg:py-20 transition-colors duration-300 ${
        darkMode ? 'bg-gray-800' : 'bg-navy'
      }`}>
        <div className="max-w-6xl mx-auto px-4 lg:px-8 text-center">
          <h2 className="heading-medium text-cream mb-4">
            Ready to Explore?
          </h2>
          <p className="text-cream text-opacity-80 mb-8 text-lg">
            Visit Family Park Mall to discover amazing brands and exclusive offers
          </p>
          <a
            href="#malls"
            className="button-primary inline-block"
          >
            View All Malls
          </a>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="section-padding max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto fade-in-up">
          <h2 className="heading-medium mb-6">Get in Touch</h2>
          <p className={`mb-6 ${
            darkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Have questions about our shopping centers? We're here to help!
          </p>
          <div className={`space-y-2 ${
            darkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            <p>📞 +998 (66) 233-30-30</p>
            <p>✉️ info@samarkandmall.uz</p>
            <p>📍 Samarkand, Uzbekistan</p>
          </div>
        </div>
      </section>
    </div>
  )
}
