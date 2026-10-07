/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        editorial: {
          bg: '#0d0d0d',
          surface: '#141414',
          border: '#262626',
          textMain: '#f2f2f2',
          textMuted: '#8c8c8c',
          accent: '#d94e34',
          accentHover: '#bf412a',
        }
      },
      fontFamily: {
        grotesk: ['Space Grotesk', 'sans-serif'],
        mono: ['Fira Code', 'monospace']
      }
    },
  },
  plugins: [],
}
