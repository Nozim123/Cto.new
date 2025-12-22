import { useEffect, useState } from 'react'
import './NewYearAnimations.css'

const ORNAMENT_COLORS = ['#F6C453', '#E87979', '#60A5FA', '#34D399']

export default function NewYearAnimations() {
  const [showCountdown, setShowCountdown] = useState(false)
  const [ornaments, setOrnaments] = useState([])

  useEffect(() => {
    const ornamentsArray = Array.from({ length: 10 }, (_, i) => ({
      id: i,
      left: 18 + Math.random() * 64,
      top: 18 + Math.random() * 62,
      size: 5 + Math.random() * 6,
      delay: Math.random() * 2.5,
      color: ORNAMENT_COLORS[i % ORNAMENT_COLORS.length]
    }))
    setOrnaments(ornamentsArray)

    const now = new Date()
    const newYear = new Date(now.getFullYear() + 1, 0, 1)
    const daysUntilNewYear = Math.ceil((newYear - now) / (1000 * 60 * 60 * 24))
    if (daysUntilNewYear <= 30) setShowCountdown(true)
  }, [])

  return (
    <>
      <div className="fixed bottom-20 md:bottom-4 left-4 pointer-events-none z-20">
        <ChristmasTree ornaments={ornaments} />
      </div>

      {showCountdown ? <NewYearCountdown /> : null}
    </>
  )
}

function ChristmasTree({ ornaments }) {
  return (
    <div className="nye-tree" aria-hidden="true">
      <div className="nye-tree-label">Happy New Year</div>
      <div className="nye-tree-emoji">🎄</div>

      <div className="nye-tree-ornaments">
        {ornaments.map((o) => (
          <span
            key={o.id}
            className="nye-tree-ornament"
            style={{
              left: `${o.left}%`,
              top: `${o.top}%`,
              width: `${o.size}px`,
              height: `${o.size}px`,
              backgroundColor: o.color,
              animationDelay: `${o.delay}s`
            }}
          />
        ))}
      </div>

      <div className="nye-tree-sparkles" aria-hidden="true">
        {[...Array(6)].map((_, i) => (
          <span
            key={`sparkle-${i}`}
            className="nye-sparkle"
            style={{
              left: `${10 + Math.random() * 80}%`,
              top: `${5 + Math.random() * 80}%`,
              animationDelay: `${Math.random() * 4}s`
            }}
          />
        ))}
      </div>
    </div>
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
    const timer = window.setInterval(() => {
      setTimeLeft(getTimeUntilNewYear())
    }, 1000)

    return () => window.clearInterval(timer)
  }, [])

  if (timeLeft.days > 30) return null

  return (
    <div className="fixed bottom-20 md:bottom-4 right-4 z-30 pointer-events-none">
      <div className="nye-countdown">
        <div className="nye-countdown-title">New Year</div>
        <div className="nye-countdown-grid">
          <TimePill value={timeLeft.days} label="D" />
          <span className="nye-countdown-sep">:</span>
          <TimePill value={timeLeft.hours} label="H" />
          <span className="nye-countdown-sep">:</span>
          <TimePill value={timeLeft.minutes} label="M" />
          <span className="nye-countdown-sep">:</span>
          <TimePill value={timeLeft.seconds} label="S" />
        </div>
      </div>
    </div>
  )
}

function TimePill({ value, label }) {
  return (
    <div className="nye-time">
      <div className="nye-time-value">{String(value).padStart(2, '0')}</div>
      <div className="nye-time-label">{label}</div>
    </div>
  )
}
