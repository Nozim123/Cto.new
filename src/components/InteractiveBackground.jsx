import { useEffect, useRef, useState } from 'react'
import { useTheme } from '../contexts/ThemeContext'

export default function InteractiveBackground() {
  const canvasRef = useRef(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const particlesRef = useRef([])
  const animationFrameRef = useRef(null)
  const { darkMode, season } = useTheme()
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  // Season-based color schemes
  const getSeasonalColors = () => {
    switch (season) {
      case 'spring':
        return {
          particles: ['rgba(255, 182, 193, 0.4)', 'rgba(144, 238, 144, 0.4)', 'rgba(173, 216, 230, 0.4)'],
          glow: 'rgba(255, 182, 193, 0.2)'
        }
      case 'summer':
        return {
          particles: ['rgba(255, 215, 0, 0.4)', 'rgba(255, 165, 0, 0.4)', 'rgba(255, 99, 71, 0.4)'],
          glow: 'rgba(255, 215, 0, 0.2)'
        }
      case 'autumn':
        return {
          particles: ['rgba(255, 140, 0, 0.4)', 'rgba(210, 105, 30, 0.4)', 'rgba(178, 34, 34, 0.4)'],
          glow: 'rgba(255, 140, 0, 0.2)'
        }
      case 'winter':
        return {
          particles: ['rgba(173, 216, 230, 0.4)', 'rgba(176, 224, 230, 0.4)', 'rgba(240, 248, 255, 0.4)'],
          glow: 'rgba(173, 216, 230, 0.2)'
        }
      default:
        return {
          particles: ['rgba(139, 92, 246, 0.4)', 'rgba(196, 181, 253, 0.4)', 'rgba(167, 139, 250, 0.4)'],
          glow: 'rgba(139, 92, 246, 0.2)'
        }
    }
  }

  class Particle {
    constructor(canvas) {
      this.canvas = canvas
      this.reset()
      this.y = Math.random() * canvas.height
      this.opacity = Math.random() * 0.5 + 0.2
    }

    reset() {
      const colors = getSeasonalColors()
      this.x = Math.random() * this.canvas.width
      this.y = -10
      this.baseX = this.x
      this.baseY = this.y
      this.size = Math.random() * 4 + 2
      this.speedX = (Math.random() - 0.5) * 0.5
      this.speedY = Math.random() * 0.3 + 0.1
      this.color = colors.particles[Math.floor(Math.random() * colors.particles.length)]
      this.layer = Math.random() * 3 + 1 // Depth layer (1-4)
      this.angle = Math.random() * Math.PI * 2
      this.angleSpeed = (Math.random() - 0.5) * 0.02
      this.pulseSpeed = Math.random() * 0.02 + 0.01
      this.pulsePhase = Math.random() * Math.PI * 2
    }

    update(mouse) {
      // Parallax effect based on mouse position and depth layer
      const dx = (mouse.x - this.canvas.width / 2) * 0.01 * this.layer
      const dy = (mouse.y - this.canvas.height / 2) * 0.01 * this.layer
      
      // Smooth interpolation
      this.x += (this.baseX + dx - this.x) * 0.05
      this.y += (this.baseY + dy - this.y) * 0.05
      
      // Base movement
      this.baseX += this.speedX
      this.baseY += this.speedY
      
      // Orbital motion
      this.angle += this.angleSpeed
      this.baseX += Math.cos(this.angle) * 0.2
      
      // Pulsing effect
      this.pulsePhase += this.pulseSpeed
      this.currentSize = this.size + Math.sin(this.pulsePhase) * 0.5
      
      // Boundary check with wrapping
      if (this.baseY > this.canvas.height + 10) {
        this.reset()
      }
      if (this.baseX > this.canvas.width + 10) {
        this.baseX = -10
      } else if (this.baseX < -10) {
        this.baseX = this.canvas.width + 10
      }
    }

    draw(ctx) {
      const colors = getSeasonalColors()
      
      // Glow effect
      const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.currentSize * 3)
      gradient.addColorStop(0, this.color)
      gradient.addColorStop(0.5, colors.glow)
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')
      
      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(this.x, this.y, this.currentSize * 3, 0, Math.PI * 2)
      ctx.fill()
      
      // Core particle
      ctx.fillStyle = this.color
      ctx.beginPath()
      ctx.arc(this.x, this.y, this.currentSize, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d', { alpha: true })
    
    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      setDimensions({ width: canvas.width, height: canvas.height })
      
      // Reinitialize particles on resize
      const particleCount = Math.min(Math.floor((canvas.width * canvas.height) / 15000), 80)
      particlesRef.current = Array.from({ length: particleCount }, () => new Particle(canvas))
    }

    const handleMouseMove = (e) => {
      mouseRef.current = {
        x: e.clientX,
        y: e.clientY
      }
    }

    const animate = () => {
      if (!ctx || !canvas) return
      
      // Clear with fade effect for trails
      ctx.fillStyle = darkMode ? 'rgba(37, 40, 54, 0.1)' : 'rgba(244, 239, 231, 0.1)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      // Update and draw particles
      particlesRef.current.forEach(particle => {
        particle.update(mouseRef.current)
        particle.draw(ctx)
      })
      
      // Draw connections between nearby particles
      const maxDistance = 150
      particlesRef.current.forEach((particle, i) => {
        particlesRef.current.slice(i + 1).forEach(otherParticle => {
          const dx = particle.x - otherParticle.x
          const dy = particle.y - otherParticle.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          
          if (distance < maxDistance) {
            const opacity = (1 - distance / maxDistance) * 0.2
            ctx.strokeStyle = darkMode 
              ? `rgba(139, 92, 246, ${opacity})` 
              : `rgba(139, 92, 246, ${opacity * 0.5})`
            ctx.lineWidth = 0.5
            ctx.beginPath()
            ctx.moveTo(particle.x, particle.y)
            ctx.lineTo(otherParticle.x, otherParticle.y)
            ctx.stroke()
          }
        })
      })
      
      animationFrameRef.current = requestAnimationFrame(animate)
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    window.addEventListener('mousemove', handleMouseMove)
    animate()

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [darkMode, season])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{
        background: darkMode 
          ? 'rgba(37, 40, 54, 1)' 
          : 'rgba(244, 239, 231, 1)',
        willChange: 'transform',
      }}
    />
  )
}
