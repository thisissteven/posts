import React from 'react'

import { useMutation } from '@/hooks'

import { RegularButton, SharedDialog, Textarea } from '@/components/UI'

import { useDialogArgs } from '@/store'

import { ThreadItem } from '@/types'

export function ReportDialogContent() {
  const thread = useDialogArgs() as ThreadItem

  const [reason, setReason] = React.useState('')

  const { trigger, status } = useMutation(`/threads/report/${thread.id}`)

  if (status.state === 'success') {
    return (
      <div className="bg-background p-6">
        <p className="mt-3 text-sm text-soft-primary font-light leading-6">
          Thank you for the report.
        </p>
        <p className="text-sm text-primary font-light leading-6">
          We will review it as soon as possible.
        </p>

        <div className="mt-3 flex justify-end gap-3">
          <SharedDialog.Trigger asChild>
            <RegularButton variant="secondary">Done</RegularButton>
          </SharedDialog.Trigger>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-background p-6">
      <p className="mt-3 text-sm text-primary font-light leading-6">
        Report{' '}
        <span className="text-soft-primary">{thread.owner.username}'s</span>{' '}
        thread ?
      </p>
      <Textarea
        style={{
          height: '40px',
        }}
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        className="mt-2"
        placeholder="Tell us more about this report"
      />
      <div className="mt-3 flex justify-end gap-3">
        <SharedDialog.Trigger asChild>
          <RegularButton variant="underline">Cancel</RegularButton>
        </SharedDialog.Trigger>
        <RegularButton
          onClick={async () => {
            await trigger({
              reason,
            })
          }}
          disabled={reason.length === 0}
          isLoading={status.state === 'loading'}
          variant="secondary"
          className="text-danger disabled:bg-soft-background disabled:text-span"
        >
          Report
        </RegularButton>
      </div>
    </div>
  )
}
