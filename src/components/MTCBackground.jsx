import { useEffect, useRef } from 'react'

/**
 * MTC Premium Background Animation System
 * 
 * Features:
 * - Subtle particle system with mouse parallax
 * - Winter snow effect (seasonal)
 * - Canvas-based for optimal performance
 * - Responsive to screen size
 * - Non-intrusive, premium feel
 */

export default function MTCBackground() {
  const canvasRef = useRef(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const particlesRef = useRef([])
  const snowflakesRef = useRef([])
  const animationRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    let width, height

    // Set canvas size
    const resize = () => {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width
      canvas.height = height
    }

    resize()
    window.addEventListener('resize', resize)

    // Mouse movement tracking with parallax
    const handleMouseMove = (e) => {
      mouseRef.current = {
        x: (e.clientX / width - 0.5) * 2,
        y: (e.clientY / height - 0.5) * 2
      }
    }

    window.addEventListener('mousemove', handleMouseMove)

    // Initialize particles (subtle glowing orbs)
    const particleCount = window.innerWidth < 768 ? 20 : 40
    particlesRef.current = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2 + 1,
      speedX: (Math.random() - 0.5) * 0.2,
      speedY: (Math.random() - 0.5) * 0.2,
      opacity: Math.random() * 0.3 + 0.1,
      pulse: Math.random() * Math.PI * 2
    }))

    // Initialize snowflakes (winter theme)
    const snowCount = window.innerWidth < 768 ? 30 : 60
    snowflakesRef.current = Array.from({ length: snowCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height - height,
      size: Math.random() * 2 + 1,
      speedY: Math.random() * 0.5 + 0.3,
      speedX: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.5 + 0.2,
      rotation: Math.random() * Math.PI * 2
    }))

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, width, height)

      // Draw subtle gradient background
      const gradient = ctx.createRadialGradient(
        width / 2 + mouseRef.current.x * 50,
        height / 2 + mouseRef.current.y * 50,
        0,
        width / 2,
        height / 2,
        width
      )
      gradient.addColorStop(0, 'rgba(59, 130, 246, 0.03)')
      gradient.addColorStop(0.5, 'rgba(168, 85, 247, 0.02)')
      gradient.addColorStop(1, 'rgba(37, 40, 54, 0)')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, width, height)

      // Update and draw particles (glowing orbs)
      particlesRef.current.forEach((particle, index) => {
        // Parallax effect based on mouse
        const parallaxX = mouseRef.current.x * particle.size * 20
        const parallaxY = mouseRef.current.y * particle.size * 20

        // Pulse effect
        particle.pulse += 0.02
        const pulseOpacity = particle.opacity + Math.sin(particle.pulse) * 0.1

        // Draw particle
        ctx.beginPath()
        ctx.arc(
          particle.x + parallaxX,
          particle.y + parallaxY,
          particle.size,
          0,
          Math.PI * 2
        )
        ctx.fillStyle = `rgba(147, 197, 253, ${pulseOpacity})`
        ctx.fill()

        // Add glow effect
        ctx.beginPath()
        ctx.arc(
          particle.x + parallaxX,
          particle.y + parallaxY,
          particle.size * 3,
          0,
          Math.PI * 2
        )
        const glowGradient = ctx.createRadialGradient(
          particle.x + parallaxX,
          particle.y + parallaxY,
          0,
          particle.x + parallaxX,
          particle.y + parallaxY,
          particle.size * 3
        )
        glowGradient.addColorStop(0, `rgba(147, 197, 253, ${pulseOpacity * 0.5})`)
        glowGradient.addColorStop(1, 'rgba(147, 197, 253, 0)')
        ctx.fillStyle = glowGradient
        ctx.fill()

        // Move particle slowly
        particle.x += particle.speedX
        particle.y += particle.speedY

        // Wrap around edges
        if (particle.x < 0) particle.x = width
        if (particle.x > width) particle.x = 0
        if (particle.y < 0) particle.y = height
        if (particle.y > height) particle.y = 0
      })

      // Update and draw snowflakes (winter theme)
      snowflakesRef.current.forEach((snowflake) => {
        // Draw snowflake
        ctx.save()
        ctx.translate(snowflake.x, snowflake.y)
        ctx.rotate(snowflake.rotation)

        // Snowflake shape (simple circle for performance)
        ctx.beginPath()
        ctx.arc(0, 0, snowflake.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${snowflake.opacity})`
        ctx.fill()

        // Add slight glow to snowflakes
        ctx.shadowBlur = 5
        ctx.shadowColor = `rgba(255, 255, 255, ${snowflake.opacity})`
        ctx.fill()

        ctx.restore()

        // Move snowflake
        snowflake.y += snowflake.speedY
        snowflake.x += snowflake.speedX + Math.sin(snowflake.y * 0.01) * 0.3
        snowflake.rotation += 0.01

        // Reset when off screen
        if (snowflake.y > height + 10) {
          snowflake.y = -10
          snowflake.x = Math.random() * width
        }
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    // Cleanup
    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', handleMouseMove)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{
        opacity: 0.6,
        mixBlendMode: 'screen'
      }}
    />
  )
}
