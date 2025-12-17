import React, { useEffect, useRef, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../contexts/ThemeContext'
import { useLanguage } from '../contexts/LanguageContext'
import Button3D from '../components/Button3D'
import InteractiveCounter from '../components/AnimatedCounter'
import { SnowSystem, PremiumSnowSystem } from '../components/SnowSystem'
import { gsap } from 'gsap'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
gsap.registerPlugin(ScrollToPlugin)
import * as THREE from 'three'

export default function VirtualTourPage() {
  const navigate = useNavigate()
  const { darkMode, season } = useTheme()
  const { t } = useLanguage()
  const [isMobile, setIsMobile] = useState(false)
  const [tourStep, setTourStep] = useState(0)

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Initialize GSAP animations
  useEffect(() => {
    // GSAP animations are handled separately below
  }, [])

  // GSAP Page Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero section animation
      gsap.fromTo('.tour-hero', 
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, ease: 'power3.out' }
      )

      // Content sections stagger animation
      gsap.fromTo('.tour-section',
        { y: 50, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 0.8, 
          ease: 'power2.out',
          stagger: 0.2,
          delay: 0.3
        }
      )

      // Counter animation on scroll
      const counters = document.querySelectorAll('.animated-counter')
      counters.forEach((counter, index) => {
        gsap.fromTo(counter,
          { scale: 0.8, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.6,
            ease: 'back.out(1.7)',
            delay: 0.5 + index * 0.1,
            scrollTrigger: {
              trigger: counter,
              start: 'top 80%',
              toggleActions: 'play none none reverse'
            }
          }
        )
      })
    })

    return () => ctx.revert()
  }, [])

  const tourSteps = [
    {
      id: 0,
      title: t('virtualTour.welcome.title') || 'Virtual Tourga Xush Kelibsiz',
      description: t('virtualTour.welcome.description') || 'Mega Travel Center bilan tanishishni boshlashingizga yordam beramiz',
      icon: '🏢'
    },
    {
      id: 1,
      title: t('virtualTour.spaces.title') || 'Fazolar',
      description: t('virtualTour.spaces.description') || 'Bizning katta savdo markazlarimizni o\'rganing',
      icon: '🗺️'
    },
    {
      id: 2,
      title: t('virtualTour.services.title') || 'Xizmatlar',
      description: t('virtualTour.services.description') || 'Ko\'plab xizmatlar va imkoniyatlar',
      icon: '🛍️'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary to-secondary dark:from-primary dark:to-secondary relative overflow-hidden">
      
      {/* Snow Systems - Using the recommended technology stack */}
      {isMobile ? (
        <SnowSystem count={30} enabled={season === 'winter'} />
      ) : (
        <PremiumSnowSystem count={100} enabled={season === 'winter'} />
      )}

      {/* Winter overlay effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900/10 via-transparent to-white/5 pointer-events-none z-1" />

      {/* Main Content */}
      <div className="relative z-10">
        
        {/* Header */}
        <div className="tour-hero container mx-auto px-4 py-8 text-center">
          <div className="glass rounded-2xl p-8 backdrop-blur-lg bg-white/10 dark:bg-black/20">
            <h1 className="text-4xl md:text-6xl font-bold gradient-text mb-4">
              ❄️ Virtual Tour
            </h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8">
              {t('virtualTour.subtitle') || 'Mega Travel Center ni chuqur o\'rganing'}
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <Button3D
                variant="accent"
                onClick={() => setTourStep(1)}
                className="text-sm md:text-base"
              >
                🎯 Tour boshlash
              </Button3D>
              
              <Button3D
                variant="outline"
                onClick={() => navigate('/')}
                className="text-sm md:text-base"
              >
                🏠 Bosh sahifaga qaytish
              </Button3D>
            </div>
          </div>
        </div>

        {/* Tour Statistics */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {[
              { number: 50, label: 'Savdo markazi', suffix: '+' },
              { number: 500, label: 'Do\'kon', suffix: '+' },
              { number: 1000, label: 'Mahsulot', suffix: '+' },
              { number: 100, label: 'Xizmat', suffix: '+' }
            ].map((stat, index) => (
              <div key={index} className="tour-section">
                <div className="glass rounded-xl p-6 text-center backdrop-blur-lg bg-white/10 dark:bg-black/20">
                  <div className="animated-counter text-3xl md:text-4xl font-bold gradient-text mb-2">
                    <AnimatedCounter 
                      end={stat.number} 
                      suffix={stat.suffix}
                      duration={2000}
                    />
                  </div>
                  <p className="text-sm md:text-base text-gray-600 dark:text-gray-300">
                    {stat.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tour Steps */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-3 gap-8">
            {tourSteps.map((step, index) => (
              <div key={step.id} className="tour-section">
                <div className="glass rounded-xl p-6 backdrop-blur-lg bg-white/10 dark:bg-black/20 hover:bg-white/20 dark:hover:bg-black/30 transition-all duration-300 cursor-pointer"
                     onClick={() => setTourStep(step.id)}>
                  <div className="text-4xl mb-4 text-center">{step.icon}</div>
                  <h3 className="text-xl font-bold text-center mb-4 gradient-text">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-center text-sm md:text-base">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Elements */}
        <div className="container mx-auto px-4 py-12">
          <div className="tour-section">
            <div className="glass rounded-2xl p-8 backdrop-blur-lg bg-white/10 dark:bg-black/20">
              <h2 className="text-2xl md:text-3xl font-bold gradient-text text-center mb-8">
                ❄️ Qishgi Favqulodda Tajriba
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-gold">
                    Premium Animatsiya Texnologiyalari
                  </h3>
                  <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                    <li className="flex items-center">
                      <span className="text-gold mr-2">✨</span>
                      Three.js - 3D qor effektlari
                    </li>
                    <li className="flex items-center">
                      <span className="text-gold mr-2">⚡</span>
                      GSAP - Silliq animatsiyalar
                    </li>
                    <li className="flex items-center">
                      <span className="text-gold mr-2">📱</span>
                      CSS - Mobil optimizatsiya
                    </li>
                    <li className="flex items-center">
                      <span className="text-gold mr-2">🎮</span>
                      Mouse Interaction - Parallax
                    </li>
                  </ul>
                </div>
                
                <div className="text-center">
                  <Button3D
                    variant="primary"
                    size="large"
                    onClick={() => {
                      gsap.to(window, {
                        duration: 1,
                        scrollTo: { y: 0, smooth: true },
                        ease: 'power2.inOut'
                      })
                    }}
                    className="w-full md:w-auto"
                  >
                    🔝 Tepaga qaytish
                  </Button3D>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Winter Scene Description */}
        <div className="container mx-auto px-4 py-8">
          <div className="tour-section">
            <div className="text-center">
              <div className="glass rounded-xl p-6 backdrop-blur-lg bg-white/10 dark:bg-black/20 inline-block">
                <h3 className="text-lg font-semibold gradient-text mb-4">
                  🏆 Texnologiyalar Kombinatsiyasi
                </h3>
                <div className="flex flex-wrap justify-center gap-4 text-sm">
                  <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full">
                    Desktop: Three.js
                  </span>
                  <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full">
                    Mobile: CSS
                  </span>
                  <span className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full">
                    Interactions: GSAP
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Winter Effect Overlay */}
      <div className="fixed inset-0 pointer-events-none z-5">
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-blue-100/5 to-white/10" />
      </div>
    </div>
  )
}