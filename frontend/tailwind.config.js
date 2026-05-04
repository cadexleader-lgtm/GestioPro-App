/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2563EB',
        sidebar: '#ffffff',
        'sidebar-border': '#e2e8f0',
        'sidebar-foreground': '#0f172a',
        accent: '#FACC15',
        background: '#F8FAFC',
      },
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
    },
  },
  plugins: [],
}