import type { AppProps } from 'next/app'
import { Lexend } from 'next/font/google'
import { ThemeProvider } from 'next-themes'

import '@/styles/globals.css'

const lexend = Lexend({ subsets: ['latin'] })

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <style jsx global>{`
        :root {
          --font-sans: ${lexend.style.fontFamily};
        }
      `}</style>
      <ThemeProvider forcedTheme="dark">
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  )
}
