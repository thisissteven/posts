import Head from 'next/head'
import React from 'react'

import { useLastOpenedTab } from '@/hooks'

import {
  Everyone,
  Following,
  Header,
  Highlights,
  OnYourMind,
} from '@/modules/Home'

export default function Home() {
  const { activeTab, setActiveTab } = useLastOpenedTab()

  const title = activeTab ? `Posts - ${activeTab}` : 'Posts'

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      <OnYourMind />
      {activeTab === 'Highlights' && <Highlights />}
      {activeTab === 'Everyone' && <Everyone />}
      {activeTab === 'Following' && <Following />}
    </>
  )
}
