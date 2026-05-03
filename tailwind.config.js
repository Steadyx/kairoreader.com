/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  darkMode: ["selector", '[data-theme="dark"]'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Inter",
          "SF Pro Display",
          "SF Pro Text",
          "Aptos",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
        serif: ["Newsreader", "Charter", "Iowan Old Style", "ui-serif", "serif"],
        mono: [
          "Maple Mono",
          "SFMono-Regular",
          "ui-monospace",
          "Cascadia Code",
          "monospace",
        ],
      },
      colors: {
        ink: "#10120f",
        paper: "#f7f3eb",
        veil: "#ece7dc",
        moss: "#506a57",
        ember: "#b15f45",
        steel: "#4f6f7a",
        plum: "#66506c",
      },
      boxShadow: {
        soft: "0 24px 80px rgba(16, 18, 15, 0.12)",
        darksoft: "0 24px 80px rgba(0, 0, 0, 0.32)",
      },
    },
  },
  plugins: [],
};
