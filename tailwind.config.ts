import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}", "./lib/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        navy: "#102A43",
        "navy-hover": "#1B3A5C",
        accent: "#00A651",
        "accent-hover": "#008F46",
        "accent-active": "#007A3B",
        "accent-light": "#E6F7EE",
        surface: "#F5F7FA",
        "surface-alt": "#EEF2F5",
        muted: "#486581",
        "muted-subtle": "#829AB1",
        border: "#E3E8EF",
      },
      fontFamily: {
        sans: ["var(--font-body)", "system-ui", "-apple-system", "Segoe UI", "Helvetica Neue", "Arial", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "8px",
        card: "16px",
        btn: "10px",
      },
      boxShadow: {
        soft: "0 4px 12px rgba(16, 42, 67, 0.08)",
        card: "0 2px 10px rgba(16, 42, 67, 0.05)",
        "card-hover": "0 10px 24px rgba(0, 166, 81, 0.12)",
        hero: "0 8px 24px rgba(16, 42, 67, 0.08)",
      }
    }
  },
  plugins: []
};

export default config;
