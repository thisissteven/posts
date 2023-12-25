import Head from 'next/head'
import React from 'react'

import { useLastOpenedTab } from '@/hooks'

import { Header, HomeThreadListTemplate, OnYourMind } from '@/modules/Home'

export default function Home() {
  const { activeTab, setActiveTab } = useLastOpenedTab()

  const title = activeTab ? `Posts - ${activeTab}` : 'Posts'

  const category = activeTab?.toLowerCase()

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      <OnYourMind />
      <HomeThreadListTemplate url={`/threads?category=${category}`} />
      {/* {activeTab === 'Highlights' && <Highlights />}
      {activeTab === 'Everyone' && <Everyone />}
      {activeTab === 'Following' && <Following />} */}
    </>
  )
}
