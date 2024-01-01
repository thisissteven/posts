import { usePathname } from 'next/navigation'
import React from 'react'
import useSWRImmutable from 'swr/immutable'

import { useUser } from '@/hooks'

import { FindUserResponse } from '@/pages/api/profile/[username]'

import { UserPopover } from '.'

export function HeaderContent() {
  const pathname = usePathname()
  const username = pathname?.split('/')[1]
  const { data: user } = useSWRImmutable<FindUserResponse>(
    `/profile/${username}`
  )

  const { user: currentUser } = useUser()

  const followsMe = user?.following?.some((u) => u.id === currentUser.id)
  const textContent = followsMe ? (
    <span className="text-span">follows you</span>
  ) : null

  return (
    <>
      <h1 className="text-sm font-light">
        @{user?.username} {textContent}
      </h1>

      <UserPopover user={user} />
    </>
  )
}
