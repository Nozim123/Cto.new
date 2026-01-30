import { useState } from 'react'
import { Gift, CreditCard, Send, QrCode, Calendar, Percent, CheckCircle, Copy, Download, Share2 } from 'lucide-react'

export default function GiftCardsSection() {
  const [activeTab, setActiveTab] = useState('buy')
  const [selectedCard, setSelectedCard] = useState(null)
  const [copiedCode, setCopiedCode] = useState(null)

  const giftCards = [
    {
      id: 1,
      type: 'mall',
      title: 'MTC Mall Gift Card',
      description: 'Use at any store in all MTC malls',
      amount: 50,
      image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&h=400&fit=crop',
      validFor: '12 months',
      delivery: 'Instant digital'
    },
    {
      id: 2,
      type: 'mall',
      title: 'Premium Experience Card',
      description: 'VIP treatment and exclusive perks',
      amount: 100,
      image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&h=400&fit=crop',
      validFor: '6 months',
      delivery: 'Instant digital'
    },
    {
      id: 3,
      type: 'store',
      title: 'Tech World Card',
      description: 'Perfect for gadget lovers',
      amount: 75,
      image: 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=600&h=400&fit=crop',
      validFor: '12 months',
      delivery: 'Instant digital'
    },
    {
      id: 4,
      type: 'mall',
      title: 'Fashionista Card',
      description: 'Style and elegance for any occasion',
      amount: 60,
      image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&h=400&fit=crop',
      validFor: '12 months',
      delivery: 'Instant digital'
    }
  ]

  const myVouchers = [
    {
      id: 1,
      code: 'MTC-2024-X7K9P',
      value: 50,
      type: 'Gift Card',
      status: 'active',
      expiry: '2025-01-15',
      barcode: 'MTC2024X7K9P'
    },
    {
      id: 2,
      code: 'SUMMER-20-OFF',
      discount: 20,
      type: 'Voucher',
      status: 'active',
      expiry: '2024-06-30',
      minPurchase: 100
    },
    {
      id: 3,
      code: 'VIP-EXCLUSIVE',
      discount: 15,
      type: 'Voucher',
      status: 'used',
      expiry: '2024-02-28',
      minPurchase: 200
    }
  ]

  const copyCode = (code) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  return (
    <div className="mtc-glass rounded-3xl overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Gift className="text-blue-400" size={28} />
            <div>
              <h2 className="font-bold text-xl">Gift Cards & Vouchers</h2>
              <p className="text-sm text-white/60">Perfect gifts and exclusive discounts</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/10">
        <button
          onClick={() => setActiveTab('buy')}
          className={`flex-1 py-4 font-medium transition-all ${
            activeTab === 'buy' 
              ? 'text-blue-400 border-b-2 border-blue-400' 
              : 'text-white/60 hover:text-white'
          }`}
        >
          <CreditCard size={18} className="inline mr-2" />
          Buy Gift Cards
        </button>
        <button
          onClick={() => setActiveTab('my-vouchers')}
          className={`flex-1 py-4 font-medium transition-all ${
            activeTab === 'my-vouchers' 
              ? 'text-blue-400 border-b-2 border-blue-400' 
              : 'text-white/60 hover:text-white'
          }`}
        >
          <QrCode size={18} className="inline mr-2" />
          My Vouchers
        </button>
      </div>

      {/* Buy Gift Cards Tab */}
      {activeTab === 'buy' && (
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {giftCards.map(card => (
              <GiftCard key={card.id} card={card} onSelect={setSelectedCard} selected={selectedCard?.id === card.id} />
            ))}
          </div>
          
          {selectedCard && (
            <div className="mt-8 p-6 rounded-2xl bg-white/5">
              <h3 className="font-bold text-lg mb-4">Customize Your Gift Card</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm text-white/60 mb-2">Amount ($)</label>
                  <input
                    type="number"
                    defaultValue={selectedCard.amount}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-2">Quantity</label>
                  <input
                    type="number"
                    defaultValue={1}
                    min={1}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-2">Recipient Name</label>
                  <input
                    type="text"
                    placeholder="Optional"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-2">Recipient Email</label>
                  <input
                    type="email"
                    placeholder="Optional - send directly"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-sm text-white/60 mb-2">Personal Message</label>
                <textarea
                  rows={3}
                  placeholder="Add a personal note..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-blue-500 resize-none"
                />
              </div>
              <div className="flex gap-4">
                <button className="flex-1 mtc-button-primary">
                  <CreditCard size={18} className="inline mr-2" />
                  Purchase Now
                </button>
                <button className="flex-1 mtc-button-secondary">
                  <Send size={18} className="inline mr-2" />
                  Send as Gift
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* My Vouchers Tab */}
      {activeTab === 'my-vouchers' && (
        <div className="p-6">
          <div className="space-y-4">
            {myVouchers.map(voucher => (
              <VoucherCard 
                key={voucher.id} 
                voucher={voucher} 
                onCopy={copyCode}
                copiedCode={copiedCode}
              />
            ))}
          </div>
          
          {myVouchers.length === 0 && (
            <div className="text-center py-12">
              <Gift size={48} className="text-white/20 mx-auto mb-4" />
              <p className="text-white/60">No vouchers yet</p>
              <button 
                onClick={() => setActiveTab('buy')}
                className="mt-4 text-blue-400 font-medium hover:underline"
              >
                Browse Gift Cards
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function GiftCard({ card, onSelect, selected }) {
  return (
    <div 
      onClick={() => onSelect(card)}
      className={`relative rounded-2xl overflow-hidden cursor-pointer transition-all ${
        selected ? 'ring-2 ring-blue-500' : 'hover:ring-2 ring-white/20'
      }`}
    >
      <img src={card.image} alt={card.title} className="w-full h-48 object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2 py-0.5 rounded-full text-xs bg-blue-500/20 text-blue-400">
            {card.type === 'mall' ? 'All Stores' : 'Specific Store'}
          </span>
        </div>
        <h3 className="font-bold text-lg mb-1">{card.title}</h3>
        <p className="text-sm text-white/80 mb-3">{card.description}</p>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-white/60">From</p>
            <p className="text-2xl font-bold text-yellow-400">${card.amount}</p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 text-xs text-white/60">
              <Calendar size={12} />
              {card.validFor}
            </div>
            <p className="text-xs text-white/60">{card.delivery}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function VoucherCard({ voucher, onCopy, copiedCode }) {
  const isExpired = new Date(voucher.expiry) < new Date()
  
  return (
    <div className={`p-5 rounded-2xl border ${
      voucher.status === 'used' || isExpired
        ? 'border-white/5 bg-white/5 opacity-60'
        : 'border-white/10 bg-white/5'
    }`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-xl ${
            voucher.type === 'Gift Card' 
              ? 'bg-blue-500/20 text-blue-400' 
              : 'bg-emerald-500/20 text-emerald-400'
          }`}>
            {voucher.type === 'Gift Card' ? <CreditCard size={20} /> : <Percent size={20} />}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`font-semibold ${voucher.status === 'active' && !isExpired ? 'text-white' : 'text-white/60'}`}>
                {voucher.type}
              </span>
              <span className={`px-2 py-0.5 rounded-full text-xs ${
                voucher.status === 'active' && !isExpired
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'bg-white/10 text-white/40'
              }`}>
                {isExpired ? 'Expired' : voucher.status}
              </span>
            </div>
            <p className="text-lg font-bold text-yellow-400">
              {voucher.type === 'Gift Card' ? `$${voucher.value}` : `${voucher.discount}% OFF`}
            </p>
          </div>
        </div>
      </div>
      
      <div className="mb-4 p-3 rounded-xl bg-black/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <QrCode size={16} className="text-white/40" />
            <code className="font-mono text-sm">{voucher.code}</code>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onCopy(voucher.code)}
              className="p-2 rounded-lg hover:bg-white/10 transition-all"
              title="Copy code"
            >
              {copiedCode === voucher.code ? <CheckCircle size={16} className="text-emerald-400" /> : <Copy size={16} className="text-white/60" />}
            </button>
            <button className="p-2 rounded-lg hover:bg-white/10 transition-all" title="Download">
              <Download size={16} className="text-white/60" />
            </button>
            <button className="p-2 rounded-lg hover:bg-white/10 transition-all" title="Share">
              <Share2 size={16} className="text-white/60" />
            </button>
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between text-xs text-white/40">
        <div className="flex items-center gap-1">
          <Calendar size={12} />
          Expires: {new Date(voucher.expiry).toLocaleDateString()}
        </div>
        {voucher.minPurchase && (
          <span>Min purchase: ${voucher.minPurchase}</span>
        )}
      </div>
    </div>
  )
}
