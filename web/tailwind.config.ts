import type { Config } from 'tailwindcss'
import { fontFamily } from 'tailwindcss/defaultTheme'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './modules/**/*.{js,ts,jsx,tsx}',
  ],
  future: {
    hoverOnlyWhenSupported: true,
  },
  theme: {
    extend: {
      colors: {
        background: '#222222',
        black: '#111111',
        'danger-soft': '#f04b4b',
        danger: '#f10000',
        divider: '#393939',
        placeholder: '#595959',
        popover: '#484848',
        primary: '#eeeeee',
        span: '#888888',
        'light-span': '#616161',
        success: '#32bd64',
        'black-shadow': '#191919',
        'soft-background': '#333333',
        'light-background': '#444444',
        'soft-black': '#1f1f1f',
        'soft-primary': '#bbbbbb',
        'autumn-brown': '#654e18',
        'autumn-yellow': '#f5b207',
        orange: '#ffa500',
        blue: '#0788f5',
      },
      fontFamily: {
        sans: ['var(--font-sans)', ...fontFamily.sans],
      },
      screens: {
        xs: '522px',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
export default config
