import clsx from 'clsx'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import React from 'react'
import useSWR from 'swr'

import { FollowList } from '@/lib'

import { FindUserResponse } from '@/pages/api/profile/[username]'

export function ProfileLoader({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const isAuthenticated = status === 'authenticated'

  const pathname = usePathname()
  const username = pathname?.split('/')[1]

  const isMe =
    isAuthenticated && session && pathname === `/${session.user.username}`

  const { isLoading: isLoadingFollowers, data: followersData } =
    useSWR<FollowList>(!isMe ? null : '/profile/followers')
  const { isLoading: isLoadingFollowing, data: followingData } =
    useSWR<FollowList>(!isMe ? null : '/profile/following')

  const { isLoading: isLoadingUser, data: userData } = useSWR<FindUserResponse>(
    isMe ? null : `/profile/${username}`
  )

  const hasData = isMe
    ? Boolean(followersData) && Boolean(followingData)
    : Boolean(userData)

  const isLoading =
    isLoadingFollowers || isLoadingFollowing || isLoadingUser || !username

  if (hasData) return children

  return (
    <div
      className={clsx(
        'transition-opacity ease-in-out duration-300',
        isLoading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      )}
    >
      {children}
    </div>
  )
}
