/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f0f4f8",
          100: "#d9e2ec",
          200: "#bcccdc",
          300: "#9fb3c8",
          400: "#627d98",
          500: "#334e68",
          600: "#243b53",
          700: "#192a3e",
          800: "#102a43",
          900: "#0a1929",
        },
        accent: {
          50: "#f0f9ff",
          100: "#e0f2fe",
          200: "#bae6fd",
          300: "#7dd3fc",
          400: "#38bdf8",
          500: "#0ea5e9",
          600: "#0284c7",
          700: "#0369a1",
          800: "#075985",
          900: "#0c4a6e",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "Noto Sans JP",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
        serif: ["Noto Serif JP", "ui-serif", "Georgia", "serif"],
        mono: ["Roboto Mono", "ui-monospace", "monospace"],
      },
      backdropBlur: {
        sm: "4px",
      },
    },
  },
  plugins: [],
};
