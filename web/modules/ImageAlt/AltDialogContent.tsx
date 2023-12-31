import React from 'react'

import { RegularButton, SharedDialog } from '@/components/UI'

import { useDialogArgs } from '@/store'

export function AltDialogContent() {
  const altText = useDialogArgs()

  return (
    <div className="bg-background p-6 space-y-2">
      <p className="font-medium text-lg">Alt text</p>
      <p className="text-sm">{altText}</p>

      <div className="flex justify-end">
        <SharedDialog.Close asChild>
          <RegularButton variant="secondary">Done</RegularButton>
        </SharedDialog.Close>
      </div>
    </div>
  )
}
