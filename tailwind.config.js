/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'terracotta': '#e07a5f',
        'cream': '#f4f1de',
        'warm-gray': '#81b29a',
        'sage': '#3d405b',
      },
    },
  },
  plugins: [],
}
