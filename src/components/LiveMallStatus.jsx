import { useState, useEffect } from 'react'
import { Activity, Users, Car, Calendar, Store, Zap, TrendingUp, Clock, AlertCircle, CheckCircle, ArrowUp, ArrowDown } from 'lucide-react'

export default function LiveMallStatus({ mallId }) {
  const [lastUpdate, setLastUpdate] = useState(new Date())
  const [statusData, setStatusData] = useState({
    openStores: 89,
    totalStores: 120,
    occupancy: 67,
    parking: { available: 45, total: 2500 },
    foodCourt: { current: 234, capacity: 500 },
    events: 3,
    queueWaitTime: '5 min'
  })

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date())
      setStatusData(prev => ({
        ...prev,
        occupancy: Math.min(100, Math.max(30, prev.occupancy + (Math.random() - 0.5) * 5)),
        parking: {
          ...prev.parking,
          available: Math.max(0, prev.parking.available + Math.floor((Math.random() - 0.5) * 20))
        },
        foodCourt: {
          ...prev.foodCourt,
          current: Math.min(prev.foodCourt.capacity, Math.max(100, prev.foodCourt.current + Math.floor((Math.random() - 0.5) * 30)))
        }
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const statusCards = [
    {
      icon: <Store className="text-emerald-400" />,
      label: 'Open Stores',
      value: `${statusData.openStores}/${statusData.totalStores}`,
      trend: '+2',
      trendUp: true
    },
    {
      icon: <Users className="text-blue-400" />,
      label: 'Occupancy Rate',
      value: `${Math.round(statusData.occupancy)}%`,
      trend: '+5%',
      trendUp: true
    },
    {
      icon: <Car className="text-purple-400" />,
      label: 'Parking Spots',
      value: `${statusData.parking.available}`,
      trend: '-15',
      trendUp: false
    },
    {
      icon: <Calendar className="text-yellow-400" />,
      label: 'Active Events',
      value: `${statusData.events}`,
      trend: '0',
      trendUp: null
    }
  ]

  const foodCourtZones = [
    { name: 'Food Court Level 1', capacity: 300, current: 156, status: 'moderate' },
    { name: 'Food Court Level 2', capacity: 200, current: 78, status: 'low' },
    { name: 'Outdoor Dining', capacity: 150, current: 134, status: 'high' }
  ]

  const recentAlerts = [
    { type: 'info', message: 'New store opening on Level 2 next week', time: '10 min ago' },
    { type: 'warning', message: 'Elevators B2-B3 under maintenance', time: '25 min ago' },
    { type: 'success', message: 'Flash sale starting at Electronics Zone', time: '30 min ago' },
    { type: 'info', message: 'Parking Level B1 now available', time: '45 min ago' }
  ]

  const getStatusColor = (status) => {
    switch(status) {
      case 'high': return 'bg-red-500'
      case 'moderate': return 'bg-yellow-500'
      case 'low': return 'bg-emerald-500'
      default: return 'bg-gray-500'
    }
  }

  const getOccupancyColor = (percent) => {
    if (percent >= 80) return 'text-red-400'
    if (percent >= 60) return 'text-yellow-400'
    return 'text-emerald-400'
  }

  return (
    <div className="mtc-glass rounded-3xl overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Activity className="text-emerald-400" size={28} />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
            </div>
            <div>
              <h2 className="font-bold text-xl">Live Mall Status</h2>
              <p className="text-sm text-white/60 flex items-center gap-2">
                <Clock size={12} />
                Last updated: {lastUpdate.toLocaleTimeString()}
              </p>
            </div>
          </div>
          <button className="px-4 py-2 rounded-lg bg-white/5 text-sm hover:bg-white/10 transition-all">
            View Details
          </button>
        </div>
      </div>

      {/* Status Cards */}
      <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        {statusCards.map((card, index) => (
          <StatusCard key={index} {...card} />
        ))}
      </div>

      {/* Detailed Sections */}
      <div className="p-6 border-t border-white/10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Occupancy Gauge */}
          <div>
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="text-blue-400" size={20} />
              Real-time Occupancy
            </h3>
            <div className="relative h-40 flex items-center justify-center">
              <svg className="w-full h-full" viewBox="0 0 200 100">
                {/* Background arc */}
                <path
                  d="M 20 90 A 80 80 0 0 1 180 90"
                  fill="none"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="12"
                  strokeLinecap="round"
                />
                {/* Progress arc */}
                <path
                  d="M 20 90 A 80 80 0 0 1 180 90"
                  fill="none"
                  stroke="url(#gradient)"
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={`${statusData.occupancy * 2.5} 251`}
                  className="transition-all duration-1000"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#10B981" />
                    <stop offset="50%" stopColor="#F59E0B" />
                    <stop offset="100%" stopColor="#EF4444" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute bottom-0 text-center">
                <div className={`text-5xl font-bold ${getOccupancyColor(statusData.occupancy)}`}>
                  {Math.round(statusData.occupancy)}%
                </div>
                <div className="text-sm text-white/60">Current Occupancy</div>
              </div>
            </div>
            <div className="flex justify-between text-sm mt-4">
              <span className="text-emerald-400">Low</span>
              <span className="text-yellow-400">Moderate</span>
              <span className="text-red-400">High</span>
            </div>
          </div>

          {/* Parking Status */}
          <div>
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Car className="text-purple-400" size={20} />
              Parking Availability
            </h3>
            <div className="space-y-4">
              <ParkingLevel level="B1" available={156} total={500} />
              <ParkingLevel level="B2" available={234} total={500} />
              <ParkingLevel level="B3" available={89} total={500} />
              <ParkingLevel level="Roof" available={456} total={1000} />
            </div>
          </div>
        </div>
      </div>

      {/* Food Court & Alerts */}
      <div className="p-6 border-t border-white/10 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Food Court */}
        <div>
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Zap className="text-yellow-400" size={20} />
            Food Court Zones
          </h3>
          <div className="space-y-3">
            {foodCourtZones.map((zone, index) => (
              <div key={index} className="p-4 rounded-xl bg-white/5">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{zone.name}</span>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(zone.status)}`} />
                    <span className="text-xs text-white/60 capitalize">{zone.status}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${getStatusColor(zone.status)} transition-all`}
                      style={{ width: `${(zone.current / zone.capacity) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium">{zone.current}/{zone.capacity}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Alerts */}
        <div>
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <AlertCircle className="text-blue-400" size={20} />
            Recent Alerts
          </h3>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {recentAlerts.map((alert, index) => (
              <AlertItem key={index} {...alert} />
            ))}
          </div>
        </div>
      </div>

      {/* Queue Status */}
      <div className="p-6 border-t border-white/10">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Users className="text-orange-400" size={20} />
          Queue Wait Times
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: 'Restaurants', time: '5-10 min' },
            { name: 'Cinema', time: '15 min' },
            { name: 'Information', time: '2 min' },
            { name: 'Restrooms', time: 'No wait' }
          ].map((queue, index) => (
            <div key={index} className="p-4 rounded-xl bg-white/5 text-center">
              <p className="text-white/60 text-sm mb-1">{queue.name}</p>
              <p className="font-bold text-lg">{queue.time}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function StatusCard({ icon, label, value, trend, trendUp }) {
  return (
    <div className="p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all">
      <div className="flex items-center gap-2 mb-2">{icon}</div>
      <p className="text-2xl font-bold mb-1">{value}</p>
      <div className="flex items-center justify-between">
        <p className="text-sm text-white/60">{label}</p>
        {trend && (
          <div className={`flex items-center gap-1 text-xs ${trendUp ? 'text-emerald-400' : 'text-red-400'}`}>
            {trendUp ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
            {trend}
          </div>
        )}
      </div>
    </div>
  )
}

function ParkingLevel({ level, available, total }) {
  const percent = (available / total) * 100
  const getColor = () => {
    if (percent < 20) return 'text-red-400'
    if (percent < 50) return 'text-yellow-400'
    return 'text-emerald-400'
  }

  return (
    <div className="flex items-center gap-4">
      <div className="w-16 text-center">
        <span className="font-semibold">{level}</span>
      </div>
      <div className="flex-1">
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <div 
            className={`h-full bg-emerald-500 transition-all`}
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
      <div className={`text-right ${getColor()}`}>
        <span className="font-bold">{available}</span>
        <span className="text-sm text-white/40">/{total}</span>
      </div>
    </div>
  )
}

function AlertItem({ type, message, time }) {
  const getTypeIcon = () => {
    switch(type) {
      case 'success': return <CheckCircle className="text-emerald-400" size={16} />
      case 'warning': return <AlertCircle className="text-yellow-400" size={16} />
      default: return <Clock className="text-blue-400" size={16} />
    }
  }

  return (
    <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5">
      {getTypeIcon()}
      <div className="flex-1 min-w-0">
        <p className="text-sm">{message}</p>
        <p className="text-xs text-white/40 mt-1">{time}</p>
      </div>
    </div>
  )
}
