import clsx from 'clsx'
import React from 'react'

import { Chat } from '@/components/Icons'

import { ThreadItem } from '@/types'

export function ChatButton({ thread }: { thread: ThreadItem }) {
  const repliesCount = thread.repliesCount

  return (
    <button className="flex items-center gap-2 group">
      <div className="group-active:scale-90">
        <Chat />
      </div>

      <span
        className={clsx(
          'text-xs text-span font-light',
          repliesCount > 0 ? 'opacity-100' : 'opacity-0'
        )}
      >
        {repliesCount}
      </span>
    </button>
  )
}
