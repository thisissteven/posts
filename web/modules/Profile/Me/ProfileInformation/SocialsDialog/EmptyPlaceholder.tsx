import * as React from 'react'

import { SocialTab } from '@/types'

export function EmptyPlaceholder({ type }: { type: SocialTab }) {
  const textToDisplay = type === 'Following' ? 'you follow' : 'who follow you'
  const textContent = `People ${textToDisplay} will appear here. `

  return (
    <div className="w-full h-full grid place-items-center">
      <p className="text-soft-primary text-sm font-light">
        <span>{textContent}</span>
        <a
          className="text-primary font-normal hover:underline underline-offset-[3px]"
          href="https://read.cv/support/8UvMgLkEG7iBhSjoCJHj"
          target="_blank"
        >
          Learn more.
        </a>
      </p>
    </div>
  )
}
