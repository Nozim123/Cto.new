import { useEffect, useRef, useState } from 'react'

export function useScrollReveal(options = {}) {
  const {
    threshold = 0.1,
    rootMargin = '0px',
    triggerOnce = true,
  } = options

  const [isVisible, setIsVisible] = useState(false)
  const elementRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          if (triggerOnce && elementRef.current) {
            observer.unobserve(elementRef.current)
          }
        } else if (!triggerOnce) {
          setIsVisible(false)
        }
      },
      {
        threshold,
        rootMargin,
      }
    )

    const currentElement = elementRef.current
    if (currentElement) {
      observer.observe(currentElement)
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement)
      }
    }
  }, [threshold, rootMargin, triggerOnce])

  return [elementRef, isVisible]
}

export function useParallax(speed = 0.5) {
  const [offsetY, setOffsetY] = useState(0)
  const elementRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => {
      if (elementRef.current) {
        const rect = elementRef.current.getBoundingClientRect()
        const scrolled = window.pageYOffset
        const elementTop = rect.top + scrolled
        const elementVisible = rect.top < window.innerHeight && rect.bottom > 0

        if (elementVisible) {
          setOffsetY((scrolled - elementTop) * speed)
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Initial call

    return () => window.removeEventListener('scroll', handleScroll)
  }, [speed])

  return [elementRef, offsetY]
}
