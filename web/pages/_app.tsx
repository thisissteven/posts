import type { AppProps } from 'next/app'
import { Lexend } from 'next/font/google'
import { SessionProvider } from 'next-auth/react'
import React from 'react'
import { SWRConfig } from 'swr'

import '@/styles/globals.css'

import { apiClient } from '@/lib'
import { useScrollRestoration } from '@/hooks'

import { AuthProvider } from '@/modules/Auth'
import { BookmarksDialogProvider } from '@/modules/Bookmarks'
import { AppLayout } from '@/modules/Layout/AppLayout'
import { OnboardingProvider } from '@/modules/Onboarding'

const outfit = Lexend({ subsets: ['latin'] })

export default function App({ Component, pageProps }: AppProps) {
  useScrollRestoration(['/'])

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
