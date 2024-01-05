import { Command } from 'cmdk'
import { useRouter } from 'next/navigation'
import React from 'react'

import { useUser } from '@/hooks'

import { useDialog } from '@/components/UI'

import { CommandMenuItem } from '.'

export function CommandMenuProfileItem() {
  const router = useRouter()

  const { closeDialog } = useDialog()

  const { user } = useUser()

  return (
    <Command.Group>
      <CommandMenuItem
        onSelect={(_) => {
          const profileUrl = `/${user.username}`.replace('@', '')
          router.push(profileUrl)
          closeDialog()
        }}
        username=""
        displayName="View profile"
        bio={null}
        id={user.id}
        avatarUrl={user.avatarUrl}
        value={`${user.displayName} ${user.username}`}
      />
    </Command.Group>
  )
}
