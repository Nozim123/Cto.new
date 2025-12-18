import { useEffect, useRef, useState } from 'react'
import { useTheme } from '../contexts/ThemeContext'

const isNewYearWindow = (date) => {
  const month = date.getMonth() // 0=Jan
  const day = date.getDate()

  if (month === 11) return day >= 15
  if (month === 0) return day <= 10
  return false
}

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)]

export default function NewYearEntrance() {
  const { season } = useTheme()
  const canvasRef = useRef(null)
  const rafRef = useRef(null)
  const timeoutsRef = useRef([])

  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const now = new Date()
    if (season !== 'winter') return
    if (!isNewYearWindow(now)) return

    if (typeof window === 'undefined') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const key = 'mtc_new_year_intro_shown'
    if (window.sessionStorage.getItem(key)) return
    window.sessionStorage.setItem(key, '1')

    setEnabled(true)
  }, [season])

  useEffect(() => {
    if (!enabled) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const colors = ['#0EA5E9', '#38BDF8', '#7DD3FC', '#14B8A6', '#FFFFFF']

    const particles = []

    const resize = () => {
      const dpr = Math.max(1, window.devicePixelRatio || 1)
      canvas.width = Math.floor(window.innerWidth * dpr)
      canvas.height = Math.floor(window.innerHeight * dpr)
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const spawnConfetti = (count = 120) => {
      for (let i = 0; i < count; i += 1) {
        particles.push({
          kind: 'confetti',
          x: Math.random() * window.innerWidth,
          y: -20 - Math.random() * window.innerHeight * 0.2,
          w: 6 + Math.random() * 6,
          h: 10 + Math.random() * 10,
          vx: (Math.random() - 0.5) * 1.4,
          vy: 1.6 + Math.random() * 3.2,
          rot: Math.random() * Math.PI,
          vr: (Math.random() - 0.5) * 0.2,
          color: pick(colors),
          life: 1
        })
      }
    }

    const spawnFirework = (x, y, count = 90) => {
      for (let i = 0; i < count; i += 1) {
        const angle = Math.random() * Math.PI * 2
        const speed = 1.2 + Math.random() * 4.2
        particles.push({
          kind: 'spark',
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          radius: 1.2 + Math.random() * 1.8,
          color: pick(colors),
          life: 1,
          decay: 0.012 + Math.random() * 0.02
        })
      }
    }

    resize()

    spawnConfetti(140)

    const burst = (delay) => {
      const t = window.setTimeout(() => {
        spawnFirework(
          window.innerWidth * (0.2 + Math.random() * 0.6),
          window.innerHeight * (0.12 + Math.random() * 0.35),
          100
        )
      }, delay)
      timeoutsRef.current.push(t)
    }

    burst(200)
    burst(850)
    burst(1500)

    const start = performance.now()
    const duration = 4200

    const tick = (now) => {
      const elapsed = now - start
      const fadeStart = duration * 0.72
      const alpha = elapsed < fadeStart ? 1 : Math.max(0, 1 - (elapsed - fadeStart) / (duration - fadeStart))

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
      ctx.globalAlpha = alpha

      for (let i = particles.length - 1; i >= 0; i -= 1) {
        const p = particles[i]

        if (p.kind === 'confetti') {
          p.x += p.vx
          p.y += p.vy
          p.rot += p.vr

          if (p.y > window.innerHeight + 40) {
            particles.splice(i, 1)
            continue
          }

          ctx.save()
          ctx.translate(p.x, p.y)
          ctx.rotate(p.rot)
          ctx.fillStyle = p.color
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h)
          ctx.restore()
          continue
        }

        if (p.kind === 'spark') {
          p.vx *= 0.985
          p.vy = p.vy * 0.985 + 0.03
          p.x += p.vx
          p.y += p.vy
          p.life -= p.decay

          if (p.life <= 0) {
            particles.splice(i, 1)
            continue
          }

          ctx.beginPath()
          ctx.fillStyle = p.color
          ctx.globalAlpha = alpha * p.life
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
          ctx.fill()
          ctx.globalAlpha = alpha
        }
      }

      if (elapsed < duration && particles.length > 0) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        setEnabled(false)
      }
    }

    rafRef.current = requestAnimationFrame(tick)
    window.addEventListener('resize', resize)

    return () => {
      window.removeEventListener('resize', resize)
      timeoutsRef.current.forEach((t) => window.clearTimeout(t))
      timeoutsRef.current = []
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [enabled])

  if (!enabled) return null

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-[55]" aria-hidden="true" />
