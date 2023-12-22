import React from 'react'

import { MoreIconWhite } from '@/components/Icons'
import { Popover } from '@/components/UI'

import { useAuth } from '@/modules/Auth'

export function HeaderContent() {
  const { signOut, session } = useAuth()

  const username = session?.user?.username as string

  return (
    <>
      <h1 className="text-sm font-light">@{username}</h1>

      <Popover>
        <Popover.Trigger asChild>
          <button className="relative ml-auto active:opacity-80 duration-200">
            <MoreIconWhite />
          </button>
        </Popover.Trigger>
        <Popover.Content>
          <Popover.Item onSelect={() => {}}>Settings</Popover.Item>
          <Popover.Item onSelect={signOut}>Log out</Popover.Item>
        </Popover.Content>
      </Popover>
    </>
  )
}
