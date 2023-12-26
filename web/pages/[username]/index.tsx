import Head from 'next/head'
import { usePathname } from 'next/navigation'
import React from 'react'
import useSWRImmutable from 'swr/immutable'

import { Header, ProfileInfo, ProfileLoader } from '@/modules/Profile'
import { Media, Posts, ProfileTabs, Replies } from '@/modules/Profile'
import { ProfileDialog } from '@/modules/Profile/Me'

import { ProfileTab } from '@/types'

export default function ProfilePage() {
  const pathname = usePathname()
  const username = pathname?.split('/')[1]

  const { data, mutate } = useSWRImmutable<ProfileTab>(
    `/profile/tabs/${username}`,
    () => 'Posts' as const
  )

  const activeTab = data ?? 'Posts'

  return (
    <>
      <Head>
        <title>Profile</title>
      </Head>
      <ProfileDialog />

      <ProfileLoader>
        <Header />

        <ProfileInfo />
        <ProfileTabs
          activeTab={activeTab}
          setActiveTab={(activeTab) => {
            mutate(activeTab, {
              revalidate: false,
            })
          }}
        />

        <div className="mt-0.5">
          {activeTab === 'Media' && <Media />}
          {activeTab === 'Posts' && <Posts />}
          {activeTab === 'Replies' && <Replies />}
        </div>
      </ProfileLoader>
    </>
  )
}
