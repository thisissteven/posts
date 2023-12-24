import React from 'react'

import { Popover } from '@/components/UI'

import { useGlobalDialogStore } from '@/store'

import { useAuth } from '@/modules/Auth'

import { ThreadItem } from '@/types'

export function ReportPost({ thread }: { thread: ThreadItem }) {
  const { session, openAuthDialog } = useAuth()

  const openDialog = useGlobalDialogStore((state) => state.openDialog)

  return (
    <Popover.Item
      className="text-danger-soft"
      onSelect={() => {
        if (!session) {
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
