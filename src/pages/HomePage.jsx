import { useState, useEffect } from 'react'
import HeroSection from '../components/HeroSection'
import MallCard from '../components/MallCard'
import mallsData from '../data/malls.json'

export default function HomePage() {
  const [malls, setMalls] = useState([])

  useEffect(() => {
    setMalls(mallsData)
  }, [])

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection />

      {/* Malls Section */}
      <section id="malls" className="section-padding max-w-6xl mx-auto">
        <div className="mb-12">
          <h2 className="heading-medium mb-4 text-center">
            Featured Shopping Destinations
          </h2>
          <p className="text-center text-gray-600 text-lg max-w-2xl mx-auto">
            From premium fashion to electronics, find everything you need in Samarkand's premier shopping centers
          </p>
        </div>

        {/* Malls Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {malls.map((mall) => (
            <MallCard key={mall.id} mall={mall} />
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-navy text-cream py-12 lg:py-20">
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
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="heading-medium mb-6">Get in Touch</h2>
          <p className="text-gray-600 mb-6">
            Have questions about our shopping centers? We're here to help!
          </p>
          <div className="space-y-2 text-gray-700">
            <p>📞 +998 (66) 233-30-30</p>
            <p>✉️ info@samarkandmall.uz</p>
            <p>📍 Samarkand, Uzbekistan</p>
          </div>
        </div>
      </section>
    </div>
  )
}
