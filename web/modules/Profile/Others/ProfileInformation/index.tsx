import Image from 'next/image'
import React from 'react'
import useSWRImmutable from 'swr/immutable'

import { DefaultProfileLarge, ReadIcon } from '@/components/Icons'
import { IconButton, Tooltip } from '@/components/UI'

import { UserBio } from '@/modules/Profile/Me'
import { useHasBlock } from '@/modules/Profile/TabContents/useHasBlock'
import { FindUserResponse } from '@/pages/api/profile/[username]'

import { FollowButton } from './FollowButton'
import { SendMessageDialog } from './SendMessageDialog'

export function ProfileInformation({ username }: { username: string }) {
  const { data: user } = useSWRImmutable<FindUserResponse>(
    `/profile/${username}`
  )

  const avatarUrl = user?.avatarUrl

  return (
    <>
      <div className="px-6 py-4 flex items-center gap-4">
        <div className="shrink-0 w-[92px] h-[92px] rounded-full bg-background border border-divider flex items-center justify-center overflow-hidden">
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              width={92}
              height={92}
              alt={username}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="scale-[200%]">
              <DefaultProfileLarge />
            </div>
          )}
        </div>

        <UserBio user={user} />
      </div>

      {useHasBlock(
        () => {
          return (
            <div className="mx-6 my-4 h-11 flex gap-2">
              <FollowButton user={user} />

              <SendMessageDialog />

              <Tooltip label="read.cv" side="top" sideOffset={6} tabIndex={-1}>
                <IconButton asChild>
                  <a href="https://read.cv" target="_blank">
                    <ReadIcon />
                  </a>
                </IconButton>
              </Tooltip>
            </div>
          )
        },
        () => (
          <div className="h-4"></div>
        )
      )}
    </>
  )
}

export * from './FollowButton'
