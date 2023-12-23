import React from 'react'

import { Popover } from '@/components/UI'

import { useBookmarksDialog } from '@/modules/Bookmarks'

export function AddBookmark() {
  const { openBookmarksDialog } = useBookmarksDialog()

  return (
    <Popover.Item
      onSelect={() => {
        openBookmarksDialog()
      }}
    >
      Add bookmark
    </Popover.Item>
  )
}
