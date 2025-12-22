import { useState, useEffect, useRef } from 'react'
import { useTheme } from '../contexts/ThemeContext'
import { X, ChevronLeft, ChevronRight, Heart, Send, Bookmark } from 'lucide-react'

export default function InstagramStories({ stories, autoClose = true }) {
  const [activeStoryIndex, setActiveStoryIndex] = useState(null)
  const [progress, setProgress] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const { darkMode } = useTheme()
  const progressIntervalRef = useRef(null)
  const storyDuration = 5000 // 5 seconds per story

  const activeStory = activeStoryIndex !== null ? stories[activeStoryIndex] : null

  const startProgress = () => {
    setProgress(0)
    const increment = 100 / (storyDuration / 50)
    
    progressIntervalRef.current = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressIntervalRef.current)
          handleNext()
          return 0
        }
        return prev + increment
      })
    }, 50)
  }

  const stopProgress = () => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current)
    }
  }

  useEffect(() => {
    if (activeStoryIndex !== null && !isPaused) {
      startProgress()
    } else {
      stopProgress()
    }

    return () => stopProgress()
  }, [activeStoryIndex, isPaused])

  const handleStoryClick = (index) => {
    setActiveStoryIndex(index)
    setProgress(0)
  }

  const closeStory = () => {
    stopProgress()
    setActiveStoryIndex(null)
    setProgress(0)
  }

  const handleNext = () => {
    if (activeStoryIndex < stories.length - 1) {
      setActiveStoryIndex(activeStoryIndex + 1)
      setProgress(0)
    } else if (autoClose) {
      closeStory()
    }
  }

  const handlePrevious = () => {
    if (activeStoryIndex > 0) {
      setActiveStoryIndex(activeStoryIndex - 1)
      setProgress(0)
    }
  }

  const handlePause = () => {
    setIsPaused(true)
  }

  const handleResume = () => {
    setIsPaused(false)
  }

  return (
    <>
      {/* Stories Ring */}
      <div className="flex gap-4 overflow-x-auto pb-4 px-4 lg:px-8 scrollbar-hide snap-x snap-mandatory">
        {stories.map((story, index) => (
          <button
            key={story.id}
            onClick={() => handleStoryClick(index)}
            className="flex-shrink-0 flex flex-col items-center gap-2 group snap-start"
          >
            <div className="relative">
              {/* Instagram-style gradient ring */}
              <div className={`w-20 h-20 rounded-full p-[2px] bg-gradient-to-tr ${
                story.viewed 
                  ? 'from-gray-400 via-gray-300 to-gray-400' 
                  : 'from-purple-500 via-pink-500 to-yellow-500'
              } transform transition-all duration-300 group-hover:scale-110 group-active:scale-95`}>
                <div className={`w-full h-full rounded-full border-[3px] ${
                  darkMode ? 'border-gray-900' : 'border-white'
                } overflow-hidden bg-white`}>
                  <img
                    src={story.thumbnail}
                    alt={story.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              {/* Badge for active/promoted stories */}
              {story.isPromoted && (
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full 
                              flex items-center justify-center text-white text-xs font-bold border-2 border-white shadow-lg">
                  ⚡
                </div>
              )}
              {story.hasNew && !story.viewed && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white"></div>
              )}
            </div>
            <span className="text-xs font-medium max-w-[80px] truncate text-navy dark:text-cream">
              {story.title}
            </span>
          </button>
        ))}
      </div>

      {/* Story Viewer Modal */}
      {activeStory && (
        <div 
          className="fixed inset-0 z-[9999] bg-black flex items-center justify-center"
          onMouseDown={handlePause}
          onMouseUp={handleResume}
          onTouchStart={handlePause}
          onTouchEnd={handleResume}
        >
          {/* Progress bars */}
          <div className="absolute top-0 left-0 right-0 p-2 z-20 flex gap-1">
            {stories.map((_, index) => (
              <div key={index} className="flex-1 h-0.5 bg-white/30 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-white transition-all duration-100"
                  style={{ 
                    width: index < activeStoryIndex ? '100%' : 
                           index === activeStoryIndex ? `${progress}%` : '0%'
                  }}
                ></div>
              </div>
            ))}
          </div>

          {/* Header */}
          <div className="absolute top-4 left-0 right-0 px-4 z-20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={activeStory.thumbnail}
                  alt={activeStory.title}
                  className="w-10 h-10 rounded-full border-2 border-white"
                />
                <div>
                  <p className="text-white font-semibold text-sm">{activeStory.title}</p>
                  <p className="text-white/80 text-xs">{activeStory.timestamp || 'Just now'}</p>
                </div>
              </div>
              <button 
                onClick={closeStory}
                className="text-white hover:opacity-80 transition-opacity"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Story Content */}
          <div className="relative w-full max-w-lg h-full md:h-[90vh] flex flex-col bg-gradient-to-b from-black/50 via-transparent to-black/50">
            {/* Navigation areas */}
            <div className="absolute inset-0 flex">
              <button
                onClick={handlePrevious}
                className="flex-1 cursor-pointer focus:outline-none"
                disabled={activeStoryIndex === 0}
              >
                {activeStoryIndex > 0 && (
                  <ChevronLeft className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 text-white/70 hover:text-white transition-colors" />
                )}
              </button>
              <button
                onClick={handleNext}
                className="flex-1 cursor-pointer focus:outline-none"
              >
                {activeStoryIndex < stories.length - 1 && (
                  <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 text-white/70 hover:text-white transition-colors" />
                )}
              </button>
            </div>

            {/* Image/Video */}
            <div className="flex-1 flex items-center justify-center">
              {activeStory.type === 'video' ? (
                <video
                  src={activeStory.media}
                  className="w-full h-full object-contain"
                  autoPlay
                  muted
                  playsInline
                />
              ) : (
                <img
                  src={activeStory.media}
                  alt={activeStory.title}
                  className="w-full h-full object-contain"
                />
              )}
            </div>

            {/* Content overlay */}
            {activeStory.content && (
              <div className="absolute bottom-20 left-0 right-0 p-6">
                <div className="bg-gradient-to-t from-black/80 to-transparent p-6 rounded-t-2xl">
                  {activeStory.content.title && (
                    <h3 className="text-white text-2xl font-bold mb-2">
                      {activeStory.content.title}
                    </h3>
                  )}
                  {activeStory.content.description && (
                    <p className="text-white/90 text-sm mb-4">
                      {activeStory.content.description}
                    </p>
                  )}
                  {activeStory.content.cta && (
                    <button className="bg-white text-black px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors w-full">
                      {activeStory.content.cta}
                    </button>
                  )}
                  {activeStory.content.discount && (
                    <div className="inline-block px-6 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold rounded-full text-lg shadow-lg">
                      {activeStory.content.discount}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="absolute bottom-6 right-6 z-20 flex flex-col gap-4">
            <button className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors">
              <Heart className="w-6 h-6" />
            </button>
            <button className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors">
              <Send className="w-6 h-6" />
            </button>
            <button className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors">
              <Bookmark className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
    </>
  )
}
