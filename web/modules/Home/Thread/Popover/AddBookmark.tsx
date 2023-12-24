import React from 'react'

import { Popover } from '@/components/UI'

import { useGlobalDialogStore } from '@/store'

export function AddBookmark() {
  const openDialog = useGlobalDialogStore((state) => state.openDialog)

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
