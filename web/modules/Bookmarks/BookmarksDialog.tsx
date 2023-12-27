import React from 'react'

import { useDialogState } from '@/hooks'

import { SharedDialog } from '@/components/UI'

import { useCurrentOpenDialog, useDialogActions } from '@/store'

import { BookmarksDialogContent } from './BookmarksDialogContent'

export function BookmarksDialog() {
  const dialogState = useDialogState()

  const open = useCurrentOpenDialog()
  const { closeDialog } = useDialogActions()

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
