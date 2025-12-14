import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useTheme } from '../contexts/ThemeContext'
import mallsData from '../data/malls.json'
import storesData from '../data/stores.json'
import StoreCard from '../components/StoreCard'
import StoriesCarousel from '../components/StoriesCarousel'
import InteractiveFloorPlan from '../components/InteractiveFloorPlan'

export default function MallDetailsPage() {
  const { mallId } = useParams()
  const [mall, setMall] = useState(null)
  const [stores, setStores] = useState([])
  const [allStores, setAllStores] = useState([])
  const { darkMode } = useTheme()

  useEffect(() => {
    const mallData = mallsData.find((m) => m.id === mallId)
    setMall(mallData)

    if (mallData?.featured) {
      const mallStores = storesData.filter((s) => s.mallId === mallId)
      setAllStores(mallStores)
      setStores(mallStores.slice(0, 3))
    }
  }, [mallId])

  if (!mall) {
    return (
      <div className="section-padding text-center">
        <h1 className="heading-large mb-4">Mall Not Found</h1>
        <p className="text-gray-600 mb-6">The mall you're looking for doesn't exist or is not available yet.</p>
        <Link to="/" className="button-primary inline-block">
          Back to Home
        </Link>
      </div>
    )
  }

  if (mall.status === 'coming_soon') {
    return (
      <div className="section-padding max-w-6xl mx-auto">
        <Link to="/" className="text-gold hover:text-gold/80 transition-colors duration-300 mb-6 inline-block">
          ← Back to Home
        </Link>

        <div className="text-center py-12">
          <h1 className="heading-large mb-4">{mall.name}</h1>
          <p className="text-2xl text-gold font-bold mb-6">Coming Soon</p>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-8">
            We're working hard to bring this amazing shopping destination to life. Check back soon for updates!
          </p>
          <Link to="/" className="button-primary inline-block">
            Explore Other Malls
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Back Link */}
      <div className="max-w-6xl mx-auto px-4 lg:px-8 pt-6">
        <Link to="/" className="text-gold hover:text-gold/80 transition-colors duration-300 inline-flex items-center gap-1 hover:scale-105 transform duration-300">
          ← Back to Home
        </Link>
      </div>

      {/* Banner */}
      <div className="relative h-64 md:h-96 w-full overflow-hidden bg-gray-200 dark:bg-gray-700">
        <img
          src={mall.bannerImage}
          alt={mall.name}
          className="w-full h-full object-cover lazy"
          loading="lazy"
        />
      </div>

      {/* Quick Info Bar */}
      <div className={`transition-colors duration-300 ${
        darkMode ? 'bg-gray-800 text-cream' : 'bg-navy text-cream'
      }`}>
        <div className="max-w-6xl mx-auto px-4 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <p className="text-gold text-sm font-semibold mb-1">HOURS</p>
              <p className="text-lg">{mall.hours}</p>
            </div>
            <div>
              <p className="text-gold text-sm font-semibold mb-1">ADDRESS</p>
              <p className="text-lg">{mall.address}</p>
            </div>
            <div>
              <p className="text-gold text-sm font-semibold mb-1">OPENED</p>
              <p className="text-lg">{mall.openedDate}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stories Section */}
      {allStores.length > 0 && (
        <div className={`py-6 border-b ${
          darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
        }`}>
          <div className="max-w-6xl mx-auto">
            <h3 className={`px-4 lg:px-8 mb-4 font-display text-xl font-bold ${
              darkMode ? 'text-cream' : 'text-navy'
            }`}>
              Store Highlights ✨
            </h3>
            <StoriesCarousel stores={allStores} />
          </div>
        </div>
      )}

      {/* About Section */}
      <section className="section-padding max-w-6xl mx-auto">
        <div className="mb-12 fade-in-up">
          <h1 className="heading-medium mb-6">{mall.name}</h1>
          <p className={`text-lg mb-8 leading-relaxed max-w-3xl ${
            darkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            {mall.description}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12">
            {/* Text Content */}
            <div className="fade-in-up-delay-1">
              <h3 className="heading-small mb-4">About the Mall</h3>
              <p className={`mb-4 leading-relaxed ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                With over {mall.storeCount} carefully selected retailers, {mall.name} offers a world-class shopping experience. From international brands to local boutiques, fashion to electronics, dining to entertainment, we have something for everyone.
              </p>
              <p className={`mb-6 leading-relaxed ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Visit us today and experience the perfect blend of modern shopping comfort and Uzbek hospitality.
              </p>

              <div className={`p-6 rounded-lg ${
                darkMode ? 'bg-gray-800 glass-card-dark' : 'bg-cream glass-card'
              }`}>
                <h4 className={`font-semibold mb-3 ${
                  darkMode ? 'text-cream' : 'text-navy'
                }`}>Contact Information</h4>
                <p className={`mb-2 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  <span className="font-semibold">Phone:</span> {mall.phone}
                </p>
                <p className={`mb-2 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  <span className="font-semibold">Email:</span> {mall.phone}
                </p>
                <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                  <span className="font-semibold">Website:</span> {mall.website}
                </p>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className={`rounded-lg overflow-hidden h-96 card-shadow fade-in-up-delay-2 ${
              darkMode ? 'bg-gray-700' : 'bg-gray-200'
            }`}>
              <iframe
                title="Mall Location Map"
                className="w-full h-full"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3059.1826087346583!2d66.9796954!3d39.6546892!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3f4ea89c7c7c7c7d%3A0x7c7c7c7c7c7c7c7c!2sRegistan%2C%20Samarkand!5e0!3m2!1sen!2sus!4v1234567890123"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Floor Plan */}
      {allStores.length > 0 && (
        <section className="section-padding max-w-6xl mx-auto">
          <InteractiveFloorPlan stores={allStores} mallId={mallId} />
        </section>
      )}

      {/* Store Directory Preview */}
      {stores.length > 0 && (
        <section className={`section-padding max-w-6xl mx-auto rounded-lg ${
          darkMode ? 'bg-gray-800' : 'bg-cream'
        }`}>
          <div className="flex justify-between items-center mb-8 fade-in-up">
            <h2 className="heading-medium">Featured Stores</h2>
            <Link
              to={`/mall/${mallId}/stores`}
              className="text-gold hover:text-gold/80 font-semibold transition-all duration-300 hover:scale-105"
            >
              View All →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {stores.map((store, index) => (
              <div key={store.id} className={`fade-in-up-delay-${Math.min(index + 1, 3)}`}>
                <StoreCard store={store} mallId={mallId} />
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link
              to={`/mall/${mallId}/stores`}
              className="button-primary inline-block"
            >
              Explore All Stores
            </Link>
          </div>
        </section>
      )}
    </div>
  )
}
