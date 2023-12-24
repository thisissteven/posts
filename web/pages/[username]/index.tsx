import Head from 'next/head'
import React from 'react'

import { Header, ProfileInfo } from '@/modules/Profile'
import { Media, Posts, ProfileTabs, Replies } from '@/modules/Profile/Me'

import { ProfileTab } from '@/types'

export default function ProfilePage() {
  const [activeTab, setActiveTab] = React.useState<ProfileTab>('Posts')

  return (
    <>
      <Head>
        <title>Profile</title>
      </Head>
      <Header />
      <div className="overflow-y-hidden">
        <ProfileInfo />
        <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="mt-0.5">
          {activeTab === 'Media' && <Media />}
          {activeTab === 'Posts' && <Posts />}
          {activeTab === 'Replies' && <Replies />}
        </div>
      </div>
    </>
  )
}
