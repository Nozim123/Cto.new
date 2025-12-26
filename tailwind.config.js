/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        navy: '#2C3E50',
        gold: '#D4AF37',
        cream: '#F4EFE7',
        sage: '#8FA89A',
        accent: '#E8B4B8',
        primary: 'rgba(37, 40, 54, 1)',
        
        // MTC Design System Colors
        mtc: {
          bg: 'rgba(37, 40, 54, 1)',
          text: {
            primary: '#FFFFFF',
            secondary: 'rgba(255, 255, 255, 0.7)',
            tertiary: 'rgba(255, 255, 255, 0.5)',
          },
          electric: {
            blue: '#3B82F6',
            blueDark: '#2563EB',
          },
          emerald: {
            400: '#34D399',
            500: '#10B981',
            600: '#059669',
          },
          gold: {
            400: '#FBBF24',
            500: '#F59E0B',
            600: '#D97706',
          },
          glass: {
            bg: 'rgba(255, 255, 255, 0.08)',
            border: 'rgba(255, 255, 255, 0.1)',
            shadow: 'rgba(0, 0, 0, 0.3)',
          },
        },
        
        purple: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7c3aed',
          800: '#6b21a8',
          900: '#581c87',
        },
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        body: ['Inter', 'sans-serif'],
        alt: ['Lato', 'sans-serif'],
      },
      screens: {
        'sm': '375px',
        'md': '768px',
        'lg': '1200px',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'fade-in-down': 'fadeInDown 0.6s ease-out',
        'slide-in-left': 'slideInLeft 0.5s ease-out',
        'slide-in-right': 'slideInRight 0.5s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-down': 'slideDown 0.4s ease-out',
        'bounce-in': 'bounceIn 0.6s ease-out',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'spin-slow': 'spin 3s linear infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'wave': 'wave 2s ease-in-out infinite',
        'morph': 'morph 8s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'tilt': 'tilt 10s ease-in-out infinite',
        
        // MTC Premium Animations
        'mtc-float': 'mtcFloat 8s ease-in-out infinite',
        'mtc-pulse-glow': 'mtcPulseGlow 3s ease-in-out infinite',
        'mtc-shimmer': 'mtcShimmer 2s linear infinite',
        'mtc-slide-up': 'mtcSlideUp 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        'mtc-scale-in': 'mtcScaleIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        'mtc-snowfall': 'mtcSnowfall 15s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        bounceIn: {
          '0%': { opacity: '0', transform: 'scale(0.3)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        pulseGlow: {
          '0%, 100%': { 
            'box-shadow': '0 0 20px rgba(168, 85, 247, 0.4), 0 0 40px rgba(168, 85, 247, 0.2)' 
          },
          '50%': { 
            'box-shadow': '0 0 30px rgba(168, 85, 247, 0.6), 0 0 60px rgba(168, 85, 247, 0.3)' 
          },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        shimmer: {
          '0%': { 'background-position': '-200% 0' },
          '100%': { 'background-position': '200% 0' },
        },
        wave: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(5deg)' },
          '75%': { transform: 'rotate(-5deg)' },
        },
        morph: {
          '0%, 100%': { 
            'border-radius': '60% 40% 30% 70%/60% 30% 70% 40%' 
          },
          '50%': { 
            'border-radius': '30% 60% 70% 40%/50% 60% 30% 60%' 
          },
        },
        glow: {
          '0%': { 'box-shadow': '0 0 20px rgba(168, 85, 247, 0.5)' },
          '100%': { 'box-shadow': '0 0 40px rgba(168, 85, 247, 0.8)' },
        },
        tilt: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(2deg)' },
          '50%': { transform: 'rotate(0deg)' },
          '75%': { transform: 'rotate(-2deg)' },
        },
        
        // MTC Premium Animation Keyframes
        mtcFloat: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-15px)' },
        },
        mtcPulseGlow: {
          '0%, 100%': { 
            'box-shadow': '0 0 20px rgba(59, 130, 246, 0.3), 0 0 40px rgba(59, 130, 246, 0.2)' 
          },
          '50%': { 
            'box-shadow': '0 0 30px rgba(59, 130, 246, 0.5), 0 0 60px rgba(59, 130, 246, 0.3)' 
          },
        },
        mtcShimmer: {
          '0%': { 'background-position': '-200% 0' },
          '100%': { 'background-position': '200% 0' },
        },
        mtcSlideUp: {
          '0%': { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        mtcScaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        mtcSnowfall: {
          '0%': { transform: 'translateY(-100vh) rotate(0deg)' },
          '100%': { transform: 'translateY(100vh) rotate(360deg)' },
        },
      },
      boxShadow: {
        'purple-glow': '0 0 20px rgba(168, 85, 247, 0.4)',
        'purple-glow-lg': '0 0 40px rgba(168, 85, 247, 0.6)',
        '3d-sm': '2px 2px 4px rgba(0, 0, 0, 0.3)',
        '3d': '4px 4px 8px rgba(0, 0, 0, 0.3)',
        '3d-lg': '6px 6px 12px rgba(0, 0, 0, 0.3)',
        '3d-xl': '8px 8px 16px rgba(0, 0, 0, 0.3)',
        'inner-3d': 'inset 2px 2px 4px rgba(0, 0, 0, 0.3)',
        
        // MTC Premium Shadows
        'mtc-card': '0 4px 24px rgba(0, 0, 0, 0.15)',
        'mtc-card-hover': '0 12px 48px rgba(0, 0, 0, 0.25)',
        'mtc-glow': '0 0 20px rgba(59, 130, 246, 0.3)',
        'mtc-glow-lg': '0 0 40px rgba(59, 130, 246, 0.5)',
        'mtc-gold-glow': '0 0 20px rgba(245, 158, 11, 0.3)',
        'mtc-emerald-glow': '0 0 20px rgba(16, 185, 129, 0.3)',
        'mtc-glass': '0 8px 32px rgba(0, 0, 0, 0.3)',
      },
    },
  },
  plugins: [],
}
