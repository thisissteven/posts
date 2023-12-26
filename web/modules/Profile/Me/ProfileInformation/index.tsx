import { useSession } from 'next-auth/react'
import React from 'react'

import { PencilIcon, ReadIcon } from '@/components/Icons'
import { IconButton, Tooltip } from '@/components/UI'

import { useGlobalDialogStore } from '@/store'

import { EditProfilePhoto } from '@/modules/Profile/Me'

import Followers from './Followers'
import { Following } from './Following'

export function ProfileInformation() {
  const { data: session } = useSession()

  const openDialog = useGlobalDialogStore((state) => state.openDialog)

  return (
    <>
      <div className="px-6 py-4 flex items-center gap-4">
        <EditProfilePhoto />

        <p className="text-lg">{session?.user.displayName}</p>
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
