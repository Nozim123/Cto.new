import { useEffect, useState } from 'react'

export default function AnimatedCounter({ value = 0, durationMs = 900, className = '' }) {
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    let raf
    const from = Number(display) || 0
    const to = Number(value) || 0
    const start = performance.now()

    const tick = (now) => {
      const t = Math.min(1, (now - start) / durationMs)
      const eased = 1 - Math.pow(1 - t, 3)
      setDisplay(Math.round(from + (to - from) * eased))
      if (t < 1) raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  return <span className={className}>{display}</span>
}
