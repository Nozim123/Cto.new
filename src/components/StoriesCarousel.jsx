import { useState } from 'react'
import { X } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'

export default function StoriesCarousel({ stores }) {
  const [activeStory, setActiveStory] = useState(null)
  const [progress, setProgress] = useState(0)
  const { darkMode } = useTheme()

  const handleStoryClick = (store) => {
    setActiveStory(store)
    setProgress(0)
    
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          setActiveStory(null)
          return 0
        }
        return prev + 2
      })
    }, 100)
  }

  const closeStory = () => {
    setActiveStory(null)
    setProgress(0)
  }

  return (
    <>
      <div className="flex gap-4 overflow-x-auto pb-4 px-4 lg:px-8 scrollbar-hide">
        {stores.map((store) => (
          <button
            key={store.id}
            onClick={() => handleStoryClick(store)}
            className="flex-shrink-0 flex flex-col items-center gap-2 group"
          >
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-gold via-accent to-sage p-1 
                            transform transition-all duration-300 group-hover:scale-110 group-active:scale-95">
                <div className={`w-full h-full rounded-full border-4 ${darkMode ? 'border-gray-900' : 'border-white'} overflow-hidden`}>
                  <img
                    src={store.logo}
                    alt={store.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              {store.hasPromo && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full 
                              flex items-center justify-center text-white text-xs font-bold">
                  !
                </div>
              )}
            </div>
            <span className="text-xs font-medium max-w-[80px] truncate text-navy dark:text-cream">
              {store.name}
            </span>
          </button>
        ))}
      </div>

      {activeStory && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center"
             onClick={closeStory}>
          <div className="relative w-full max-w-lg h-full md:h-auto md:max-h-[80vh] flex flex-col"
               onClick={(e) => e.stopPropagation()}>
            <div className="absolute top-0 left-0 right-0 p-4 z-10">
              <div className="w-full h-1 bg-white bg-opacity-30 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-white transition-all duration-100"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-3">
                  <img
                    src={activeStory.logo}
                    alt={activeStory.name}
                    className="w-10 h-10 rounded-full border-2 border-white"
                  />
                  <div>
                    <p className="text-white font-semibold">{activeStory.name}</p>
                    <p className="text-white text-xs opacity-80">{activeStory.category}</p>
                  </div>
                </div>
                <button 
                  onClick={closeStory}
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white hover:bg-white/10 transition-colors"
                  aria-label="Close"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="flex-1 flex items-center justify-center bg-gradient-to-b from-transparent via-black to-transparent">
              <div className="text-center p-8 max-w-md">
                <img
                  src={activeStory.image}
                  alt={activeStory.name}
                  className="w-full h-64 object-cover rounded-lg mb-6"
                />
                <h3 className="text-white text-2xl font-display font-bold mb-4">
                  {activeStory.promoTitle || 'Special Offer'}
                </h3>
                <p className="text-white text-lg mb-6">
                  {activeStory.promoDescription || 'Visit us for exclusive deals and new arrivals!'}
                </p>
                <div className="inline-block px-8 py-3 bg-gold text-navy font-semibold rounded-full">
                  {activeStory.promoDiscount || '20% OFF'}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
