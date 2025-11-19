/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'display': ['"Archivo Black"', 'sans-serif'],
        'body': ['"Space Mono"', 'monospace'],
        'serif': ['"Crimson Text"', 'serif'],
      },
      colors: {
        'neo-black': '#121212',
        'neo-white': '#fffdf5',
        'neo-yellow': '#ffeb3b',
        'neo-pink': '#ff80ab',
        'neo-blue': '#80d8ff',
        'neo-green': '#b9f6ca',
        'neo-orange': '#ff9100',
        'neo-red': '#ff5252',
        'neo-purple': '#ea80fc',
      },
      boxShadow: {
        'hard': '6px 6px 0px 0px #121212',
        'hard-hover': '10px 10px 0px 0px #121212',
      },
      borderWidth: {
        '3': '3px'
      }
    }
  },
  plugins: [],
}
