import { Command } from 'cmdk'
import { useRouter } from 'next/navigation'
import React from 'react'

import { useDialog } from '@/components/UI'

import { CommandMenuItem } from '.'

export function CommandMenuProfileItem() {
  const router = useRouter()

  const { closeDialog } = useDialog()

  return (
    <Command.Group>
      <CommandMenuItem
        onSelect={(value) => {
          const profileUrl = `/${value}`.replace('@', '')
          router.push(profileUrl)
          closeDialog()
        }}
        username="@steven2801"
        displayName="View profile"
        description=""
        avatar="https://picsum.photos/36/36"
        alt="view profile"
      />
    </Command.Group>
  )
}
