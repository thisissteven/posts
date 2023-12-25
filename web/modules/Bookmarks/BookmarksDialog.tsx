import React from 'react'

import { useDialogState } from '@/hooks'

import { SharedDialog } from '@/components/UI'

import { useGlobalDialogStore } from '@/store'

import { BookmarksDialogContent } from './BookmarksDialogContent'

export function BookmarksDialog() {
  const dialogState = useDialogState()

  const open = useGlobalDialogStore((state) => state.currentOpen)
  const closeDialog = useGlobalDialogStore((state) => state.closeDialog)

  React.useEffect(() => {
    if (open === 'BOOKMARKS') {
      dialogState.onOpenChange(true)
    } else {
      dialogState.onOpenChange(false)
    }
  }, [open, dialogState])

  return (
    <SharedDialog
      dialogState={{
        ...dialogState,
        onOpenChange(open) {
          if (!open) closeDialog()
          dialogState.onOpenChange(open)
        },
      }}
    >
      <SharedDialog.Content className="max-w-[415px]">
        <BookmarksDialogContent />
      </SharedDialog.Content>
    </SharedDialog>
  )
}
