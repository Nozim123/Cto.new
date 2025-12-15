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
        gold: '#5CA4D8',
        cream: '#F4EFE7',
        sage: '#8FA89A',
        accent: '#E8B4B8',
        primary: 'rgb(37, 40, 54)',
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
