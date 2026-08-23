/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pageBg: '#0a0a0c',
        sidebarBg: '#08080a',
        cardBg: '#151517', 
        cardSurface: '#1a1a1c',
        inputBg: '#0d0d0f',
        borderBorder: '#26262a',
        primaryText: '#f1f5f9',
        mutedText: '#94a3b8',
        brandGreen: '#10b981',
        brandRed: '#ef4444',
        quoteBlue: '#60a5fa',
      }
    },
  },
  plugins: [],
}
