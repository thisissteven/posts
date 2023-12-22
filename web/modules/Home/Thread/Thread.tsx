import React from 'react'

import { cn } from '@/lib'
import { useWindowSize } from '@/hooks'

import { Chat, MoreIcon } from '@/components/Icons'
import { Lightbox, LikeButton, Popover, RepostButton } from '@/components/UI'

import AddBookmark from './Popover/AddBookmark'
import { Avatar, UserDisplay } from './Profile'

import { ThreadItem } from '@/types'

type ThreadProps = {
  thread: ThreadItem
  className?: string
  onClick?: () => void
}

export function Thread({ thread, className, onClick }: ThreadProps) {
  const { width } = useWindowSize()

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
        <Avatar threadUser={thread.threadUser} />
        <div className="flex-1">
          <UserDisplay thread={thread} />

          <div className="mt-1">
            <p className="text-sm text-soft-primary font-light">
              {thread.threadContent.textContent}
            </p>
          </div>

          <Lightbox
            mediaType={thread.threadContent.mediaType}
            source={thread.threadContent.mediaSource}
            highResSource={thread.threadContent.highResMediaSource}
          />

          <div className="mt-4">
            <div className="grid grid-cols-4">
              <button className="flex items-center gap-2 group">
                <div className="group-active:scale-90">
                  <Chat />
                </div>

                <span className="text-xs text-span font-light">1</span>
              </button>

              <RepostButton threadId="123" />

              <LikeButton threadId="123" />

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
                  <Popover.Item onSelect={() => {}}>
                    Copy link to post
                  </Popover.Item>
                  {thread.isOwnThread ? (
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
