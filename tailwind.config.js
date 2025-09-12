/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-blue': '#0A2E55',
        'brand-blue-light': '#1E487B',
        'brand-gold': '#C8A464',
        'brand-gold-light': '#E6D1A6',
      },
    },
  },
  plugins: [],
}