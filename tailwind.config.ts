import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}", "./lib/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#17211d",
        moss: "#58715b",
        fern: "#1f8a5c",
        skywash: "#e8f3f8",
        solar: "#f4b44b",
        clay: "#b96f45"
      },
      boxShadow: {
        soft: "0 18px 60px rgba(23, 33, 29, 0.10)"
      }
    }
  },
  plugins: []
};

export default config;
