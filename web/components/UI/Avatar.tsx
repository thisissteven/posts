import NextImage from 'next/image'
import { useSession } from 'next-auth/react'
import React from 'react'

import { Camera, DefaultProfile, DefaultProfileLarge } from '@/components/Icons'

import { ThreadOwner } from '@/types'

export function ThreadUserAvatar({ threadUser }: { threadUser: ThreadOwner }) {
  const { data: session } = useSession()

  const isOwner = threadUser.username === session?.user.username
  const imageUrl = isOwner ? session?.user?.avatarUrl : threadUser.avatarUrl

  if (!imageUrl)
    return (
      <div className="w-12 h-12 relative rounded-full overflow-hidden">
        <DefaultProfileLarge />
      </div>
    )

  return (
    <div className="w-12 h-12 bg-black relative rounded-full overflow-hidden">
      <NextImage
        width={48}
        height={48}
        src={imageUrl}
        alt="avatar"
        className="w-full h-full object-cover"
      />
    </div>
  )
}

export function ProfileAvatar({ isLoading }: { isLoading: boolean }) {
  const { data: session } = useSession()

  const avatarUrl = session?.user?.avatarUrl
  const username = session?.user?.username

  if (isLoading) return null

  if (!avatarUrl) {
    return (
      <div className="w-full h-full bg-background flex items-center justify-center">
        <Camera />
      </div>
    )
  }

  return (
    <div className="w-full h-full bg-black">
      <NextImage
        src={avatarUrl}
        width={92}
        height={92}
        alt={username ?? 'profile'}
        className="object-cover w-full h-full"
      />
    </div>
  )
}

export function SidebarAvatar() {
  const { data: session } = useSession()

  const avatarUrl = session?.user?.avatarUrl
  const username = session?.user?.username

  if (!avatarUrl || !username) {
    return (
      <div className="rounded-full bg-background overflow-hidden scale-150">
        <DefaultProfile />
      </div>
    )
  }

  return (
    <NextImage
      src={avatarUrl}
      width={48}
      height={48}
      alt={username}
      className="w-full h-full object-cover"
    />
  )
}
