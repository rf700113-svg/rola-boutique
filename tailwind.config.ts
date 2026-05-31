import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        cream: "#F7F4EF",
        ivory: "#EAE3D8",
        stone: "#D8C7B4",
        champagne: "#D8C7B4",
        sage: "#58655A",
        taupe: "#756C64",
        charcoal: "#2B2623"
      },
      fontFamily: {
        sans: ["Noto Sans TC", "Microsoft JhengHei", "Arial", "sans-serif"],
        serif: ["Cormorant Garamond", "Georgia", "Times New Roman", "serif"],
        playfair: ["Playfair Display", "Didot", "Bodoni 72", "Georgia", "serif"]
      },
      boxShadow: {
        soft: "0 18px 60px rgba(51, 51, 51, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
