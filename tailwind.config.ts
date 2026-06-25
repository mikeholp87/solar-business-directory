import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}", "./lib/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        navy: "#102A43",
        accent: "#00A651",
        "accent-hover": "#008C44",
        "accent-active": "#007A3B",
        "accent-light": "#E6F7EE",
        surface: "#F5F7FA",
        "surface-alt": "#EEF2F5",
        muted: "#6B7280",
        border: "#E5E7EB",
      },
      fontFamily: {
        sans: ["var(--font-body)", "system-ui", "-apple-system", "Segoe UI", "Helvetica Neue", "Arial", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "8px",
      },
      boxShadow: {
        soft: "0 4px 12px rgba(16, 42, 67, 0.08)",
        card: "0 1px 3px rgba(16, 42, 67, 0.06)",
        "card-hover": "0 4px 12px rgba(16, 42, 67, 0.1)",
      }
    }
  },
  plugins: []
};

export default config;
