/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0D0D0D",
        paper: "#F5F0E8",
        surface: "#FFFFFF",
        mp3: "#FF3C00",
        mp4: "#1A1AFF",
        yellow: "#FFE600",
      },
      fontFamily: {
        display: ["Space Grotesk", "system-ui", "sans-serif"],
        mono: ["IBM Plex Mono", "ui-monospace", "monospace"],
      },
      boxShadow: {
        brutal: "4px 4px 0px #0D0D0D",
        "brutal-sm": "2px 2px 0px #0D0D0D",
        "brutal-lg": "6px 6px 0px #0D0D0D",
        "brutal-mp3": "4px 4px 0px #FF3C00",
        "brutal-mp4": "4px 4px 0px #1A1AFF",
        "brutal-yellow": "4px 4px 0px #FFE600",
      },
      animation: {
        "spin-slow": "spin 3s linear infinite",
      },
    },
  },
  plugins: [],
}
