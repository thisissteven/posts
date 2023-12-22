import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import { getRelativeTimeString } from '@/lib'

import { ThreadItem, ThreadUser } from '@/types'

export function Avatar({ threadUser }: { threadUser: ThreadUser }) {
  return (
    <Link
      onClick={(e) => {
        e.stopPropagation()
      }}
      href={`/${threadUser.username}`}
      className="h-fit"
    >
      <div className="w-12 h-12 rounded-full overflow-hidden bg-soft-background">
        <Image width={48} height={48} src={threadUser.avatarUrl} alt="avatar" />
      </div>
    </Link>
  )
}

export function UserDisplay({ thread }: { thread: ThreadItem }) {
  const { threadUser, lastActivity } = thread
  return (
    <p className="text-sm space-x-1">
      <Link
        onClick={(e) => {
          e.stopPropagation()
        }}
        href={`/${threadUser.username}`}
        className="hover:underline underline-offset-[3px]"
      >
        {threadUser.displayName}
      </Link>
      <span className="text-[13px] text-span space-x-1">
        <Link
          onClick={(e) => {
            e.stopPropagation()
          }}
          href={`/${threadUser.username}`}
          className="hover:underline underline-offset-[3px]"
        >
          @{threadUser.username}
        </Link>
        <span>·</span>
        <Link
          onClick={(e) => {
            e.stopPropagation()
          }}
          href={`/${threadUser.username}/${thread.id}`}
          className="hover:underline underline-offset-[3px]"
        >
          {getRelativeTimeString(new Date(lastActivity))}
        </Link>
      </span>
    </p>
  )
}
