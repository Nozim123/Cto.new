import { useState } from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Phone, ShoppingBag, ChevronRight, X, Info } from 'lucide-react'

export default function InteractiveFloorPlan({ stores, mallId }) {
  const [selectedStore, setSelectedStore] = useState(null)
  const [currentFloor, setCurrentFloor] = useState(1)

  const storesByFloor = stores.reduce((acc, store) => {
    const floor = store.floor || 1
    if (!acc[floor]) acc[floor] = []
    acc[floor].push(store)
    return acc
  }, {})

  const floors = Object.keys(storesByFloor).sort((a, b) => a - b)

  return (
    <div className="mtc-glass rounded-[3rem] p-8 md:p-12">
      <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
        <div>
          <h3 className="mtc-heading-md mb-2">Interactive Floor Plan</h3>
          <p className="mtc-body-sm text-white/50">Explore shops and services by floor</p>
        </div>
        
        <div className="flex bg-white/5 p-2 rounded-2xl border border-white/10">
          {floors.map((floor) => (
            <button
              key={floor}
              onClick={() => setCurrentFloor(parseInt(floor))}
              className={`px-6 py-2 rounded-xl font-bold transition-all ${
                currentFloor === parseInt(floor)
                  ? 'bg-blue-500 text-white shadow-mtc-glow'
                  : 'text-white/40 hover:text-white hover:bg-white/5'
              }`}
            >
              Floor {floor}
            </button>
          ))}
        </div>
      </div>
      
      <div className="relative min-h-[400px] border border-white/5 rounded-[2rem] bg-black/20 p-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {storesByFloor[currentFloor]?.map((store) => (
            <button
              key={store.id}
              onClick={() => setSelectedStore(store)}
              className={`relative p-4 rounded-2xl border transition-all duration-300 group
                        ${selectedStore?.id === store.id 
                          ? 'bg-blue-500/20 border-blue-500 shadow-mtc-glow scale-105' 
                          : 'bg-white/5 border-white/10 hover:bg-white/10 hover:scale-105'
                        }`}
            >
              <div className="flex flex-col items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-mtc-bg p-2 border border-white/10 flex items-center justify-center overflow-hidden transition-transform group-hover:rotate-6">
                  <img
                    src={store.logo}
                    alt={store.name}
                    className="w-full h-full object-contain filter brightness-0 invert"
                  />
                </div>
                <div className="text-center">
                   <div className="text-xs font-bold text-white truncate w-full max-w-[100px]">{store.name}</div>
                   <div className="text-[10px] text-white/40 uppercase tracking-wider">{store.category}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
        
        {/* Placeholder if floor is empty */}
        {(!storesByFloor[currentFloor] || storesByFloor[currentFloor].length === 0) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white/20">
             <ShoppingBag size={64} />
             <p className="mt-4 font-medium">No shops on this floor yet</p>
          </div>
        )}
      </div>

      {/* Store Detail Modal Overlay */}
      {selectedStore && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-mtc-fade-in"
          onClick={() => setSelectedStore(null)}
        >
          <div 
            className="mtc-glass max-w-lg w-full rounded-[2.5rem] p-8 md:p-10 relative shadow-mtc-card-hover animate-mtc-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedStore(null)}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all"
            >
              <X size={24} />
            </button>

            <div className="flex items-center gap-6 mb-8">
              <div className="w-24 h-24 rounded-3xl bg-mtc-bg p-4 border border-white/10 flex items-center justify-center overflow-hidden">
                <img
                  src={selectedStore.logo}
                  alt={selectedStore.name}
                  className="w-full h-full object-contain filter brightness-0 invert"
                />
              </div>
              <div>
                <div className="mtc-badge mtc-badge-primary mb-2">{selectedStore.category}</div>
                <h4 className="mtc-heading-sm">{selectedStore.name}</h4>
                <div className="flex items-center gap-2 text-white/40 text-sm mt-1">
                  <MapPin size={14} className="text-blue-400" />
                  Floor {selectedStore.floor} • Area {selectedStore.location || 'N/A'}
                </div>
              </div>
            </div>

            <p className="mtc-body-sm text-white/60 mb-8 line-clamp-4">
              {selectedStore.description}
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8">
               <div className="bg-white/5 p-4 rounded-2xl border border-white/5 flex items-center gap-3">
                  <Phone size={18} className="text-blue-400" />
                  <div className="text-sm font-medium">{selectedStore.phone || 'Contact Support'}</div>
               </div>
               <div className="bg-white/5 p-4 rounded-2xl border border-white/5 flex items-center gap-3">
                  <Info size={18} className="text-purple-400" />
                  <div className="text-sm font-medium">Open 10:00-22:00</div>
               </div>
            </div>

            <div className="flex gap-4">
              <Link
                to={`/mall/${mallId}/store/${selectedStore.id}`}
                className="flex-1 mtc-button-primary text-center flex items-center justify-center gap-2"
                onClick={() => setSelectedStore(null)}
              >
                Visit Store
                <ChevronRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
