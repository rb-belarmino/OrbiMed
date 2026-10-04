tailwind.config = {
  theme: {
    extend: {
      colors: {
        space: {
          950: '#05070a',
          900: '#080d14',
          850: '#0d1522',
          800: '#111b2b',
          700: '#1b293e'
        },
        bio: {
          lime: '#deff9a',
          glow: 'rgba(222, 255, 154, 0.4)',
          dim: '#a3c965',
          dark: '#1a2408'
        },
        orbital: {
          cyan: '#38bdf8',
          blue: '#0284c7'
        }
      },
      fontFamily: {
        sans: [
          '"Plus Jakarta Sans"',
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'sans-serif'
        ],
        mono: ['"JetBrains Mono"', 'monospace']
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        float: 'float 6s ease-in-out infinite',
        radar: 'radar 3s ease-out infinite'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        radar: {
          '0%': { transform: 'scale(0.8)', opacity: '0.8' },
          '100%': { transform: 'scale(2.2)', opacity: '0' }
        }
      }
    }
  }
}
