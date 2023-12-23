import { useSession } from 'next-auth/react'
import React from 'react'

import { cn } from '@/lib'
import { useWindowSize } from '@/hooks'

import { Chat, MoreIcon } from '@/components/Icons'
import { Lightbox, LikeButton, Popover, RepostButton } from '@/components/UI'

import { AddBookmark, CopyLinkToPost } from './Popover'
import { Avatar, UserDisplay } from './Profile'

import { ThreadItem } from '@/types'

type ThreadProps = {
  thread: ThreadItem
  className?: string
  onClick?: () => void
}

export function Thread({ thread, className, onClick }: ThreadProps) {
  const { width } = useWindowSize()
  const { data: session } = useSession()

  const align = width < 522 ? 'end' : 'start'

  return (
    <article
      onClick={onClick}
      role="article"
      className={cn(
        'cursor-pointer px-6 py-5 hover:bg-soft-black duration-200',
        className
      )}
    >
      <div className="flex gap-3">
        <Avatar threadUser={thread.owner} />
        <div className="flex-1">
          <UserDisplay thread={thread} />

          <div className="mt-1">
            <p className="text-sm text-soft-primary font-light">
              {thread.textContent}
            </p>
          </div>

          {thread.mediaType && thread.source && (
            <Lightbox
              mediaType={thread.mediaType}
              source={thread.source}
              highResSource={thread.highResSource}
              height={thread.height}
              width={thread.width}
            />
          )}

          <div className="mt-4">
            <div className="grid grid-cols-4">
              <button className="flex items-center gap-2 group">
                <div className="group-active:scale-90">
                  <Chat />
                </div>

                <span className="text-xs text-span font-light">1</span>
              </button>

              <RepostButton thread={thread} />

              <LikeButton thread={thread} />

              <Popover>
                <Popover.Trigger asChild>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                    }}
                    className="relative group flex w-full justify-center -translate-x-[calc(50%-18.5px)]"
                  >
                    <div className="group-active:scale-95 origin-left group-active:opacity-90 duration-150">
                      <MoreIcon />
                    </div>
                  </button>
                </Popover.Trigger>
                <Popover.Content align={align}>
                  <AddBookmark />
                  <CopyLinkToPost thread={thread} />
                  {thread.owner.id === session?.user.id ? (
                    <Popover.Item
                      className="text-danger-soft"
                      onSelect={() => {}}
                    >
                      Delete Post
                    </Popover.Item>
                  ) : (
                    <Popover.Item
                      className="text-danger-soft"
                      onSelect={() => {}}
                    >
                      Report post
                    </Popover.Item>
                  )}
                </Popover.Content>
              </Popover>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}
