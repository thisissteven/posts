import React from 'react'

import { useDialogState } from '@/hooks'

import { SharedDialog } from '@/components/UI'

import { useCurrentOpenDialog, useDialogActions } from '@/store'

import { BlockUserDialogContent } from './BlockUserDialogContent'

export function BlockUserDialog() {
  const dialogState = useDialogState()

  const open = useCurrentOpenDialog()
  const { closeDialog } = useDialogActions()

  React.useEffect(() => {
    if (open === 'BLOCK_USER') {
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
      <SharedDialog.Content className="max-w-[375px]">
        <BlockUserDialogContent />
      </SharedDialog.Content>
    </SharedDialog>
  )
}
