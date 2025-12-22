/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ["Playfair Display", "serif"],
        body: ["Inter", "sans-serif"],
      },
      colors: {
        primary: "#1e40af",
        dark: "#111827",
        muted: "#6b7280",
        breaking: "#b91c1c",
      },
    },
  },
  plugins: [],
};
