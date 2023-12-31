import React from 'react'
import useSWRImmutable from 'swr/immutable'

import { useUser } from '@/hooks'

import { PencilIcon, ReadIcon } from '@/components/Icons'
import { IconButton, Tooltip } from '@/components/UI'

import { useDialogActions } from '@/store'

import { EditProfilePhoto } from '@/modules/Profile/Me'
import { FindUserResponse } from '@/pages/api/profile/[username]'

import Followers from './Followers'
import { Following } from './Following'
import { UserBio } from './UserBio'

export function ProfileInformation() {
  const {
    user: { username },
  } = useUser()
  const { data: user } = useSWRImmutable<FindUserResponse>(
    `/profile/${username}`
  )

  const { openDialog } = useDialogActions()

  return (
    <>
      <div className="px-6 py-4 flex items-center gap-4">
        <EditProfilePhoto />

        <UserBio user={user} />
      </div>

      <div className="mx-6 my-4 h-11 flex gap-2">
        <Following />
        <Followers />

        <Tooltip label="read.cv" side="top" sideOffset={6} tabIndex={-1}>
          <IconButton asChild>
            <a href="https://read.cv" target="_blank">
              <ReadIcon />
            </a>
          </IconButton>
        </Tooltip>

        <Tooltip label="Edit profile" side="top" asChild>
          <IconButton
            variant="filled"
            onClick={() => {
              openDialog('EDIT_PROFILE')
            }}
          >
            <PencilIcon />
          </IconButton>
        </Tooltip>
      </div>
    </>
  )
}

export * from './UserBio'
