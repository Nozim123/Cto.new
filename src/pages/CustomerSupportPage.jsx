import { useState } from 'react'
import { MessageCircle, Send, FileText, Clock, Phone, Mail, ChevronRight, CheckCircle, XCircle, MessageSquare, Bot, Zap, Headphones } from 'lucide-react'

export default function CustomerSupportPage() {
  const [activeTab, setActiveTab] = useState('live-chat')
  const [chatMessages, setChatMessages] = useState([
    { id: 1, type: 'bot', text: 'Hello! Welcome to MTC Customer Support. How can I help you today?', time: '10:30 AM' }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('general')

  const faqs = [
    {
      category: 'Order & Delivery',
      questions: [
        { q: 'How can I track my order?', a: 'Go to Orders page in your profile, find your order and click Track to see real-time status.' },
        { q: 'What are the delivery options?', a: 'We offer standard delivery (3-5 business days), express delivery (1-2 days), and same-day delivery in select areas.' },
        { q: 'Can I change my delivery address?', a: 'You can change the address before the order is shipped. Contact support immediately for changes.' }
      ]
    },
    {
      category: 'Returns & Refunds',
      questions: [
        { q: 'What is the return policy?', a: 'Most items can be returned within 30 days of purchase. Items must be unused and in original packaging.' },
        { q: 'How do I request a refund?', a: 'Go to Returns page, select the order, choose items to return, and follow the instructions.' },
        { q: 'How long do refunds take?', a: 'Refunds are processed within 5-7 business days after we receive the returned item.' }
      ]
    },
    {
      category: 'Loyalty Program',
      questions: [
        { q: 'How do I earn points?', a: 'Earn 1 point for every $1 spent. Bonus points for special promotions and events.' },
        { q: 'What are the membership tiers?', a: 'Bronze (0-999 pts), Silver (1000-2499 pts), Gold (2500-4999 pts), VIP (5000+ pts).' },
        { q: 'How do I redeem points?', a: 'Points can be redeemed at checkout for discounts or in the Rewards page for special offers.' }
      ]
    },
    {
      category: 'Payments',
      questions: [
        { q: 'What payment methods are accepted?', a: 'We accept credit/debit cards, PayPal, Apple Pay, Google Pay, and MTC Gift Cards.' },
        { q: 'Is my payment information secure?', a: 'Yes, we use industry-standard encryption and comply with PCI DSS security standards.' },
        { q: 'Can I use multiple payment methods?', a: 'Yes, you can split payment between a gift card and another payment method.' }
      ]
    }
  ]

  const quickActions = [
    { icon: <FileText size={20} />, label: 'Track Order', action: 'track' },
    { icon: <Clock size={20} />, label: 'Return Item', action: 'return' },
    { icon: <Zap size={20} />, label: 'Report Issue', action: 'report' },
    { icon: <MessageSquare size={20} />, label: 'Payment Help', action: 'payment' }
  ]

  const supportChannels = [
    {
      icon: <MessageCircle size={32} />,
      title: 'Live Chat',
      description: 'Chat with our support team in real-time',
      status: 'online',
      responseTime: '< 2 min'
    },
    {
      icon: <Bot size={32} />,
      title: 'Telegram Bot',
      description: 'Get instant answers 24/7',
      status: 'online',
      responseTime: 'Instant'
    },
    {
      icon: <Phone size={32} />,
      title: 'Phone Support',
      description: 'Call us directly for urgent issues',
      status: 'available',
      responseTime: '9 AM - 9 PM'
    },
    {
      icon: <Mail size={32} />,
      title: 'Email Support',
      description: 'Send us a detailed message',
      status: 'available',
      responseTime: '< 24 hours'
    }
  ]

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return
    
    const newMessage = {
      id: chatMessages.length + 1,
      type: 'user',
      text: inputMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
    
    setChatMessages([...chatMessages, newMessage])
    setInputMessage('')
    
    // Simulate bot response
    setTimeout(() => {
      const botResponse = {
        id: chatMessages.length + 2,
        type: 'bot',
        text: 'Thank you for your message. One of our agents will be with you shortly. In the meantime, you can check our FAQ section above.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
      setChatMessages(prev => [...prev, botResponse])
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-mtc-bg text-white pb-24">
      {/* Hero Section */}
      <div className="relative h-[40vh] w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-purple-900/90" />
        <img
          src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1920&h=1080&fit=crop"
          alt="Customer Support"
          className="w-full h-full object-cover mix-blend-overlay"
        />
        
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4">
          <Headphones className="w-16 h-16 text-blue-400 mb-4 animate-mtc-pulse-glow" />
          <h1 className="mtc-heading-xl mb-4">Customer Support Center</h1>
          <p className="mtc-body-lg max-w-2xl">
            We're here to help! Get instant answers or connect with our support team.
          </p>
        </div>
      </div>

      <div className="mtc-container mtc-section">
        {/* Support Channels */}
        <section className="mb-16">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {supportChannels.map((channel, index) => (
              <div 
                key={index}
                className="mtc-glass p-6 rounded-3xl text-center hover:bg-white/10 transition-all cursor-pointer group"
              >
                <div className={`inline-flex p-4 rounded-2xl mb-4 ${
                  channel.status === 'online' 
                    ? 'bg-emerald-500/20 text-emerald-400' 
                    : 'bg-blue-500/20 text-blue-400'
                } group-hover:scale-110 transition-transform`}>
                  {channel.icon}
                </div>
                <h3 className="font-semibold mb-2">{channel.title}</h3>
                <p className="text-sm text-white/60 mb-3">{channel.description}</p>
                <div className="flex items-center justify-center gap-2 text-xs">
                  <span className={`w-2 h-2 rounded-full ${
                    channel.status === 'online' ? 'bg-emerald-500' : 'bg-blue-500'
                  } animate-pulse`} />
                  <span className="text-white/40">{channel.responseTime}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-white/10 pb-4">
          {['live-chat', 'faq', 'tickets', 'telegram'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${
                activeTab === tab 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-white/5 text-white/60 hover:bg-white/10'
              }`}
            >
              {tab === 'live-chat' && <MessageCircle size={18} />}
              {tab === 'faq' && <FileText size={18} />}
              {tab === 'tickets' && <MessageSquare size={18} />}
              {tab === 'telegram' && <Bot size={18} />}
              {tab.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
            </button>
          ))}
        </div>

        {/* Live Chat Tab */}
        {activeTab === 'live-chat' && (
          <div className="mtc-glass rounded-3xl overflow-hidden">
            {/* Chat Header */}
            <div className="p-6 border-b border-white/10 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                <Headphones className="text-blue-400" size={24} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">MTC Support</h3>
                  <span className="px-2 py-0.5 rounded-full text-xs bg-emerald-500/20 text-emerald-400">Online</span>
                </div>
                <p className="text-sm text-white/60">Average response time: &lt; 2 minutes</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="p-4 border-b border-white/10">
              <p className="text-sm text-white/40 mb-3">Quick Actions</p>
              <div className="flex flex-wrap gap-2">
                {quickActions.map(action => (
                  <button
                    key={action.action}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 text-sm hover:bg-white/10 transition-all"
                  >
                    {action.icon}
                    {action.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Messages */}
            <div className="h-[400px] overflow-y-auto p-6 space-y-4">
              {chatMessages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[70%] ${
                    msg.type === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-white/5 text-white'
                  } rounded-2xl px-4 py-3`}>
                    <p className="text-sm">{msg.text}</p>
                    <p className={`text-xs mt-2 ${msg.type === 'user' ? 'text-blue-100' : 'text-white/40'}`}>
                      {msg.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/10">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition-all"
                />
                <button
                  onClick={handleSendMessage}
                  className="px-6 py-3 bg-blue-500 rounded-xl hover:bg-blue-600 transition-all flex items-center gap-2"
                >
                  <Send size={18} />
                  <span className="hidden sm:inline">Send</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* FAQ Tab */}
        {activeTab === 'faq' && (
          <div className="space-y-8">
            {faqs.map((category, catIndex) => (
              <div key={catIndex}>
                <h3 className="mtc-heading-sm mb-4 flex items-center gap-2">
                  <ChevronRight className="text-blue-400" size={20} />
                  {category.category}
                </h3>
                <div className="space-y-4">
                  {category.questions.map((faq, index) => (
                    <FAQItem key={index} question={faq.q} answer={faq.a} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tickets Tab */}
        {activeTab === 'tickets' && (
          <div className="space-y-6">
            {/* New Ticket Form */}
            <div className="mtc-glass p-6 rounded-3xl">
              <h3 className="mtc-heading-sm mb-6">Create New Ticket</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-white/60 mb-2">Category</label>
                  <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none">
                    <option className="bg-mtc-bg">Order Issue</option>
                    <option className="bg-mtc-bg">Payment Problem</option>
                    <option className="bg-mtc-bg">Product Question</option>
                    <option className="bg-mtc-bg">Technical Issue</option>
                    <option className="bg-mtc-bg">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-2">Subject</label>
                  <input
                    type="text"
                    placeholder="Brief description of your issue"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-2">Message</label>
                  <textarea
                    rows="5"
                    placeholder="Please provide as much detail as possible..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none resize-none"
                  />
                </div>
                <button className="mtc-button-primary w-full">Submit Ticket</button>
              </div>
            </div>

            {/* Previous Tickets */}
            <div>
              <h3 className="mtc-heading-sm mb-4">Your Tickets</h3>
              <div className="space-y-4">
                {[
                  { id: 'TKT-001', subject: 'Order #12345 not received', status: 'open', date: '2024-01-15' },
                  { id: 'TKT-002', subject: 'Refund for returned item', status: 'resolved', date: '2024-01-10' },
                  { id: 'TKT-003', subject: 'Payment charged twice', status: 'resolved', date: '2024-01-05' }
                ].map(ticket => (
                  <div key={ticket.id} className="mtc-glass p-4 rounded-2xl flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-semibold">{ticket.subject}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs ${
                          ticket.status === 'open' 
                            ? 'bg-yellow-500/20 text-yellow-400' 
                            : 'bg-emerald-500/20 text-emerald-400'
                        }`}>
                          {ticket.status}
                        </span>
                      </div>
                      <p className="text-sm text-white/40">{ticket.id} • {ticket.date}</p>
                    </div>
                    <ChevronRight className="text-white/40" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Telegram Tab */}
        {activeTab === 'telegram' && (
          <div className="mtc-glass p-8 rounded-3xl text-center">
            <Bot className="w-20 h-20 text-blue-400 mx-auto mb-6 animate-mtc-float" />
            <h3 className="mtc-heading-md mb-4">MTC Telegram Bot</h3>
            <p className="mtc-body mb-8 max-w-lg mx-auto">
              Get instant support 24/7 through our Telegram bot. Track orders, get quick answers, and receive notifications directly in Telegram.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="mtc-button-primary flex items-center justify-center gap-2">
                <Bot size={20} />
                Open Telegram Bot
              </button>
              <button className="mtc-button-secondary flex items-center justify-center gap-2">
                <FileText size={20} />
                View Bot Documentation
              </button>
            </div>
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
              {['Track Orders', 'Get Support', 'View Promotions', 'Manage Account'].map(feature => (
                <div key={feature} className="p-4 rounded-xl bg-white/5">
                  <CheckCircle className="text-emerald-400 mx-auto mb-2" size={20} />
                  <p className="text-sm">{feature}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function FAQItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="mtc-glass rounded-2xl overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-5 text-left flex items-center justify-between hover:bg-white/5 transition-all"
      >
        <span className="font-medium">{question}</span>
        <ChevronRight 
          size={20} 
          className={`text-white/40 transition-transform ${isOpen ? 'rotate-90' : ''}`} 
        />
      </button>
      {isOpen && (
        <div className="px-5 pb-5">
          <p className="text-white/60 leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  )
}
