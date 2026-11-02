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
          DEFAULT: '#F7F5F0',
          50: '#FDFCFB',
          100: '#F7F5F0',
          200: '#EFECE3',
          300: '#E4DFD2',
        },
        charcoal: {
          DEFAULT: '#20211F',
          900: '#141514',
          800: '#20211F',
          700: '#2E2F2C',
          600: '#42433F',
        },
        beige: {
          DEFAULT: '#D8C9B5',
          light: '#EBE3D7',
          dark: '#BFAA93',
        },
        bronze: {
          DEFAULT: '#A78058',
          light: '#C29C74',
          dark: '#8C6741',
          50: '#F9F6F0',
          100: '#F1E9DE',
        },
        mutedgray: {
          DEFAULT: '#777872',
          light: '#A1A29D',
          dark: '#585954',
        },
        status: {
          green: '#2E7D32',
          red: '#C62828',
          amber: '#D97706',
          blue: '#1E40AF',
        }
      },
      fontFamily: {
        serif: ['"DM Serif Display"', 'Georgia', 'serif'],
        sans: ['Manrope', 'system-ui', 'sans-serif'],
        arabic: ['Cairo', 'Manrope', 'sans-serif'],
      },
      boxShadow: {
        'luxury': '0 20px 40px -15px rgba(32, 33, 31, 0.07)',
        'luxury-hover': '0 30px 60px -12px rgba(32, 33, 31, 0.12)',
        'elevated': '0 10px 30px -5px rgba(32, 33, 31, 0.05)',
      },
      borderRadius: {
        'luxury': '0.75rem',
      }
    },
  },
  plugins: [],
}
