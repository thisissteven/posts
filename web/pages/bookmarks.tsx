import Head from 'next/head'
import React from 'react'

import { LinkButton } from '@/components/UI'

import { Header, SupporterOnly } from '@/modules/Bookmarks'

export default function Bookmarks() {
  return (
    <>
      <Head>
        <title>Bookmarks</title>
      </Head>
      <Header />
      <div className="h-full w-full flex flex-col justify-center">
        <div className="px-3 max-w-[440px] mx-auto">
          <SupporterOnly />

          <p className="text-soft-primary text-sm leading-6 mt-3 mb-4">
            Bookmarks allow you to privately save posts for later. This feature
            is only available to supporters. Become a supporter to unlock this
            and more great features.
          </p>

          <LinkButton
            variant="secondary"
            className="px-3 py-2"
            href="https://read.cv/about/supporters"
          >
            Become a supporter
          </LinkButton>
        </div>
      </div>
    </>
  )
}
