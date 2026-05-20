import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Vazirmatn", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      colors: {
        bg: { DEFAULT: "#0A0A0B", 2: "#0F0F11", 3: "#14141A" },
        text: { DEFAULT: "#E8E6E1", dim: "#8A857B", faint: "#5A5852" },
        accent: { DEFAULT: "#C9A961", 2: "#8B7338" },
        up: { DEFAULT: "#6BAE7C", bg: "rgba(107,174,124,0.1)" },
        down: { DEFAULT: "#C97A6B", bg: "rgba(201,122,107,0.1)" },
        warning: { DEFAULT: "#C9B36B", bg: "rgba(201,179,107,0.1)" },
        info: { DEFAULT: "#6B9CC9", bg: "rgba(107,156,201,0.12)" },
        line: { DEFAULT: "rgba(201,169,97,0.12)", strong: "rgba(201,169,97,0.3)" },
        tint: { DEFAULT: "rgba(201,169,97,0.04)", 2: "rgba(201,169,97,0.08)" },
      },
    },
  },
  plugins: [],
};
export default config;
