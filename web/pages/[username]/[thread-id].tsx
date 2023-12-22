import Head from 'next/head'
import React from 'react'

import { Header } from '@/modules/Thread'

export default function ThreadPage() {
  return (
    <>
      <Head>
        <title>
          Larissa posted: One of the unexpected joys of becoming a designer -
          testing out cool new products! Hit me up if you ever need some fresh
          eyes on yours! 👀
        </title>
      </Head>
      <Header />
      {/* <ProfileInformation /> */}
      {/* <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {activeTab === 'Media' && <Media />}
      {activeTab === 'Posts' && <Posts />}
      {activeTab === 'Replies' && <Replies />} */}
    </>
  )
}
