/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta principal (light-blue)
        primary: {
          DEFAULT: "#2E75CC", // azul principal
          light: "#5A9FEF",
          dark: "#1C5BA3",
        },
        gray: {
          light: "#f5f7fa", // fondo general
          DEFAULT: "#e5e7eb",
          dark: "#6b7280",
        },
        background: {
          DEFAULT: "#f5f7fa",
          card: "#ffffff",
        },
        text: {
          primary: "#333333",
          secondary: "#666666",
        },
      },
      boxShadow: {
        soft: "0 2px 4px rgba(0, 0, 0, 0.1)",
        softHover: "0 4px 8px rgba(0, 0, 0, 0.1)",
      },
      borderRadius: {
        lg: "10px",
      },
      transitionDuration: {
        DEFAULT: "300ms",
      },
    },
  },
  plugins: [],
}
