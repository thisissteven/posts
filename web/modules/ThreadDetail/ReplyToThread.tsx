import Image from 'next/image'
import React from 'react'

import { useUser } from '@/hooks'

import { DefaultProfileLarge } from '@/components/Icons'

import { NewThreadReplyTemplate } from './NewThreadReplyTemplate'

const ReplyToThread = React.memo(function ReplyToThread() {
  const { isAuthenticated, user } = useUser()

  if (!isAuthenticated) return null

  return (
    <div className="flex py-5 gap-3 items-start">
      <div className="shrink-0 w-12 h-12 rounded-full overflow-hidden">
        {user.avatarUrl ? (
          <div className="w-full h-full bg-black">
            <Image
              width={48}
              height={48}
              src={user.avatarUrl}
              alt="avatar"
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="bg-background">
            <DefaultProfileLarge />
          </div>
        )}
      </div>

      <NewThreadReplyTemplate id="reply-to-thread" />
    </div>
  )
})

export { ReplyToThread }
