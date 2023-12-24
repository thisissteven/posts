import type { AppProps } from 'next/app'
import { Lexend } from 'next/font/google'
import { SessionProvider } from 'next-auth/react'
import React from 'react'
import { SWRConfig } from 'swr'

import '@/styles/globals.css'

import { apiClient } from '@/lib'
import { useScrollRestoration } from '@/hooks'

import { AuthProvider } from '@/modules/Auth'
import { BookmarksDialog } from '@/modules/Bookmarks'
import { AppLayout } from '@/modules/Layout/AppLayout'
import { OnboardingProvider } from '@/modules/Onboarding'
import { ReportDialog } from '@/modules/Report'

const outfit = Lexend({ subsets: ['latin'] })

export default function App({ Component, pageProps, router }: AppProps) {
  useScrollRestoration(router, ['/', '/[username]'])

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
          <BookmarksDialog />
          <ReportDialog />
          <AuthProvider>
            <OnboardingProvider>
              <AppLayout>
                <Component {...pageProps} />
              </AppLayout>
            </OnboardingProvider>
          </AuthProvider>
        </SessionProvider>
      </SWRConfig>
    </>
  )
}
