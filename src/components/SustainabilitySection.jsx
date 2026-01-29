import { useState } from 'react'
import { Leaf, Recycle, Zap, Droplet, TreePine, Bike, Award, TrendingUp, CheckCircle, Target, Heart, Globe } from 'lucide-react'

export default function SustainabilitySection() {
  const [userEcoPoints, setUserEcoPoints] = useState(1250)

  const ecoStats = [
    { icon: <Leaf className="text-emerald-400" />, label: 'Eco Score', value: 'A+', trend: '+5%' },
    { icon: <Recycle className="text-blue-400" />, label: 'Items Recycled', value: '47', trend: '+12' },
    { icon: <Zap className="text-yellow-400" />, label: 'Energy Saved', value: '234 kWh', trend: '+18%' },
    { icon: <Droplet className="text-cyan-400" />, label: 'Water Saved', value: '156 L', trend: '+8%' }
  ]

  const recyclingStations = [
    { id: 1, location: 'Level 1 - Near Entrance A', items: ['Paper', 'Plastic', 'Glass', 'Metal'] },
    { id: 2, location: 'Level 2 - Food Court', items: ['Paper', 'Plastic', 'Organic'] },
    { id: 3, location: 'Level 3 - Parking B1', items: ['Paper', 'Plastic', 'Glass', 'Metal', 'Batteries'] }
  ]

  const evChargingStations = [
    { id: 1, location: 'Parking B1 - Zone A', spots: 8, type: 'Fast Charger', status: '4 available' },
    { id: 2, location: 'Parking B1 - Zone B', spots: 4, type: 'Standard Charger', status: '2 available' },
    { id: 3, location: 'Roof Parking', spots: 6, type: 'Fast Charger', status: '6 available' }
  ]

  const ecoChallenges = [
    {
      id: 1,
      title: 'Plastic Free Week',
      description: 'Use reusable bags for all purchases',
      progress: 5,
      total: 7,
      reward: 200,
      icon: <Recycle size={20} />
    },
    {
      id: 2,
      title: 'Green Commuter',
      description: 'Visit mall using eco-friendly transport 5 times',
      progress: 3,
      total: 5,
      reward: 150,
      icon: <Bike size={20} />
    },
    {
      id: 3,
      title: 'Recycling Champion',
      description: 'Recycle 20 items this month',
      progress: 15,
      total: 20,
      reward: 300,
      icon: <Leaf size={20} />
    }
  ]

  const greenBrands = [
    {
      id: 1,
      name: 'Eco Fashion Hub',
      category: 'Clothing',
      description: 'Sustainable fashion made from recycled materials',
      logo: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=100&h=100&fit=crop',
      certifications: ['Organic', 'Fair Trade', 'Recycled']
    },
    {
      id: 2,
      name: 'Green Tech Store',
      category: 'Electronics',
      description: 'Energy-efficient electronics and e-waste recycling',
      logo: 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=100&h=100&fit=crop',
      certifications: ['Energy Star', 'E-Waste Certified']
    },
    {
      id: 3,
      name: 'Organic Beauty',
      category: 'Beauty',
      description: 'Natural cosmetics without harmful chemicals',
      logo: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=100&h=100&fit=crop',
      certifications: ['Cruelty Free', 'Vegan', 'Organic']
    },
    {
      id: 4,
      name: 'Sustainable Home',
      category: 'Home Goods',
      description: 'Eco-friendly home products and zero-waste items',
      logo: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=100&h=100&fit=crop',
      certifications: ['Zero Waste', 'Sustainable']
    }
  ]

  const ecoRewards = [
    { id: 1, title: 'Free Coffee', description: 'At eco-friendly cafes', cost: 500, icon: <Zap size={24} /> },
    { id: 2, title: 'Plant a Tree', description: 'We plant one in your name', cost: 1000, icon: <TreePine size={24} /> },
    { id: 3, title: 'Eco Shopping Bag', description: 'Reusable premium bag', cost: 750, icon: <Recycle size={24} /> },
    { id: 4, title: 'EV Charging Credit', description: '1 hour free charging', cost: 800, icon: <Zap size={24} /> }
  ]

  return (
    <div className="mtc-glass rounded-3xl overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-white/10 bg-gradient-to-r from-emerald-900/30 to-cyan-900/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400">
              <Leaf size={32} />
            </div>
            <div>
              <h2 className="font-bold text-xl">Sustainability & Green Zone</h2>
              <p className="text-sm text-white/60">Making shopping eco-friendly together</p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 text-emerald-400">
              <Award size={20} />
              <span className="font-bold text-xl">{userEcoPoints}</span>
            </div>
            <p className="text-xs text-white/40">Eco Points</p>
          </div>
        </div>
      </div>

      {/* Eco Stats */}
      <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4 border-b border-white/10">
        {ecoStats.map((stat, index) => (
          <div key={index} className="text-center p-4 rounded-xl bg-white/5">
            <div className="flex justify-center mb-2">{stat.icon}</div>
            <div className="text-xl font-bold mb-1">{stat.value}</div>
            <div className="text-xs text-white/60 mb-1">{stat.label}</div>
            <div className="text-xs text-emerald-400">{stat.trend}</div>
          </div>
        ))}
      </div>

      <div className="p-6 space-y-8">
        {/* Recycling Stations */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Recycle className="text-blue-400" size={24} />
            <h3 className="font-semibold text-lg">Recycling Stations</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recyclingStations.map(station => (
              <div key={station.id} className="p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-medium mb-1">{station.location}</h4>
                    <p className="text-xs text-white/40">Accepts:</p>
                  </div>
                  <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
                    <Recycle size={18} />
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {station.items.map((item, i) => (
                    <span key={i} className="px-2 py-1 rounded-full text-xs bg-white/10 text-white/70">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* EV Charging Stations */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Zap className="text-yellow-400" size={24} />
            <h3 className="font-semibold text-lg">EV Charging Stations</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {evChargingStations.map(station => (
              <div key={station.id} className="p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-medium mb-1">{station.location}</h4>
                    <p className="text-xs text-white/60">{station.type}</p>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs ${
                    station.status.includes('available') 
                      ? 'bg-emerald-500/20 text-emerald-400' 
                      : 'bg-red-500/20 text-red-400'
                  }`}>
                    {station.status}
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/60">{station.spots} charging spots</span>
                  <button className="text-blue-400 hover:underline text-xs">Navigate</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Eco Challenges */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Target className="text-purple-400" size={24} />
            <h3 className="font-semibold text-lg">Eco Challenges</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {ecoChallenges.map(challenge => (
              <div key={challenge.id} className="p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-start gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400">
                    {challenge.icon}
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">{challenge.title}</h4>
                    <p className="text-xs text-white/60">{challenge.description}</p>
                  </div>
                </div>
                <div className="mb-3">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-white/40">Progress</span>
                    <span className="text-purple-400">{challenge.progress}/{challenge.total}</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-purple-500 transition-all"
                      style={{ width: `${(challenge.progress / challenge.total) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs">
                    <Award size={12} className="text-emerald-400" />
                    <span className="text-emerald-400 font-medium">+{challenge.reward} pts</span>
                  </div>
                  <button className="px-3 py-1 rounded-lg bg-purple-500/20 text-purple-400 text-xs hover:bg-purple-500/30 transition-all">
                    Continue
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Green Brands */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Globe className="text-cyan-400" size={24} />
            <h3 className="font-semibold text-lg">Green Brands</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {greenBrands.map(brand => (
              <div key={brand.id} className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-emerald-500/30 transition-all group cursor-pointer">
                <div className="flex items-start gap-3 mb-3">
                  <img src={brand.logo} alt={brand.name} className="w-12 h-12 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium mb-1 truncate">{brand.name}</h4>
                    <p className="text-xs text-white/60">{brand.category}</p>
                  </div>
                </div>
                <p className="text-xs text-white/40 mb-3 line-clamp-2">{brand.description}</p>
                <div className="flex flex-wrap gap-1">
                  {brand.certifications.map((cert, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-full text-xs bg-emerald-500/20 text-emerald-400">
                      {cert}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Eco Rewards */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Heart className="text-pink-400" size={24} />
            <h3 className="font-semibold text-lg">Eco Rewards</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {ecoRewards.map(reward => (
              <div key={reward.id} className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
                <div className={`p-3 rounded-xl mx-auto w-14 h-14 flex items-center justify-center mb-3 ${
                  userEcoPoints >= reward.cost 
                    ? 'bg-emerald-500/20 text-emerald-400' 
                    : 'bg-white/5 text-white/40'
                }`}>
                  {reward.icon}
                </div>
                <h4 className="font-medium mb-1">{reward.title}</h4>
                <p className="text-xs text-white/60 mb-3">{reward.description}</p>
                <button
                  disabled={userEcoPoints < reward.cost}
                  className={`w-full py-2 rounded-lg text-sm font-medium transition-all ${
                    userEcoPoints >= reward.cost
                      ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                      : 'bg-white/5 text-white/40 cursor-not-allowed'
                  }`}
                >
                  {reward.cost} pts
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
