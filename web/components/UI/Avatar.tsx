import NextImage from 'next/image'
import * as React from 'react'

import { useUser } from '@/hooks'

import {
  Camera,
  DefaultProfile,
  DefaultProfileLarge,
  DefaultProfileMedium,
} from '@/components/Icons'

export function ThreadUserAvatar({
  threadUser = {
    username: '',
    avatarUrl: '',
  },
  style,
  defaultStyle,
  medium,
}: {
  threadUser: {
    username: string | null
    avatarUrl: string | null
  }
  style?: React.CSSProperties
  defaultStyle?: React.CSSProperties
  medium?: boolean
}) {
  const { user } = useUser()

  const isOwner = threadUser.username === user.username
  const imageUrl = isOwner ? user.avatarUrl : threadUser.avatarUrl

  if (!imageUrl && medium)
    return (
      <div
        style={defaultStyle}
        className="shrink-0 w-10 h-10 relative rounded-full overflow-hidden"
      >
        <DefaultProfileMedium />
      </div>
    )

  if (!imageUrl)
    return (
      <div
        style={defaultStyle}
        className="shrink-0 w-12 h-12 relative rounded-full overflow-hidden"
      >
        <DefaultProfileLarge />
      </div>
    )

  return (
    <div
      style={style}
      className="shrink-0 w-12 h-12 bg-black relative rounded-full overflow-hidden"
    >
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
  const { user } = useUser()

  const { avatarUrl, username } = user

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
        alt={username}
        className="object-cover w-full h-full"
      />
    </div>
  )
}

export function SidebarAvatar() {
  const { user } = useUser()

  const { avatarUrl, username } = user

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

export function SmallAvatar({
  avatarUrl,
  alt,
}: {
  avatarUrl?: string | null
  alt?: string | null
}) {
  if (!avatarUrl || !alt) {
    return (
      <div className="w-6 h-6 flex items-center justify-center m-1 active:opacity-80 rounded-full overflow-hidden bg-black">
        <div className="rounded-full bg-background overflow-hidden scale-150">
          <DefaultProfile />
        </div>
      </div>
    )
  }

  return (
    <div className="w-6 h-6 flex items-center justify-center m-1 active:opacity-80 rounded-full overflow-hidden bg-black">
      <NextImage
        src={avatarUrl}
        width={48}
        height={48}
        alt={alt}
        className="w-full h-full object-cover"
      />
    </div>
  )
}
