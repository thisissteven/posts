import React from 'react'

import { useDialog } from '@/components/UI'

import { NewThreadTemplate } from './NewThreadTemplate'

export function NewThreadDialog() {
  const { closeDialog } = useDialog()
  return (
    <section className="bg-background rounded-xl">
      <div className="flex p-6 gap-3 items-start">
        <NewThreadTemplate onSubmitted={closeDialog} canEscape={false} />
      </div>
    </section>
  )
}
