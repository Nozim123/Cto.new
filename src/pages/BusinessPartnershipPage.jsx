import { useState } from 'react'
import { Building2, Store, Handshake, Users, TrendingUp, Award, FileText, CheckCircle, Send, ChevronRight, Briefcase, DollarSign, MapPin } from 'lucide-react'

export default function BusinessPartnershipPage() {
  const [activeTab, setActiveTab] = useState('open-store')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    type: 'retail',
    message: ''
  })

  const partnershipTypes = [
    {
      icon: <Store size={40} />,
      title: 'Store Opening',
      description: 'Open your retail store in our premium malls',
      benefits: ['Prime locations', 'High foot traffic', 'Marketing support', 'Flexible lease terms']
    },
    {
      icon: <Briefcase size={40} />,
      title: 'Franchise Opportunities',
      description: 'Partner with established brands and expand your business',
      benefits: ['Brand recognition', 'Proven business model', 'Training & support', 'Shared resources']
    },
    {
      icon: <Handshake size={40} />,
      title: 'Strategic Partnerships',
      description: 'Collaborate on exclusive promotions and events',
      benefits: ['Cross-promotion', 'Co-marketing', 'Exclusive access', 'Joint ventures']
    },
    {
      icon: <Users size={40} />,
      title: 'Vendor Partnerships',
      description: 'Supply products to our mall retailers',
      benefits: ['Direct retailer access', 'Bulk orders', 'Long-term contracts', 'Priority placement']
    }
  ]

  const stats = [
    { icon: <Building2 />, label: 'Partner Malls', value: '6+' },
    { icon: <Store />, label: 'Partner Stores', value: '500+' },
    { icon: <Users />, label: 'Daily Visitors', value: '100K+' },
    { icon: <TrendingUp />, label: 'Growth Rate', value: '+25%' }
  ]

  const successStories = [
    {
      name: 'Luxury Fashion House',
      category: 'Fashion Retail',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop',
      story: 'Opened 3 stores across MTC malls, achieving 40% higher sales compared to other locations.',
      results: ['+40% sales', '3 locations', '2 years partnership']
    },
    {
      name: 'Tech Innovations',
      category: 'Electronics',
      image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=300&fit=crop',
      story: 'Partnered for exclusive product launches and in-store experiences, driving 3x customer engagement.',
      results: ['3x engagement', 'Exclusive launches', 'Award-winning']
    },
    {
      name: 'Gourmet Express',
      category: 'Food & Beverage',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop',
      story: 'Expanded from 1 to 5 locations within 18 months, becoming top food court destination.',
      results: ['5 locations', '#1 food court', '18 months']
    }
  ]

  const leaseTerms = [
    {
      plan: 'Standard Retail',
      size: '50-200 sqm',
      term: '3-5 years',
      rate: 'From $80/sqm/month',
      features: ['Standard utilities', 'Basic marketing', '24/7 security', 'Parking included']
    },
    {
      plan: 'Premium Flagship',
      size: '200-500 sqm',
      term: '5-10 years',
      rate: 'From $120/sqm/month',
      features: ['Premium location', 'Advanced marketing', 'Dedicated support', 'VIP parking', 'Custom fit-out']
    },
    {
      plan: 'Anchor Store',
      size: '500+ sqm',
      term: '10+ years',
      rate: 'Custom pricing',
      features: ['Prime positioning', 'Full marketing suite', 'On-site team', 'Exclusive rights', 'Revenue sharing']
    }
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Partnership application:', formData)
    alert('Thank you for your interest! Our team will contact you within 48 hours.')
  }

  return (
    <div className="min-h-screen bg-mtc-bg text-white pb-24">
      {/* Hero Section */}
      <div className="relative h-[50vh] w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/90 to-blue-900/90" />
        <img
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&h=1080&fit=crop"
          alt="Business Partnership"
          className="w-full h-full object-cover mix-blend-overlay"
        />
        
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4">
          <div className="mtc-badge mtc-badge-success mb-6">Business Opportunities</div>
          <h1 className="mtc-heading-xl mb-4">Partner With MTC</h1>
          <p className="mtc-body-lg max-w-2xl mb-8">
            Join our ecosystem of successful retailers and brands. Grow your business with prime locations and world-class support.
          </p>
          <div className="flex gap-4">
            <button className="mtc-button-primary">Apply Now</button>
            <button className="mtc-button-secondary">Download Brochure</button>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="mtc-container -mt-16 relative z-10 mb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <div key={index} className="mtc-glass p-6 rounded-3xl text-center">
              <div className="text-emerald-400 mb-2">{stat.icon}</div>
              <div className="text-3xl font-bold mb-1">{stat.value}</div>
              <div className="text-sm text-white/60">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="mtc-container">
        {/* Partnership Types */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="mtc-heading-md mb-4">Partnership Opportunities</h2>
            <p className="mtc-body text-white/60 max-w-2xl mx-auto">
              Choose the partnership model that best fits your business goals and growth strategy.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {partnershipTypes.map((type, index) => (
              <div key={index} className="mtc-glass p-6 rounded-3xl hover:bg-white/10 transition-all group">
                <div className="text-emerald-400 mb-4 group-hover:scale-110 transition-transform">
                  {type.icon}
                </div>
                <h3 className="font-semibold text-lg mb-2">{type.title}</h3>
                <p className="text-sm text-white/60 mb-4">{type.description}</p>
                <div className="space-y-2">
                  {type.benefits.map((benefit, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <CheckCircle size={14} className="text-emerald-400" />
                      {benefit}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Success Stories */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="mtc-heading-md">Success Stories</h2>
            <button className="text-emerald-400 text-sm font-medium hover:underline">View All</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {successStories.map((story, index) => (
              <div key={index} className="mtc-glass rounded-3xl overflow-hidden">
                <div className="relative aspect-[4/3]">
                  <img src={story.image} alt={story.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <Award className="text-yellow-400 mb-2" size={24} />
                    <h3 className="font-bold">{story.name}</h3>
                    <p className="text-sm text-white/60">{story.category}</p>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-sm text-white/70 mb-4">{story.story}</p>
                  <div className="flex flex-wrap gap-2">
                    {story.results.map((result, i) => (
                      <span key={i} className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-medium">
                        {result}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Application Form */}
        <section className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Form */}
            <div className="mtc-glass p-8 rounded-3xl">
              <h2 className="mtc-heading-md mb-6">Apply for Partnership</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm text-white/60 mb-2">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-emerald-500 transition-all"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-2">Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-emerald-500 transition-all"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-2">Phone *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-emerald-500 transition-all"
                    placeholder="+998 90 123 45 67"
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-2">Company Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.company}
                    onChange={(e) => setFormData({...formData, company: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-emerald-500 transition-all"
                    placeholder="Your company name"
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-2">Partnership Type *</label>
                  <select
                    required
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-emerald-500 transition-all"
                  >
                    <option value="retail">Store Opening</option>
                    <option value="franchise">Franchise</option>
                    <option value="strategic">Strategic Partnership</option>
                    <option value="vendor">Vendor Partnership</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-2">Tell us about your business</label>
                  <textarea
                    rows="4"
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-emerald-500 transition-all resize-none"
                    placeholder="Describe your business, products/services, and partnership goals..."
                  />
                </div>
                <button type="submit" className="mtc-button-primary w-full flex items-center justify-center gap-2">
                  <Send size={18} />
                  Submit Application
                </button>
              </form>
            </div>

            {/* Lease Terms */}
            <div>
              <h2 className="mtc-heading-md mb-6">Lease Terms & Plans</h2>
              <div className="space-y-4">
                {leaseTerms.map((plan, index) => (
                  <div key={index} className={`mtc-glass p-6 rounded-3xl ${index === 1 ? 'border-emerald-500/50' : ''}`}>
                    {index === 1 && (
                      <div className="mb-4">
                        <span className="px-3 py-1 rounded-full bg-emerald-500 text-sm font-medium">Most Popular</span>
                      </div>
                    )}
                    <h3 className="font-bold text-xl mb-2">{plan.plan}</h3>
                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                      <div>
                        <p className="text-white/40">Size Range</p>
                        <p className="font-medium">{plan.size}</p>
                      </div>
                      <div>
                        <p className="text-white/40">Lease Term</p>
                        <p className="font-medium">{plan.term}</p>
                      </div>
                    </div>
                    <div className="mb-4">
                      <p className="text-white/40 text-sm mb-1">Starting Rate</p>
                      <p className="text-2xl font-bold text-emerald-400">{plan.rate}</p>
                    </div>
                    <div className="space-y-2">
                      {plan.features.map((feature, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm">
                          <CheckCircle size={14} className="text-emerald-400" />
                          {feature}
                        </div>
                      ))}
                    </div>
                    <button className="mtc-button-secondary w-full mt-4">Request Quote</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Contact Information */}
        <section className="mtc-glass p-8 rounded-3xl">
          <div className="text-center mb-8">
            <h2 className="mtc-heading-md mb-4">Need More Information?</h2>
            <p className="mtc-body text-white/60">Our business development team is ready to help you explore partnership opportunities.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 rounded-2xl bg-white/5">
              <Phone className="text-emerald-400 mx-auto mb-3" size={32} />
              <h4 className="font-semibold mb-2">Call Us</h4>
              <p className="text-white/60 text-sm">Business Hotline</p>
              <p className="text-lg font-bold">+998 (66) 233-30-30</p>
            </div>
            <div className="text-center p-6 rounded-2xl bg-white/5">
              <Mail className="text-emerald-400 mx-auto mb-3" size={32} />
              <h4 className="font-semibold mb-2">Email Us</h4>
              <p className="text-white/60 text-sm">Business Inquiries</p>
              <p className="text-lg font-bold">partnership@mtc.uz</p>
            </div>
            <div className="text-center p-6 rounded-2xl bg-white/5">
              <MapPin className="text-emerald-400 mx-auto mb-3" size={32} />
              <h4 className="font-semibold mb-2">Visit Us</h4>
              <p className="text-white/60 text-sm">Headquarters</p>
              <p className="text-sm">Tashkent, Uzbekistan</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

function Phone({ ...props }) {
  return <Building2 {...props} />
}

function Mail({ ...props }) {
  return <FileText {...props} />
}
