/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        unionblue: {
          600: '#003366',
          700: '#002855',
          800: '#001F40',
          900: '#001733',
        },
        unionaccent: {
          500: '#FF9933', // Saffron color from Indian flag
          600: '#E88A2D',
          700: '#D17A25',
        },
      },
    },
  },
  plugins: [],
}