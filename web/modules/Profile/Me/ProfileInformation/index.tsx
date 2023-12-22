import Image from 'next/image'
import React from 'react'

import { Camera, PencilIcon, ReadIcon } from '@/components/Icons'
import { IconButton, Tooltip } from '@/components/UI'

import { useAuth } from '@/modules/Auth'

import Followers from './Followers'
import { Following } from './Following'

export function ProfileInformation() {
  const { isAuthenticated, session } = useAuth()

  if (!isAuthenticated) return null

  const hasImage = Boolean(session?.user?.avatarUrl)
  const hasUsername = Boolean(session?.user?.username)

  const userAvatarUrl = session?.user?.avatarUrl as string
  const username = session?.user?.username as string

  const displayName = session?.user?.displayName as string

  const hasProfilePhoto = hasImage && hasUsername

  return (
    <>
      <div className="px-6 py-4 flex items-center gap-4">
        <div className="w-[92px] h-[92px] rounded-full bg-background border border-divider flex items-center justify-center">
          {hasProfilePhoto ? (
            <Image src={userAvatarUrl} width={24} height={24} alt={username} />
          ) : (
            <Camera />
          )}
        </div>

        <p className="text-lg">{displayName}</p>
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
          <IconButton variant="filled">
            <PencilIcon />
          </IconButton>
        </Tooltip>
      </div>
    </>
  )
}
