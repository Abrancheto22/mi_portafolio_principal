/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // Apunta a todas las páginas, layouts y componentes
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // (Aquí puedes extender el tema si quieres)
    },
  },
  plugins: [],
};