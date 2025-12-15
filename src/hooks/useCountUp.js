import { useEffect, useState } from 'react'

export default function useCountUp(value, { durationMs = 900 } = {}) {
  const [display, setDisplay] = useState(value)

  useEffect(() => {
    const startValue = display
    const delta = value - startValue
    if (delta === 0) return

    const start = performance.now()
    let rafId = null

    const tick = (now) => {
      const t = Math.min(1, (now - start) / durationMs)
      setDisplay(Math.round(startValue + delta * t))

      if (t < 1) {
        rafId = requestAnimationFrame(tick)
      }
    }

    rafId = requestAnimationFrame(tick)

    return () => {
      if (rafId) cancelAnimationFrame(rafId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  return display
}
