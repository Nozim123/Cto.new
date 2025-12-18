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
        navy: '#0F172A',
        gold: '#14B8A6',
        cream: '#F8FAFC',
        sage: '#64748B',
        accent: '#38BDF8',
        primary: '#0B1220',
        'primary-dark': '#060B14',
        purple: {
          50: '#F0F9FF',
          100: '#E0F2FE',
          200: '#BAE6FD',
          300: '#7DD3FC',
          400: '#38BDF8',
          500: '#0EA5E9',
          600: '#0284C7',
          700: '#0369A1',
          800: '#075985',
          900: '#0C4A6E',
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
      },
      boxShadow: {
        'purple-glow': '0 0 20px rgba(168, 85, 247, 0.4)',
        'purple-glow-lg': '0 0 40px rgba(168, 85, 247, 0.6)',
        '3d-sm': '2px 2px 4px rgba(0, 0, 0, 0.3)',
        '3d': '4px 4px 8px rgba(0, 0, 0, 0.3)',
        '3d-lg': '6px 6px 12px rgba(0, 0, 0, 0.3)',
        '3d-xl': '8px 8px 16px rgba(0, 0, 0, 0.3)',
        'inner-3d': 'inset 2px 2px 4px rgba(0, 0, 0, 0.3)',
      },
    },
  },
  plugins: [],
}
