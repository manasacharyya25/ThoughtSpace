import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        heading: "var(--heading)",
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        border: "var(--border)",
        surface: "var(--surface)",
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        landing: {
          bg: "var(--landing-bg)",
          card: "var(--landing-card)",
          border: "var(--landing-border)",
          gold: "var(--landing-gold)",
          "gold-hover": "var(--landing-gold-hover)",
          fg: "var(--landing-fg)",
          muted: "var(--landing-muted)",
          input: "var(--landing-input)",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
        "landing-serif": [
          "var(--font-landing-serif)",
          "Georgia",
          "serif",
        ],
        "landing-sans": [
          "var(--font-landing-sans)",
          "system-ui",
          "sans-serif",
        ],
        "landing-mono": [
          "var(--font-landing-mono)",
          "monospace",
        ],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
};

export default config;
