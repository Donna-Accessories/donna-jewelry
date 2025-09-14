/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Donna's Jewelry Brand Colors
      colors: {
        'gold-primary': '#D4AF37',
        'gold-light': '#F4E4BC',
        'gold-600': '#B8941F', // Darker gold for hover states
        'blue-premium': '#1E3A8A',
        'blue-light': '#3B82F6',
      },
      
      // Custom Font Families
      fontFamily: {
        'playfair': ['Playfair Display', 'serif'], // Elegant headings
        'inter': ['Inter', 'sans-serif'], // Body text
      },
      
      // Custom Spacing for jewelry layouts
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      
      // Custom Border Widths
      borderWidth: {
        '3': '3px',
      },
      
      // Custom Animations for premium feel
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      
      // Animation Keyframes
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      
      // Custom Box Shadows for premium elements
      boxShadow: {
        'jewelry': '0 4px 20px rgba(212, 175, 55, 0.15)',
        'premium': '0 8px 32px rgba(0, 0, 0, 0.12)',
      },
      
      // Custom Backdrop Blur
      backdropBlur: {
        'xs': '2px',
      },
    },
  },
  plugins: [
    // Add any additional Tailwind plugins here
    // For example: @tailwindcss/forms, @tailwindcss/typography
  ],
}