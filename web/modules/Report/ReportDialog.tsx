import React from 'react'

import { useDialogState } from '@/hooks'

import { SharedDialog } from '@/components/UI'

import { useGlobalDialogStore } from '@/store'

import { ReportDialogContent } from './ReportDialogContent'

export function ReportDialog() {
  const dialogState = useDialogState()

  const open = useGlobalDialogStore((state) => state.currentOpen)
  const closeDialog = useGlobalDialogStore((state) => state.closeDialog)

  React.useEffect(() => {
    if (open === 'REPORT') {
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
        <ReportDialogContent />
      </SharedDialog.Content>
    </SharedDialog>
  )
}
