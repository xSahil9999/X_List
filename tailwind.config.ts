import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "#070a12",
        panel: "#111827",
        panelSoft: "#172033",
        borderSoft: "#233049",
        accent: "#4ade80",
        accentMuted: "#22c55e",
        danger: "#ef4444",
        warn: "#f59e0b",
        textMain: "#eef2ff",
        textMuted: "#93a0bc"
      },
      boxShadow: {
        panel: "0 10px 40px rgba(0,0,0,0.3)"
      },
      backgroundImage: {
        "hero-grid": "radial-gradient(circle at 25% 25%, rgba(74, 222, 128, 0.14), transparent 45%), radial-gradient(circle at 75% 35%, rgba(59,130,246,0.2), transparent 42%), linear-gradient(180deg, #070a12 0%, #0b1020 100%)"
      }
    }
  },
  plugins: []
};

export default config;
