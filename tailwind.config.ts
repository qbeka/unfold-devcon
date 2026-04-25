import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", ...defaultTheme.fontFamily.sans]
      },
      colors: {
        ink: "#0f172a",
        muted: "#64748b",
        paper: "#fafbfc"
      },
      boxShadow: {
        soft: "0 18px 60px rgba(15, 23, 42, 0.06)"
      }
    }
  },
  plugins: []
};

export default config;
