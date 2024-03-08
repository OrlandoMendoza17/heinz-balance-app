import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        xx_sm: '375px',
        x_sm: '480px',
        sm: '576px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        primary: "#a81e2e",
        secondary: "#17396d",
      },
      fontSize: {
        xs: [
          '1.2rem', { lineHeight: '1.8rem' }
        ],
        sm: [
          '1.4rem', { lineHeight: '2.2rem' }
        ],
        base: [
          '1.6rem', { lineHeight: '2.4rem' }
        ],
        lg: [
          '1.8rem', { lineHeight: '2.8rem' }
        ],
        xl: [
          '2rem', { lineHeight: '3rem' }
        ],
        '2xl': [
          '2.4rem', { lineHeight: '3.6rem' }
        ],
        '3xl': [
          '2.6rem', { lineHeight: '3.6rem' } //Cambiar cuando vea algún texto con 26px
        ],
        '4xl': [
          '3.2rem', { lineHeight: '4rem' }
        ],
        '5xl': [
          '4.2rem', { lineHeight: '5.8rem' }
        ],
      },
    },
  },

  plugins: [],
};
export default config;
