/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './*.html',
    './**/*.html',
    './assets/js/**/*.js'
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#0A0F1C',
          navy: '#1E293B',
          light: '#F8FAFC',
          teal: '#0D9488',
          tealHover: '#0F766E',
          tealLight: '#5EEAD4'
        },
        saude: { light: '#5EEAD4', dark: '#0D9488' },
        vida: { light: '#FDA4AF', dark: '#E11D48' },
        qualidade: { light: '#93C5FD', dark: '#2563EB' },
        neutral: { light: '#E2E8F0', dark: '#0A0F1C' },
        sec: {
          yellow: '#FBBF24',
          orange: '#F97316',
          red: '#EF4444',
          green: '#10B981',
          blue: '#3B82F6',
          purple: '#8B5CF6'
        },
        palette: {
          50: '#FFFFFF',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B'
        }
      },
      backgroundImage: {
        'gradient-saude': 'linear-gradient(135deg, #5EEAD4 0%, #0D9488 100%)',
        'gradient-vida': 'linear-gradient(135deg, #FDA4AF 0%, #E11D48 100%)',
        'gradient-qualidade': 'linear-gradient(135deg, #93C5FD 0%, #2563EB 100%)',
        'gradient-neutral': 'linear-gradient(135deg, #E2E8F0 0%, #0A0F1C 100%)'
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Outfit', 'sans-serif'],
        display: ['Outfit', 'sans-serif']
      }
    }
  },
  plugins: []
};
