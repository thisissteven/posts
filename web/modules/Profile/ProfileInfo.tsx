import { usePathname } from 'next/navigation'
import React from 'react'

import { ProfileInformation } from './Me'
import { ProfileInformation as OthersProfileInformation } from './Others'
import { useAuth } from '../Auth'

export function ProfileInfo() {
  const pathname = usePathname()

  const { isAuthenticated, session } = useAuth()

  return isAuthenticated &&
    session &&
    pathname === `/${session.user.username}` ? (
    <ProfileInformation />
  ) : (
    <OthersProfileInformation />
  )
}
