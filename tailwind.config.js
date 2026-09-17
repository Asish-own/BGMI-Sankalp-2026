/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bgmi: {
          dark: '#0b0e14',
          card: '#121824',
          accent: '#ffb703',
          gold: '#f59e0b',
          amber: '#fbbf24',
          orange: '#f97316',
          red: '#ef4444',
          cyan: '#06b6d4',
          border: '#1e293b'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Orbitron', 'sans-serif']
      }
    },
  },
  plugins: [],
}
