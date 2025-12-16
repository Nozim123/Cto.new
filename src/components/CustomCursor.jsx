import { useEffect, useRef, useState } from 'react'

export default function CustomCursor() {
  const cursorRef = useRef(null)
  const cursorDotRef = useRef(null)
  const [isPointer, setIsPointer] = useState(false)
  const mousePos = useRef({ x: 0, y: 0 })
  const cursorPos = useRef({ x: 0, y: 0 })
  const dotPos = useRef({ x: 0, y: 0 })

  useEffect(() => {
    // Check if device supports hover (not touch-only)
    const hasHover = window.matchMedia('(hover: hover)').matches
    if (!hasHover) return

    const handleMouseMove = (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY }
    }

    const handleMouseOver = (e) => {
      const target = e.target
      if (
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.classList.contains('cursor-pointer') ||
        target.closest('button') ||
        target.closest('a')
      ) {
        setIsPointer(true)
      } else {
        setIsPointer(false)
      }
    }

    const animate = () => {
      // Smooth cursor follow with delay
      const ease = 0.15
      cursorPos.current.x += (mousePos.current.x - cursorPos.current.x) * ease
      cursorPos.current.y += (mousePos.current.y - cursorPos.current.y) * ease

      // Faster dot follow
      const dotEase = 0.3
      dotPos.current.x += (mousePos.current.x - dotPos.current.x) * dotEase
      dotPos.current.y += (mousePos.current.y - dotPos.current.y) * dotEase

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${cursorPos.current.x}px, ${cursorPos.current.y}px)`
      }

      if (cursorDotRef.current) {
        cursorDotRef.current.style.transform = `translate(${dotPos.current.x}px, ${dotPos.current.y}px)`
      }

      requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseover', handleMouseOver)
    animate()

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseover', handleMouseOver)
    }
  }, [])

  // Don't render on touch devices
  if (!window.matchMedia('(hover: hover)').matches) {
    return null
  }

  return (
    <>
      {/* Outer cursor ring */}
      <div
        ref={cursorRef}
        className={`fixed top-0 left-0 w-8 h-8 pointer-events-none z-[9999] transition-all duration-300 ${
          isPointer ? 'scale-150' : 'scale-100'
        }`}
        style={{
          transform: 'translate(-50%, -50%)',
          mixBlendMode: 'difference',
        }}
      >
        <div className="w-full h-full rounded-full border-2 border-white opacity-50" />
      </div>

      {/* Inner cursor dot */}
      <div
        ref={cursorDotRef}
        className="fixed top-0 left-0 w-2 h-2 bg-white rounded-full pointer-events-none z-[9999]"
        style={{
          transform: 'translate(-50%, -50%)',
          mixBlendMode: 'difference',
        }}
      />
    </>
  )
}
