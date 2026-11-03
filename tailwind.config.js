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
        ivory: {
          DEFAULT: '#F8F4EC',
          50: '#FDFAF5',
          100: '#F8F4EC',
          200: '#F0E9DC',
          300: '#E5DAC8',
        },
        charcoal: {
          DEFAULT: '#2A2925',
          900: '#1C1C19',
          800: '#2A2925',
          700: '#393832',
          600: '#4C4B44',
        },
        beige: {
          DEFAULT: '#DCCDB8',
          light: '#EFE6D8',
          dark: '#C4B097',
        },
        bronze: {
          DEFAULT: '#A78058',
          light: '#C29C74',
          dark: '#8C6741',
          50: '#F9F6F0',
          100: '#F1E9DE',
        },
        clay: {
          DEFAULT: '#B85C42',
          light: '#D07A5F',
          dark: '#96452F',
          50: '#FBF1ED',
          100: '#F5DDD4',
        },
        sage: {
          DEFAULT: '#6E7A5F',
          light: '#8A9679',
          dark: '#55614A',
          50: '#F2F4EE',
          100: '#E3E8DB',
        },
        sand: {
          DEFAULT: '#EADFCB',
          light: '#F4EDE1',
          dark: '#D9C9AD',
        },
        mutedgray: {
          DEFAULT: '#77766E',
          light: '#A3A198',
          dark: '#5B5A53',
        },
        status: {
          green: '#2E7D32',
          red: '#C62828',
          amber: '#D97706',
          blue: '#1E40AF',
        }
      },
      fontFamily: {
        serif: ['Fraunces', '"DM Serif Display"', 'Georgia', 'serif'],
        sans: ['Manrope', 'system-ui', 'sans-serif'],
        hand: ['Caveat', 'Georgia', 'cursive'],
        arabic: ['Cairo', 'Manrope', 'sans-serif'],
      },
      boxShadow: {
        'luxury': '0 22px 50px -24px rgba(42, 41, 37, 0.20)',
        'luxury-hover': '0 30px 60px -20px rgba(42, 41, 37, 0.26)',
        'elevated': '0 10px 30px -5px rgba(42, 41, 37, 0.06)',
        'soft': '0 16px 40px -24px rgba(42, 41, 37, 0.18)',
        'human': '0 2px 0 0 rgba(42, 41, 37, 0.06), 0 18px 40px -24px rgba(42, 41, 37, 0.22)',
      },
      borderRadius: {
        'luxury': '1rem',
        'arch': '10rem 10rem 0.75rem 0.75rem',
      },
      animation: {
        'float-slow': 'floatSlow 7s ease-in-out infinite',
        'fade-up': 'fadeUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards',
      },
      keyframes: {
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
