import { useState } from 'react'
import { Map, Layers, Navigation, Search, Maximize2, Minimize2, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Info, Store, MapPin, ChevronRight, X, ZoomIn, ZoomOut } from 'lucide-react'

export default function Interactive3DMallMap({ mallId, mallName }) {
  const [selectedFloor, setSelectedFloor] = useState(1)
  const [selectedStore, setSelectedStore] = useState(null)
  const [viewMode, setViewMode] = useState('2d') // '2d' or '3d'
  const [zoom, setZoom] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')

  const floors = [
    { id: 1, name: 'Ground Floor', stores: 42 },
    { id: 2, name: 'First Floor', stores: 38 },
    { id: 3, name: 'Second Floor', stores: 40 }
  ]

  const categories = [
    { id: 'all', name: 'All', color: '#3B82F6' },
    { id: 'fashion', name: 'Fashion', color: '#EC4899' },
    { id: 'electronics', name: 'Electronics', color: '#8B5CF6' },
    { id: 'food', name: 'Food & Beverage', color: '#F59E0B' },
    { id: 'entertainment', name: 'Entertainment', color: '#10B981' },
    { id: 'services', name: 'Services', color: '#6B7280' }
  ]

  const mockStores = [
    { id: 1, name: 'Zara', floor: 1, category: 'fashion', x: 15, y: 20, description: 'International fashion brand' },
    { id: 2, name: 'Apple Store', floor: 1, category: 'electronics', x: 45, y: 30, description: 'Premium electronics' },
    { id: 3, name: 'Starbucks', floor: 1, category: 'food', x: 70, y: 15, description: 'Coffee & refreshments' },
    { id: 4, name: 'H&M', floor: 2, category: 'fashion', x: 20, y: 40, description: 'Fashion for everyone' },
    { id: 5, name: 'Cinema', floor: 3, category: 'entertainment', x: 60, y: 50, description: 'Movie theater' },
    { id: 6, name: 'Tech World', floor: 1, category: 'electronics', x: 30, y: 60, description: 'Gadgets & accessories' },
    { id: 7, name: 'McDonalds', floor: 1, category: 'food', x: 80, y: 45, description: 'Fast food' },
    { id: 8, name: 'Nike', floor: 2, category: 'fashion', x: 50, y: 25, description: 'Sportswear' },
    { id: 9, name: 'Play Zone', floor: 3, category: 'entertainment', x: 25, y: 35, description: 'Kids entertainment' },
    { id: 10, name: 'Bank', floor: 1, category: 'services', x: 10, y: 55, description: 'Financial services' }
  ]

  const floorStores = mockStores.filter(s => s.floor === selectedFloor)

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.2, 2))
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.2, 0.5))

  return (
    <div className="mtc-glass rounded-3xl overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Map className="text-blue-400" size={28} />
            <div>
              <h2 className="font-bold text-xl">Interactive Mall Map</h2>
              <p className="text-sm text-white/60">{mallName || 'MTC Mall'}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode(viewMode === '2d' ? '3d' : '2d')}
              className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all flex items-center gap-2"
            >
              <Layers size={18} />
              {viewMode === '2d' ? '3D View' : '2D View'}
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
          <input
            type="text"
            placeholder="Search stores, brands, or categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 outline-none focus:border-blue-500 transition-all"
          />
        </div>
      </div>

      {/* Category Filters */}
      <div className="p-4 border-b border-white/10 overflow-x-auto">
        <div className="flex gap-2">
          {categories.map(cat => (
            <button
              key={cat.id}
              className="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all flex items-center gap-2"
              style={{
                backgroundColor: cat.id === 'all' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                borderColor: cat.id === 'all' ? cat.color : 'transparent',
                borderWidth: '1px'
              }}
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Floor Selector */}
      <div className="p-4 border-b border-white/10">
        <div className="flex gap-2">
          {floors.map(floor => (
            <button
              key={floor.id}
              onClick={() => setSelectedFloor(floor.id)}
              className={`flex-1 p-4 rounded-xl transition-all ${
                selectedFloor === floor.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-white/5 hover:bg-white/10'
              }`}
            >
              <div className="text-sm text-white/60 mb-1">{floor.name}</div>
              <div className="font-bold">{floor.stores} stores</div>
            </button>
          ))}
        </div>
      </div>

      {/* Map Area */}
      <div className="relative bg-gradient-to-br from-slate-800 to-slate-900" style={{ minHeight: '500px' }}>
        {/* Map Controls */}
        <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
          <button
            onClick={handleZoomIn}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all"
          >
            <ZoomIn size={20} />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all"
          >
            <ZoomOut size={20} />
          </button>
        </div>

        {/* Map Canvas */}
        <div 
          className="w-full h-full relative overflow-hidden p-8"
          style={{ transform: `scale(${zoom})`, transformOrigin: 'center' }}
        >
          {/* Grid Background */}
          <div className="absolute inset-0 opacity-10">
            <div className="w-full h-full" style={{
              backgroundImage: `
                linear-gradient(to right, #666 1px, transparent 1px),
                linear-gradient(to bottom, #666 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px'
            }} />
          </div>

          {/* Mall Structure */}
          <div className="relative w-full max-w-4xl mx-auto">
            {/* Main Building Outline */}
            <div className="border-4 border-white/20 rounded-3xl p-4 bg-white/5 relative">
              {/* Walkways */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-2 h-full bg-white/10" />
                <div className="w-full h-2 bg-white/10 absolute" />
              </div>

              {/* Store Markers */}
              {floorStores.map(store => {
                const category = categories.find(c => c.id === store.category)
                return (
                  <div
                    key={store.id}
                    onClick={() => setSelectedStore(store)}
                    className="absolute cursor-pointer group transform hover:scale-110 transition-all"
                    style={{ left: `${store.x}%`, top: `${store.y}%` }}
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xs shadow-lg"
                      style={{ backgroundColor: category?.color || '#6B7280' }}
                    >
                      <Store size={16} />
                    </div>
                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 px-2 py-1 rounded text-xs">
                      {store.name}
                    </div>
                  </div>
                )
              })}

              {/* Navigation Points */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="w-16 h-16 rounded-full bg-blue-500/20 border-2 border-blue-500 flex items-center justify-center animate-pulse">
                  <Navigation className="text-blue-400" size={24} />
                </div>
              </div>

              {/* Entrances */}
              <div className="absolute -left-4 top-1/2 -translate-y-1/2">
                <div className="w-4 h-12 bg-emerald-500 rounded-l-lg flex items-center justify-center">
                  <span className="text-xs font-bold rotate-90 whitespace-nowrap">ENTRANCE</span>
                </div>
              </div>
              <div className="absolute -right-4 top-1/2 -translate-y-1/2">
                <div className="w-4 h-12 bg-emerald-500 rounded-r-lg flex items-center justify-center">
                  <span className="text-xs font-bold -rotate-90 whitespace-nowrap">ENTRANCE</span>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="mt-6 flex flex-wrap gap-4 justify-center">
              {categories.filter(c => c.id !== 'all').map(cat => (
                <div key={cat.id} className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                  <span className="text-sm text-white/60">{cat.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Store Detail Modal */}
        {selectedStore && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center p-4 z-20">
            <div className="mtc-glass rounded-3xl max-w-md w-full p-6 relative">
              <button
                onClick={() => setSelectedStore(null)}
                className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/10 transition-all"
              >
                <X size={20} />
              </button>
              
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 rounded-xl bg-blue-500/20 text-blue-400">
                  <Store size={32} />
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-1">{selectedStore.name}</h3>
                  <p className="text-sm text-white/60">{selectedStore.description}</p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                  <MapPin className="text-blue-400" size={18} />
                  <div>
                    <p className="text-xs text-white/40">Location</p>
                    <p className="font-medium">Floor {selectedStore.floor}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                  <Info className="text-purple-400" size={18} />
                  <div>
                    <p className="text-xs text-white/40">Category</p>
                    <p className="font-medium capitalize">{selectedStore.category}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <button className="w-full mtc-button-primary flex items-center justify-center gap-2">
                  <Navigation size={18} />
                  Get Directions (AR)
                </button>
                <button className="w-full mtc-button-secondary flex items-center justify-center gap-2">
                  <Store size={18} />
                  View Products
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Directions Panel */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <label className="block text-xs text-white/40 mb-1">From</label>
            <select className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none">
              <option>Entrance A</option>
              <option>Entrance B</option>
              <option>Parking B1</option>
              <option>Current Location</option>
            </select>
          </div>
          <div className="pt-6">
            <ChevronRight className="text-white/40" size={20} />
          </div>
          <div className="flex-1">
            <label className="block text-xs text-white/40 mb-1">To</label>
            <select className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none">
              <option>Select destination...</option>
              {floorStores.map(store => (
                <option key={store.id}>{store.name}</option>
              ))}
            </select>
          </div>
          <button className="mt-5 mtc-button-primary px-6">Go</button>
        </div>
      </div>
    </div>
  )
}
