/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        ink: "#070915",
        graphite: "#111622",
        aqua: "#29d6ff",
        pulse: "#8d5cff",
        mint: "#4ff0b7",
        rose: "#ff5ca8",
      },
      boxShadow: {
        glow: "0 0 34px rgba(41, 214, 255, 0.25)",
        premium: "0 24px 90px rgba(0, 0, 0, 0.38)",
      },
    },
  },
  plugins: [],
};
