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

function getDescription(user?: FindUserResponse) {
  const pronounOnly = user?.pronouns && !user?.profession && !user?.location
  const professionOnly = user?.profession && !user?.location && !user?.pronouns
  const locationOnly = user?.location && !user?.profession && !user?.pronouns

  const pronounAndProfession =
    user?.pronouns && user?.profession && !user?.location
  const professionAndLocation =
    user?.profession && user?.location && !user?.pronouns

  const nothing = !user?.profession && !user?.location && !user?.pronouns

  if (nothing) {
    return ''
  }

  if (professionOnly) {
    return user?.profession
  }

  if (locationOnly) {
    return user?.location
  }

  if (pronounOnly) {
    return user?.pronouns
  }

  if (professionAndLocation) {
    return `${user?.profession} in ${user?.location}`
  }

  if (pronounAndProfession) {
    return `${user?.profession}, ${user?.pronouns}`
  }

  return `${user?.profession} in ${user?.location}, ${user?.pronouns}`
}

export function ProfileInformation() {
  const {
    user: { username, displayName },
  } = useUser()
  const { data: user } = useSWRImmutable<FindUserResponse>(
    `/profile/${username}`
  )

  const { openDialog } = useDialogActions()

  const description = getDescription(user)

  const website = user?.website?.replace('https://', '').replace('http://', '')

  const href =
    !website?.startsWith('http://') && !website?.startsWith('https://')
      ? 'https://' + website
      : website

  return (
    <>
      <div className="px-6 py-4 flex items-center gap-4">
        <EditProfilePhoto />

        <div>
          <div className="text-2xl font-light">{displayName}</div>
          <div className="text-sm text-soft-primary">{description}</div>
          {website && (
            <div className="mt-1.5">
              <a
                href={href}
                className="active:bg-website-active bg-website px-3 py-1 rounded-full text-xs font-light tracking-wide w-fit text-soft-primary"
                target="_blank"
              >
                {website}
              </a>
            </div>
          )}
        </div>
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
