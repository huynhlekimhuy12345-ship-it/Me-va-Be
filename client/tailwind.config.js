/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pastel: {
          pink: '#FFD6E0',
          'pink-hover': '#FBB1C4',
          mint: '#C5F0DC',
          'mint-dark': '#7BC9A6',
          'mint-deep': '#247952',
          cream: '#FFF8F0',
          'cream-warm': '#FFF2E2',
          yellow: '#FFEFC7',
          'yellow-dark': '#E5C572',
          text: '#5B4A4A',
          muted: '#8C7A7A',
          border: '#F0E2D6',
          white: '#FFFFFF',
        },
        brand: {
          pink: '#FF8FAB',
          'pink-hover': '#FB6F92',
          'pink-light': '#FFE4EB',
          'pink-deep': '#D9436A',
          danger: '#FF8A8A',
          'danger-hover': '#E26D6D',
          'danger-light': '#FFEAEA',
          success: '#68CCA2',
          'success-light': '#E3F8EE',
          warning: '#F5BE4F',
          'warning-light': '#FEF7E8',
        }
      },
      borderRadius: {
        'card': '20px',
        'card-lg': '24px',
        'button': '9999px',
        'input': '16px',
        'xl': '16px',
        '2xl': '20px',
        '3xl': '24px',
      },
      boxShadow: {
        'soft': '0 2px 12px rgba(91, 74, 74, 0.05)',
        'card': '0 4px 20px -2px rgba(91, 74, 74, 0.07), 0 2px 6px -1px rgba(91, 74, 74, 0.04)',
        'card-hover': '0 12px 30px -4px rgba(91, 74, 74, 0.12), 0 4px 10px -2px rgba(255, 143, 171, 0.15)',
        'pink-glow': '0 6px 20px -2px rgba(255, 143, 171, 0.4)',
        'bottom-nav': '0 -4px 20px rgba(91, 74, 74, 0.07)',
        'drawer': '-6px 0 30px rgba(91, 74, 74, 0.12)',
      },
      fontFamily: {
        display: ['Quicksand', 'sans-serif'],
        sans: ['"Be Vietnam Pro"', 'sans-serif'],
      },
      animation: {
        'bounce-short': 'bounceShort 0.4s ease-in-out',
        'pulse-subtle': 'pulseSubtle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float-slow': 'floatSlow 4s ease-in-out infinite',
      },
      keyframes: {
        bounceShort: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.2)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.85' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      }
    },
  },
  plugins: [],
}
