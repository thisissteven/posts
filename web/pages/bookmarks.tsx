import Head from 'next/head'
import React from 'react'

import { RegularButton } from '@/components/UI'

import { Header, SupporterOnly } from '@/modules/Bookmarks'

export default function Bookmarks() {
  return (
    <>
      <Head>
        <title>Bookmarks</title>
      </Head>
      <Header />
      <div className="absolute top-0 left-0 h-full w-full flex flex-col justify-center">
        <div className="px-3 max-w-[440px] mx-auto">
          <SupporterOnly />

          <p className="text-soft-primary text-sm leading-6 mt-3 mb-4">
            Bookmarks allow you to privately save posts for later. This feature
            is only available to supporters. Become a supporter to unlock this
            and more great features.
          </p>

          <RegularButton
            asChild
            variant="filled"
            className="rounded-lg w-fit tracking-normal text-sm font-normal px-3 py-2"
          >
            <a href="https://read.cv/about/supporters" target="_blank">
              Become a supporter
            </a>
          </RegularButton>
        </div>
      </div>
    </>
  )
}
