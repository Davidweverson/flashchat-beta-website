import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-app': '#0f0f0f',
        'bg-sidebar': '#1a1a1a',
        'bg-chat': '#111111',
        'bg-input': '#222222',
        'accent': '#7c3aed',
        'text-primary': '#e5e5e5',
        'text-secondary': '#888888',
      },
    },
  },
  plugins: [],
};
export default config;
