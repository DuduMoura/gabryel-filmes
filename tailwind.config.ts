import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        reel: {
          DEFAULT: "#0c0c0e",
          card: "#1a1a1e",
          border: "#2c2c31",
        },
        marquee: "#ff8000",
        film: "#00e054",
      },
    },
  },
  plugins: [],
};
export default config;
