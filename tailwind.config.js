/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        primary: '#083D77',      // Navy Blue
        secondary: '#EBEBD3',    // Cream
        accent: '#F4D35E',       // Gold
        error: '#DA4167',        // Pink/Red
        warning: '#F78764',      // Coral
        background: '#FFFFFF',
        surface: '#F8FAFC',
        border: '#E5E7EB',
        'text-primary': '#1F2937',
        'text-secondary': '#6B7280',
        'text-muted': '#9CA3AF'
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
      }
    },
  },
  plugins: [],
}