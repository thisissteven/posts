import React from 'react'

import { Popover } from '@/components/UI'

import { ThreadItem } from '@/types'

export function CopyLinkToPost({ thread }: { thread: ThreadItem }) {
  const [isCopied, setIsCopied] = React.useState(false)
  return (
    <Popover.Item
      onSelect={() => {
        navigator.clipboard.writeText(
          `${process.env.NEXT_PUBLIC_BASE_URL}/${thread.owner.username}/${thread.id}`
        )
        setIsCopied(true)
      }}
    >
      {isCopied ? 'Copied!' : 'Copy link to post'}
    </Popover.Item>
  )
}
