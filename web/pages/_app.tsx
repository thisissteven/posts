import type { AppProps } from 'next/app'
import { Lexend } from 'next/font/google'
import { SessionProvider } from 'next-auth/react'
import React from 'react'
import { SWRConfig } from 'swr'

import '@/styles/globals.css'

import { apiClient } from '@/lib'
import { useScrollRestoration } from '@/hooks'

import { AuthProvider } from '@/modules/Auth'
import { BlockUserDialog } from '@/modules/BlockUser'
import { BookmarksDialog } from '@/modules/Bookmarks'
import { AltDialog } from '@/modules/ImageAlt'
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
          fetcher: (url) => {
            if (url.includes('undefined')) return undefined
            return apiClient.get(url).then((res) => res.data)
          },
        }}
      >
        <SessionProvider session={pageProps.session}>
          <AltDialog />
          <BookmarksDialog />
          <ReportDialog />
          <BlockUserDialog />
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
