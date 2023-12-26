import { usePathname } from 'next/navigation'
import React from 'react'
import useSWR from 'swr'

import { MoreIconWhite } from '@/components/Icons'
import { Overlay, Popover } from '@/components/UI'

import { FindUserResponse } from '@/pages/api/profile/[username]'

export function HeaderContent() {
  const pathname = usePathname()
  const username = pathname?.split('/')[1]
  const { data: user, isLoading } = useSWR<FindUserResponse>(
    `/profile/${username}`
  )

  return (
    <>
      <Overlay visible={isLoading} className="top-0 left-0 h-screen" />
      <h1 className="text-sm font-light">@{user?.username}</h1>

      <Popover>
        <Popover.Trigger asChild>
          <button className="relative ml-auto active:opacity-80 duration-200">
            <MoreIconWhite />
          </button>
        </Popover.Trigger>
        <Popover.Content>
          <Popover.Item onSelect={() => {}}>Report</Popover.Item>
          <Popover.Item onSelect={() => {}} className="text-danger">
            Block
          </Popover.Item>
        </Popover.Content>
      </Popover>
    </>
  )
}
