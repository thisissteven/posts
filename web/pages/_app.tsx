import type { AppProps } from 'next/app'
import { Lexend } from 'next/font/google'
import { useRouter } from 'next/router'
import { SessionProvider } from 'next-auth/react'
import React from 'react'
import { SWRConfig } from 'swr'

import '@/styles/globals.css'

import { apiClient } from '@/lib'

import { useScrollPosition } from '@/store'

import { AuthProvider } from '@/modules/Auth'
import { BookmarksDialogProvider } from '@/modules/Bookmarks'
import { AppLayout } from '@/modules/Layout/AppLayout'
import { OnboardingProvider } from '@/modules/Onboarding'

const outfit = Lexend({ subsets: ['latin'] })

export default function App({ Component, pageProps }: AppProps) {
  const scrollPosition = useScrollPosition((state) => state.scrollPosition)
  const setScrollPosition = useScrollPosition(
    (state) => state.setScrollPosition
  )

  const router = useRouter()

  React.useEffect(() => {
    let timeout: NodeJS.Timeout

    const handleRouteChangeStart = () => {
      setScrollPosition(router.pathname, document.documentElement.scrollTop)
    }

    router.events.on('routeChangeStart', handleRouteChangeStart)

    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart)
      clearTimeout(timeout)
    }
  }, [router.events, router.pathname, scrollPosition, setScrollPosition])

  const timeoutRef = React.useRef<NodeJS.Timeout>()

  React.useEffect(() => {
    clearTimeout(timeoutRef.current!)

    if (scrollPosition) {
      timeoutRef.current = setTimeout(() => {
        document.documentElement.scrollTo({
          top: scrollPosition[router.pathname] || 0,
        })
      }, 300)
    }
  }, [router.pathname, scrollPosition, setScrollPosition])

  return (
    <>
      <style jsx global>{`
        :root {
          --font-sans: ${outfit.style.fontFamily};
        }
      `}</style>
      <SWRConfig
        value={{
          fetcher: (url) => apiClient.get(url).then((res) => res.data),
        }}
      >
        <SessionProvider session={pageProps.session}>
          <BookmarksDialogProvider>
            <AuthProvider>
              <OnboardingProvider>
                <AppLayout>
                  <Component {...pageProps} />
                </AppLayout>
              </OnboardingProvider>
            </AuthProvider>
          </BookmarksDialogProvider>
        </SessionProvider>
      </SWRConfig>
    </>
  )
}
