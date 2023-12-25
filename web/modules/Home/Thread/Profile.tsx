import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import { getRelativeTimeString } from '@/lib'

import { DefaultProfileLarge } from '@/components/Icons'

import { ThreadItem, ThreadOwner } from '@/types'

export function Avatar({ threadUser }: { threadUser: ThreadOwner }) {
  return (
    <Link
      scroll={false}
      onClick={(e) => {
        e.stopPropagation()
      }}
      href={`/${threadUser.username}`}
      className="h-fit"
    >
      <div className="w-12 h-12 rounded-full overflow-hidden">
        {threadUser.avatarUrl ? (
          <Image
            width={48}
            height={48}
            src={threadUser.avatarUrl}
            alt="avatar"
          />
        ) : (
          <DefaultProfileLarge />
        )}
      </div>
    </Link>
  )
}

export function UserDisplay({ thread }: { thread: ThreadItem }) {
  const { owner: threadOwner, createdAt } = thread
  return (
    <p className="text-sm space-x-1">
      <Link
        scroll={false}
        onClick={(e) => {
          e.stopPropagation()
        }}
        href={`/${threadOwner.username}`}
        className="hover:underline underline-offset-[3px]"
      >
        {threadOwner.displayName}
      </Link>
      <span className="text-[13px] text-span space-x-1">
        <Link
          scroll={false}
          onClick={(e) => {
            e.stopPropagation()
          }}
          href={`/${threadOwner.username}`}
          className="hover:underline underline-offset-[3px]"
        >
          @{threadOwner.username}
        </Link>
        <span>·</span>
        <Link
          onClick={(e) => {
            e.stopPropagation()
          }}
          href={`/${threadOwner.username}/${thread.id}`}
          className="hover:underline underline-offset-[3px]"
        >
          {getRelativeTimeString(new Date(createdAt))}
        </Link>
      </span>
    </p>
  )
}
