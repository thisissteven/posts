import React from 'react'

import { useUser } from '@/hooks'

import { MoreIconWhite } from '@/components/Icons'
import { Popover } from '@/components/UI'

import { useDialogActions } from '@/store'

import { useAuth } from '@/modules/Auth'
import { FindUserResponse } from '@/pages/api/profile/[username]'

export function UserPopover({ user }: { user?: FindUserResponse }) {
  const { isAuthenticated, user: currentUser } = useUser()
  const { openDialog } = useDialogActions()
  const { openAuthDialog } = useAuth()
  return (
    <Popover>
      <Popover.Trigger asChild>
        <button className="relative ml-auto active:opacity-80 duration-200">
          <MoreIconWhite />
        </button>
      </Popover.Trigger>
      <Popover.Content>
        <Popover.Item onSelect={() => {}}>Report</Popover.Item>
        <Popover.Item
          onSelect={() => {
            if (!isAuthenticated) {
              openAuthDialog()
              return
            }
            openDialog('BLOCK_USER', user)
          }}
          className="text-danger"
        >
          {user?.blockedBy?.some((value) => value?.id === currentUser?.id)
            ? 'Unblock'
            : 'Block'}
        </Popover.Item>
      </Popover.Content>
    </Popover>
  )
}
