import React from 'react'

import { useDialogState } from '@/hooks'

import { SharedDialog } from '@/components/UI'

import { useCurrentOpenDialog, useDialogActions } from '@/store'

import { AltDialogContent } from './AltDialogContent'

export function AltDialog() {
  const dialogState = useDialogState()

  const open = useCurrentOpenDialog()
  const { closeDialog } = useDialogActions()

  React.useEffect(() => {
    if (open === 'ALT') {
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
        <AltDialogContent />
      </SharedDialog.Content>
    </SharedDialog>
  )
}
