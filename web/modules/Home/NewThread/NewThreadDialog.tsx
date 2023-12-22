import React from 'react'

import { onSubmit } from './Form'
import { NewThreadTemplate } from './NewThreadTemplate'

export function NewThreadDialog() {
  return (
    <section className="bg-background rounded-xl">
      <div className="flex p-6 gap-3 items-start">
        <NewThreadTemplate onSubmit={onSubmit} canEscape={false} />
      </div>
    </section>
  )
}
