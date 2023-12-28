import React from 'react'

import { Popover } from '@/components/UI'

import { useDialogActions } from '@/store'

export function AddBookmark() {
  const { openDialog } = useDialogActions()

  return (
    <Popover.Item
      onSelect={() => {
        openDialog('BOOKMARKS')
      }}
    >
      Add bookmark
    </Popover.Item>
  )
}
