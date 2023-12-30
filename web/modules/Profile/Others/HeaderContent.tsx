import { usePathname } from 'next/navigation'
import React from 'react'
import useSWRImmutable from 'swr/immutable'

import { FindUserResponse } from '@/pages/api/profile/[username]'

import { UserPopover } from '.'

export function HeaderContent() {
  const pathname = usePathname()
  const username = pathname?.split('/')[1]
  const { data: user } = useSWRImmutable<FindUserResponse>(
    `/profile/${username}`
  )

  return (
    <>
      <h1 className="text-sm font-light">@{user?.username}</h1>

      <UserPopover user={user} />
    </>
  )
}
