import Image from 'next/image'
import React from 'react'
import useSWRImmutable from 'swr/immutable'

import { FollowList } from '@/lib'
import { useUser } from '@/hooks'

import { FindUserResponse } from '@/pages/api/profile/[username]'

import { useActiveTab } from './ActiveTabContext'
import { CrossFade } from './CrossFade'
import { EmptyPlaceholder } from './EmptyPlaceholder'
import { FollowButton } from './FollowButton'

function UserListContent({ data }: { data?: FollowList }) {
  const { user: currentUser } = useUser()
  return (
    <div className="space-y-3 py-4">
      {data?.list.map((data) => {
        const user = {
          ...data,
          followedBy: [
            {
              id: currentUser.id,
            },
          ],
        } as FindUserResponse
        return (
          <div
            key={data.id}
            className="flex items-center justify-between gap-5"
          >
            <div className="flex items-center gap-3">
              <div className="shrink-0 relative w-12 h-12 bg-black rounded-full overflow-hidden">
                <Image
                  src={data.avatarUrl}
                  width={48}
                  height={48}
                  alt={data.username}
                  className="object-cover w-full h-full"
                />
              </div>
              <div>
                <a
                  href={`/${data.username}`}
                  target="_blank"
                  className="text-sm font-light tracking-wide hover:underline underline-offset-[3px] line-clamp-1"
                >
                  {data.displayName}
                </a>
                <a
                  href={`/${data.username}`}
                  target="_blank"
                  className="text-xs font-light tracking-wide text-span hover:underline underline-offset-[3px] line-clamp-1"
                >
                  @{data.username}
                </a>
              </div>
            </div>

            <div className="shrink-0">
              <FollowButton user={user} />
            </div>
          </div>
        )
      })}
    </div>
  )
}

export function UserList() {
  const { activeTab } = useActiveTab()
  const { data: followers } = useSWRImmutable<FollowList>('/profile/followers')
  const { data: following } = useSWRImmutable<FollowList>('/profile/following')

  const currentIndex = activeTab === 'Following' ? 0 : 1

  const data = activeTab === 'Following' ? following : followers

  const content =
    data?.list?.length === 0 ? (
      <EmptyPlaceholder type={activeTab} />
    ) : (
      <UserListContent data={data} />
    )

  return (
    <>
      <CrossFade
        contentA={content}
        contentB={content}
        currentIndex={currentIndex}
      />
    </>
  )
}
