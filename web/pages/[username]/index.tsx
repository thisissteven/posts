import { usePathname } from 'next/navigation'
import React from 'react'
import useSWR from 'swr'
import useSWRImmutable from 'swr/immutable'

import { useUser } from '@/hooks'

import { Seo } from '@/components/Seo'

import { useUpdateRecentlyViewed } from '@/store'

import { Header, ProfileInfo, ProfileLoader } from '@/modules/Profile'
import { Media, Posts, ProfileTabs, Replies } from '@/modules/Profile'
import { getDescription, ProfileDialog } from '@/modules/Profile/Me'

import { FindUserResponse } from '../api/profile/[username]'

import { ProfileTab } from '@/types'

export default function ProfilePage() {
  const pathname = usePathname()
  const username = pathname?.split('/')[1]

  const { data, mutate } = useSWRImmutable<ProfileTab>(
    `/profile/tabs/${username}`,
    () => 'Posts' as const
  )

  const activeTab = data ?? 'Posts'

  const { data: user } = useSWR<FindUserResponse>(`/profile/${username}`)

  const { user: currentUser } = useUser()

  const updateRecentlyViewed = useUpdateRecentlyViewed()

  React.useEffect(() => {
    if (user && user.id !== currentUser.id) {
      updateRecentlyViewed({
        username: user.username!,
        avatarUrl: user.avatarUrl,
        displayName: user.displayName!,
        bio: getDescription(user),
        objectID: user.id,
      })
    }
  }, [currentUser.id, pathname, updateRecentlyViewed, user])

  return (
    <>
      <Seo title={user?.displayName ?? username} />
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
