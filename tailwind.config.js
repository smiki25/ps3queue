/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '475px',
        'touch': { 'raw': '(hover: none)' },
      },
      fontFamily: {
        voltaire: ['Voltaire', 'sans-serif'],
      },
      colors: {
        'dark-space': '#121212',
        'neon-blue': '#00BFFF',
        'neon-pink': '#FF00FF',
        'light-gray': '#D3D3D3',
        'maroon': '#480e0e',
      },
      boxShadow: {
        'neon-blue': '0 0 10px #00BFFF, 0 0 20px #00BFFF, 0 0 30px #00BFFF',
        'neon-pink': '0 0 10px #FF00FF, 0 0 20px #FF00FF, 0 0 30px #FF00FF',
      },
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
      }
    },
  },
  plugins: [],
}

