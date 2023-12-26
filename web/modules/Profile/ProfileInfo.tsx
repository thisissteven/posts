import { usePathname } from 'next/navigation'
import React from 'react'

import { ProfileInformation } from './Me'
import { ProfileInformation as OthersProfileInformation } from './Others'
import { useAuth } from '../Auth'

export function ProfileInfo() {
  const pathname = usePathname()

  const username = pathname?.split('/')[1]

  const { isAuthenticated, session } = useAuth()

  const isMe =
    isAuthenticated && session && pathname === `/${session.user.username}`

  return isMe ? (
    <ProfileInformation />
  ) : (
    <OthersProfileInformation username={username} />
  )
}
