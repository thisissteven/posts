import clsx from 'clsx'
import React from 'react'

import { Chat, ChatLarge } from '@/components/Icons'

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

export function ChatButtonDetail({ thread }: { thread: ThreadItem }) {
  const repliesCount = thread.repliesCount

  return (
    <button className="flex items-center justify-center gap-2 group w-full">
      <div className="group-active:scale-90">
        <ChatLarge />
      </div>

      <span
        className={clsx(
          'text-sm text-span font-light',
          repliesCount > 0 ? 'opacity-100' : 'opacity-0'
        )}
      >
        {repliesCount}
      </span>
    </button>
  )
}
