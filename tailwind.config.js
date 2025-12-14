/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: '#2C3E50',
        gold: '#D4AF37',
        cream: '#F4EFE7',
        sage: '#8FA89A',
        accent: '#E8B4B8',

        midnight: '#252836',
        surface: 'rgba(255, 255, 255, 0.06)',
        surfaceStrong: 'rgba(255, 255, 255, 0.10)',
        borderGlass: 'rgba(255, 255, 255, 0.14)',

        neonViolet: '#7C5CFF',
        neonCyan: '#22D3EE',
        neonPink: '#FB7185',
      },
      fontFamily: {
        display: ['Inter', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        alt: ['Lato', 'sans-serif'],
      },
      boxShadow: {
        glass: '0 18px 60px rgba(0, 0, 0, 0.35)',
        soft: '0 10px 30px rgba(0, 0, 0, 0.25)',
        glow: '0 0 0 1px rgba(124, 92, 255, 0.25), 0 18px 70px rgba(124, 92, 255, 0.18)',
      },
      backgroundImage: {
        'hero-gradient': 'radial-gradient(900px circle at 10% 10%, rgba(124, 92, 255, 0.20), transparent 55%), radial-gradient(700px circle at 90% 20%, rgba(34, 211, 238, 0.18), transparent 55%), radial-gradient(800px circle at 50% 90%, rgba(251, 113, 133, 0.12), transparent 60%)',
        'card-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.03))',
        'neon-border': 'linear-gradient(90deg, rgba(34,211,238,0.9), rgba(124,92,255,0.9), rgba(251,113,133,0.9))',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        fadeUp: {
          '0%': { opacity: 0, transform: 'translateY(10px)' },
          '100%': { opacity: 1, transform: 'translateY(0px)' },
        },
      },
      animation: {
        shimmer: 'shimmer 1.2s linear infinite',
        fadeUp: 'fadeUp 420ms ease-out both',
      },
      screens: {
        sm: '375px',
        md: '768px',
        lg: '1200px',
      },
    },
  },
  plugins: [],
}
