import React from 'react'

import { Popover } from '@/components/UI'

import { useDialogActions } from '@/store'

import { useAuth } from '@/modules/Auth'

import { ThreadItem } from '@/types'

export function ReportPost({ thread }: { thread: ThreadItem }) {
  const { openAuthDialog, isAuthenticated } = useAuth()

  const { openDialog } = useDialogActions()

  return (
    <Popover.Item
      className="text-danger-soft"
      onSelect={() => {
        if (!isAuthenticated) {
          openAuthDialog()
        } else {
          openDialog('REPORT', thread)
        }
      }}
    >
      Report post
    </Popover.Item>
  )
}
