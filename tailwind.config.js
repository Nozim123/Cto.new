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
        navy: '#1E293B', // Slate 800 - darker, more modern navy
        gold: '#06B6D4', // Cyan 500 - Modern replacement for gold
        cream: '#F8FAFC', // Slate 50 - Cleaner white/cream
        sage: '#64748B', // Slate 500 - Modern grey/sage
        accent: '#F43F5E', // Rose 500 - Modern accent
        primary: 'rgb(15, 23, 42)', // Slate 900 - Premium Dark
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
      }
    },
  },
  plugins: [],
}
