import Head from 'next/head'
import React from 'react'

import { useLastOpenedTab } from '@/hooks'

import { Header } from '@/modules/Home'
import { Everyone, Following, Highlights } from '@/modules/Home'
import { OnYourMind } from '@/modules/ThreadForm'

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
