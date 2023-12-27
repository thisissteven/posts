import { usePathname } from 'next/navigation'
import React from 'react'

import { useUser } from '@/hooks'

import { ProfileInformation } from './Me'
import { ProfileInformation as OthersProfileInformation } from './Others'

export function ProfileInfo() {
  const pathname = usePathname()

  const username = pathname?.split('/')[1]

  const { isAuthenticated, user } = useUser()

  const isMe = isAuthenticated && pathname === `/${user.username}`

  return isMe ? (
    <ProfileInformation />
  ) : (
    <OthersProfileInformation username={username} />
  )
}
