import React from 'react'

import { NewThreadTemplate } from './NewThreadTemplate'

export function NewThreadDialog() {
  return (
    <section className="bg-background rounded-xl">
      <div className="flex p-6 gap-3 items-start">
        <NewThreadTemplate canEscape={false} />
      </div>
    </section>
  )
}
