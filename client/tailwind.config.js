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
        darkBg: {
          900: '#020617',
          800: '#05070A',
          700: '#0B1120',
          600: '#0F172A',
          500: '#1E293B',
        },
        skyGlow: {
          DEFAULT: '#38BDF8',
          light: '#7DD3FC',
        },
        purpleGlow: {
          DEFAULT: '#A855F7',
          light: '#C084FC',
          dark: '#8B5CF6',
        },
        cyanGlow: '#22D3EE',
        emeraldGlow: '#34D399',
        amberGlow: '#FBBF24',
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'sans-serif'],
        mono: ['Fira Code', 'monospace']
      },
      boxShadow: {
        'electric-sky': '0 0 25px -5px rgba(56, 189, 248, 0.4)',
        'electric-purple': '0 0 25px -5px rgba(168, 85, 247, 0.4)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'electric-glow': 'electric 3s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        electric: {
          '0%': { opacity: '0.4', filter: 'drop-shadow(0 0 8px #38BDF8)' },
          '100%': { opacity: '0.9', filter: 'drop-shadow(0 0 20px #A855F7)' },
        }
      }
    },
  },
  plugins: [],
}
