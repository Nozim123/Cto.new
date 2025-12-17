import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export default function Snowflake({ id, size = 3, fallDuration = 8, delay = 0 }) {
  const flakeRef = useRef(null)

  useEffect(() => {
    const flake = flakeRef.current
    if (!flake) return

    const tl = gsap.timeline({ repeat: -1, delay })

    // Start position
    gsap.set(flake, {
      x: Math.random() * window.innerWidth,
      y: -20,
      rotation: 0,
      opacity: Math.random() * 0.8 + 0.2,
      scale: size / 3
    })

    // Falling animation with sway
    tl.to(flake, {
      y: window.innerHeight + 50,
      x: `+=${Math.random() * 100 - 50}`, // Random horizontal movement
      rotation: Math.random() * 360,
      duration: fallDuration,
      ease: "power1.in",
      onComplete: () => {
        // Reset position
        gsap.set(flake, {
          x: Math.random() * window.innerWidth,
          y: -20,
          rotation: 0
        })
      }
    })

    // Gentle swaying motion
    gsap.to(flake, {
      x: `+=${Math.sin(Math.random() * Math.PI * 2) * 20}`,
      duration: Math.random() * 2 + 1,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    })

    return () => {
      tl.kill()
      gsap.killTweensOf(flake)
    }
  }, [size, fallDuration, delay])

  return (
    <div
      ref={flakeRef}
      className="fixed pointer-events-none text-white select-none"
      style={{
        textShadow: '0 0 6px rgba(255,255,255,0.7)',
        zIndex: 1,
        fontSize: `${size}px`,
        willChange: 'transform'
      }}
    >
      ❄
    </div>
  )
}

export function SnowSystem({ count = 50, enabled = true }) {
  if (!enabled) return null

  const snowflakes = Array.from({ length: count }, (_, i) => (
    <Snowflake
      key={i}
      size={Math.random() * 4 + 2}
      fallDuration={Math.random() * 10 + 8}
      delay={Math.random() * 5}
    />
  ))

  return (
    <div 
      className="fixed inset-0 pointer-events-none z-1 overflow-hidden"
      style={{ 
        background: 'linear-gradient(to bottom, rgba(30, 41, 59, 0.1) 0%, rgba(30, 41, 59, 0.05) 50%, transparent 100%)'
      }}
    >
      {snowflakes}
    </div>
  )
}

export function PremiumSnowSystem({ count = 100, enabled = true }) {
  const canvasRef = useRef(null)
  const animationRef = useRef(null)
  const flakesRef = useRef([])

  useEffect(() => {
    if (!enabled || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const flakes = []

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const createFlake = () => ({
      x: Math.random() * canvas.width,
      y: -10,
      size: Math.random() * 4 + 2,
      speed: Math.random() * 2 + 1,
      drift: Math.random() * 0.5 + 0.1,
      rotation: 0,
      rotationSpeed: (Math.random() - 0.5) * 0.1,
      opacity: Math.random() * 0.8 + 0.2,
      shape: Math.random() > 0.7 ? 'star' : 'circle' // Some star-shaped flakes
    })

    const drawFlake = (flake) => {
      ctx.save()
      ctx.translate(flake.x, flake.y)
      ctx.rotate(flake.rotation)
      ctx.globalAlpha = flake.opacity

      if (flake.shape === 'star') {
        // Draw star shape
        ctx.fillStyle = '#ffffff'
        ctx.beginPath()
        for (let i = 0; i < 5; i++) {
          const angle = (i * Math.PI * 2) / 5
          const x = Math.cos(angle) * flake.size
          const y = Math.sin(angle) * flake.size
          if (i === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
          
          const innerAngle = ((i + 0.5) * Math.PI * 2) / 5
          const innerX = Math.cos(innerAngle) * flake.size * 0.5
          const innerY = Math.sin(innerAngle) * flake.size * 0.5
          ctx.lineTo(innerX, innerY)
        }
        ctx.closePath()
        ctx.fill()
      } else {
        // Draw circle with glow
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, flake.size * 2)
        gradient.addColorStop(0, '#ffffff')
        gradient.addColorStop(0.7, 'rgba(255, 255, 255, 0.3)')
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
        
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(0, 0, flake.size * 2, 0, Math.PI * 2)
        ctx.fill()
      }

      ctx.restore()
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      flakes.forEach((flake, index) => {
        flake.y += flake.speed
        flake.x += Math.sin(flake.y * 0.01) * flake.drift
        flake.rotation += flake.rotationSpeed

        if (flake.y > canvas.height + 20) {
          flakes[index] = createFlake()
        }

        drawFlake(flake)
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    // Initialize flakes
    resizeCanvas()
    for (let i = 0; i < count; i++) {
      flakes.push(createFlake())
    }
    flakesRef.current = flakes

    // Mouse interaction
    let mouseX = 0
    const handleMouseMove = (e) => {
      mouseX = e.clientX
    }

    // Wind effect based on mouse position
    const addWindEffect = () => {
      flakes.forEach(flake => {
        const wind = (mouseX / window.innerWidth - 0.5) * 0.5
        flake.x += wind
      })
    }

    window.addEventListener('resize', resizeCanvas)
    window.addEventListener('mousemove', handleMouseMove)

    animate()

    const windInterval = setInterval(addWindEffect, 50)

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      window.removeEventListener('mousemove', handleMouseMove)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      clearInterval(windInterval)
    }
  }, [enabled, count])

  if (!enabled) return null

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-1"
      style={{ background: 'transparent' }}
    />
  )
}