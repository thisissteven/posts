import { usePathname } from 'next/navigation'
import * as React from 'react'
import useSWRImmutable from 'swr/immutable'

import { useUser } from '@/hooks'

import { RegularButton } from '@/components/UI'

import { FindUserResponse } from '@/pages/api/profile/[username]'

export function useHasBlock(
  children: () => React.ReactNode,
  customBlockedInfo?: () => React.ReactNode
) {
  const pathname = usePathname()

  const username = pathname?.split('/')[1]
  const { data: userData } = useSWRImmutable<FindUserResponse>(
    `/profile/${username}`
  )

  const { user: currentUser } = useUser()

  const hasBlock = userData?.blockedBy?.some(
    (value) => value?.id === currentUser?.id
  )

  const { data: viewAnyway, mutate } =
    useSWRImmutable<Record<string, boolean>>('/blocked-users')

  const showBlockedInfo = hasBlock && !viewAnyway?.[username]

  if (showBlockedInfo && customBlockedInfo) return customBlockedInfo()

  if (showBlockedInfo) {
    return (
      <div className="h-40 flex items-center justify-center">
        <div className="text-span font-medium">
          You blocked @{username} ·{' '}
          <RegularButton
            onClick={() => {
              mutate(
                {
                  [username]: true,
                },
                false
              )
            }}
            variant="underline"
            className="text-base"
          >
            View anyway
          </RegularButton>
        </div>
      </div>
    )
  }

  return children()
}
