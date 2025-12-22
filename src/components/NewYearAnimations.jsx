import { useEffect, useState } from 'react'
import './NewYearAnimations.css'

export default function NewYearAnimations() {
  const [fireworks, setFireworks] = useState([])
  const [confetti, setConfetti] = useState([])
  const [showCountdown, setShowCountdown] = useState(false)

  useEffect(() => {
    // Create fireworks
    const fireworksArray = Array.from({ length: 10 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 5
    }))
    setFireworks(fireworksArray)

    // Create confetti
    const confettiArray = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 3,
      duration: 3 + Math.random() * 2,
      color: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A'][Math.floor(Math.random() * 5)]
    }))
    setConfetti(confettiArray)

    // Check if we should show countdown (if close to New Year)
    const now = new Date()
    const newYear = new Date(now.getFullYear() + 1, 0, 1)
    const daysUntilNewYear = Math.ceil((newYear - now) / (1000 * 60 * 60 * 24))
    
    if (daysUntilNewYear <= 30) {
      setShowCountdown(true)
    }
  }, [])

  return (
    <>
      {/* Fireworks */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {fireworks.map((fw) => (
          <div
            key={fw.id}
            className="firework"
            style={{
              left: `${fw.left}%`,
              animationDelay: `${fw.delay}s`
            }}
          >
            <div className="firework-explosion"></div>
          </div>
        ))}
      </div>

      {/* Confetti */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {confetti.map((conf) => (
          <div
            key={conf.id}
            className="confetti"
            style={{
              left: `${conf.left}%`,
              animationDelay: `${conf.delay}s`,
              animationDuration: `${conf.duration}s`,
              backgroundColor: conf.color
            }}
          ></div>
        ))}
      </div>

      {/* Floating ornaments */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="ornament ornament-1">🎄</div>
        <div className="ornament ornament-2">⭐</div>
        <div className="ornament ornament-3">🎁</div>
        <div className="ornament ornament-4">❄️</div>
        <div className="ornament ornament-5">🎊</div>
        <div className="ornament ornament-6">🎉</div>
      </div>

      {/* New Year Badge */}
      <div className="fixed top-20 right-4 z-50 animate-bounce-slow">
        <div className="bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 text-white px-6 py-3 rounded-full shadow-2xl border-2 border-white">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎆</span>
            <div>
              <div className="text-xs font-bold uppercase">Happy New Year</div>
              <div className="text-lg font-black">{new Date().getFullYear() + 1}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Countdown Timer (if close to New Year) */}
      {showCountdown && <NewYearCountdown />}
    </>
  )
}

function NewYearCountdown() {
  const [timeLeft, setTimeLeft] = useState(getTimeUntilNewYear())

  function getTimeUntilNewYear() {
    const now = new Date()
    const newYear = new Date(now.getFullYear() + 1, 0, 1)
    const diff = newYear - now

    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60)
    }
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeUntilNewYear())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  if (timeLeft.days > 30) return null

  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 animate-pulse-slow">
      <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 backdrop-blur-xl rounded-2xl shadow-2xl border-2 border-gold p-6">
        <div className="text-center text-white">
          <div className="text-xs font-bold uppercase tracking-wider mb-2 text-gold">
            🎊 New Year Countdown 🎊
          </div>
          <div className="flex gap-4 justify-center">
            <div className="flex flex-col items-center">
              <div className="text-3xl font-black text-gold">{timeLeft.days}</div>
              <div className="text-xs uppercase">Days</div>
            </div>
            <div className="text-3xl font-black text-gold">:</div>
            <div className="flex flex-col items-center">
              <div className="text-3xl font-black text-gold">{timeLeft.hours}</div>
              <div className="text-xs uppercase">Hours</div>
            </div>
            <div className="text-3xl font-black text-gold">:</div>
            <div className="flex flex-col items-center">
              <div className="text-3xl font-black text-gold">{timeLeft.minutes}</div>
              <div className="text-xs uppercase">Min</div>
            </div>
            <div className="text-3xl font-black text-gold">:</div>
            <div className="flex flex-col items-center">
              <div className="text-3xl font-black text-gold">{timeLeft.seconds}</div>
              <div className="text-xs uppercase">Sec</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
