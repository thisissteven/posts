import { usePathname } from 'next/navigation'
import React from 'react'

import { useDelayedIsAuthenticated, useUser } from '@/hooks'

import { ProfileInformation } from './Me'
import { ProfileInformation as OthersProfileInformation } from './Others'

export function ProfileInfo() {
  const pathname = usePathname()

  const username = pathname?.split('/')[1]

  const { user } = useUser()

  const isAuthenticated = useDelayedIsAuthenticated()

  const isMe = isAuthenticated && pathname === `/${user.username}`

  return isMe ? (
    <ProfileInformation />
  ) : (
    <OthersProfileInformation username={username} />
  )
}
