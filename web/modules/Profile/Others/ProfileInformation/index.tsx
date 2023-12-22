import React from 'react'

import { ReadIcon, RepliesIconFilled } from '@/components/Icons'
import { IconButton, RegularButton, Tooltip } from '@/components/UI'

export function ProfileInformation() {
  return (
    <>
      <div className="px-6 py-4 flex items-center gap-4">
        <div className="w-[92px] h-[92px] rounded-full bg-background border border-divider flex items-center justify-center">
          {/* {hasProfilePhoto ? (
            <Image src={userAvatarUrl} width={24} height={24} alt={username} />
          ) : (
            <Camera />
          )} */}
        </div>

        <p className="text-lg">user</p>
      </div>

      <div className="mx-6 my-4 h-11 flex gap-2">
        <RegularButton className="flex-1 rounded-full font-medium">
          Follow
        </RegularButton>

        <Tooltip label="Edit profile" side="top" asChild>
          <IconButton variant="filled">
            <div className="-translate-x-0.5">
              <RepliesIconFilled />
            </div>
          </IconButton>
        </Tooltip>

        <Tooltip label="read.cv" side="top" sideOffset={6} tabIndex={-1}>
          <IconButton asChild>
            <a href="https://read.cv" target="_blank">
              <ReadIcon />
            </a>
          </IconButton>
        </Tooltip>
      </div>
    </>
  )
}
