/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // SynapseFi Brand Colors
        'synapse-black': '#000000',
        'synapse-purple': '#7B2CBF',
        'synapse-purple-dark': '#5A1A8C',
        'synapse-purple-light': '#9B4FD8',
        'synapse-purple-glow': '#A855F7',
        'synapse-white': '#FFFFFF',
        'synapse-gray': '#1A1A1A',
        'synapse-gray-light': '#2A2A2A',
        'synapse-gray-dark': '#0A0A0A',
        
        // Gradient colors
        'gradient-start': '#7B2CBF',
        'gradient-end': '#A855F7',
        'gradient-mid': '#9333EA',
        
        // Status colors
        'success': '#10B981',
        'warning': '#F59E0B',
        'error': '#EF4444',
        'info': '#3B82F6',
      },
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'],
        'inter': ['Inter', 'sans-serif'],
      },
      animation: {
        // Custom animations
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'fade-out': 'fadeOut 0.3s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-down': 'slideDown 0.4s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'pulse-glow': 'pulseGlow 1.5s ease-in-out infinite',
        'wave': 'wave 3s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(123, 44, 191, 0.3)' },
          '100%': { boxShadow: '0 0 40px rgba(123, 44, 191, 0.6)' },
        },
        pulseGlow: {
          '0%, 100%': { 
            boxShadow: '0 0 20px rgba(123, 44, 191, 0.4), 0 0 40px rgba(123, 44, 191, 0.2)' 
          },
          '50%': { 
            boxShadow: '0 0 30px rgba(123, 44, 191, 0.6), 0 0 60px rgba(123, 44, 191, 0.3)' 
          },
        },
        wave: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'purple-glow': '0 0 20px rgba(123, 44, 191, 0.3)',
        'purple-glow-strong': '0 0 40px rgba(123, 44, 191, 0.6)',
        'card': '0 4px 20px rgba(0, 0, 0, 0.3)',
        'card-hover': '0 8px 40px rgba(123, 44, 191, 0.2)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-purple': 'linear-gradient(135deg, #7B2CBF 0%, #A855F7 100%)',
        'gradient-purple-dark': 'linear-gradient(135deg, #5A1A8C 0%, #7B2CBF 100%)',
        'gradient-purple-light': 'linear-gradient(135deg, #9B4FD8 0%, #A855F7 100%)',
        'glass': 'linear-gradient(135deg, rgba(123, 44, 191, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
    },
  },
  plugins: [],
}