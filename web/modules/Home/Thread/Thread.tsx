import React from 'react'
import useSWRImmutable from 'swr/immutable'

import { cn } from '@/lib'
import { useUser, useWindowSize } from '@/hooks'

import { MoreIcon, RepostSmall } from '@/components/Icons'
import { Lightbox, Popover, RegularButton } from '@/components/UI'

import { ChatButton, LikeButton, RepostButton } from './Buttons'
import { AddBookmark, CopyLinkToPost, DeletePost, ReportPost } from './Popover'
import { Avatar, UserDisplay } from './Profile'
import { ThreadText } from './ThreadText'

import { ThreadItem } from '@/types'

type ThreadProps = {
  thread: ThreadItem
  className?: string
  onClick?: () => void
  showRepost?: boolean
}

export function Thread({
  thread,
  className,
  onClick,
  showRepost = false,
}: ThreadProps) {
  const { width } = useWindowSize()
  const { user } = useUser()

  const userId = user.id
  const ownerId = thread.owner.id

  const isOwner = userId === ownerId

  const align = width < 522 ? 'end' : 'start'

  const { data, mutate } = useSWRImmutable<unknown>(
    `/threads/${thread.id}/temp`,
    () => thread
  )

  const { data: viewAnyway, mutate: mutateViewAnyway } =
    useSWRImmutable<Record<string, boolean>>('/blocked-threads')

  const hasBlock =
    thread.owner.blockedBy?.some((value) => value?.id === userId) &&
    !viewAnyway?.[thread.owner.username]

  const repostedBy = thread.reposts && thread.reposts[0]?.user?.username

  if (hasBlock) {
    return (
      <div className="flex gap-3 px-6 py-5 border-b border-b-divider">
        <div className="pointer-events-none">
          <div className="w-12 h-12 bg-background rounded-full border border-divider"></div>
        </div>
        <div className="w-full p-3.5 rounded-2xl border border-divider">
          <div className="text-sm text-center text-span font-light">
            Blocked User ·{' '}
            <RegularButton
              onClick={() => {
                mutateViewAnyway(
                  {
                    [thread.owner.username]: true,
                  },
                  false
                )
              }}
              variant="underline"
              className="text-sm"
            >
              View anyway
            </RegularButton>
          </div>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex gap-3 px-6 py-5 border-b border-b-divider">
        <div className="pointer-events-none">
          <Avatar threadUser={thread.owner} />
        </div>
        <div className="w-full p-3.5 rounded-2xl border border-divider">
          <p className="text-sm text-center text-span font-light">
            This post has been deleted.
          </p>
        </div>
      </div>
    )
  }

  return (
    <article
      onClick={onClick}
      role="article"
      className={cn(
        'cursor-pointer px-6 py-4 border-b border-divider hover:bg-soft-hover transition-colors duration-200',
        className
      )}
    >
      {showRepost && repostedBy && (
        <div className="ml-6 mb-2 flex items-center gap-2.5 text-sm font-light text-span">
          <RepostSmall /> {repostedBy} reposted
        </div>
      )}
      <div className="flex gap-3">
        <Avatar threadUser={thread.owner} />
        <div className="flex-1">
          <UserDisplay thread={thread} />

          <div className="mt-1">
            <ThreadText textContent={thread.textContent} />
          </div>

          {thread.mediaType && thread.source && (
            <Lightbox
              mediaType={thread.mediaType}
              source={thread.source}
              highResSource={thread.highResSource}
              height={thread.height}
              width={thread.width}
              alt={thread.alt}
            />
          )}

          <div className="mt-4">
            <div className="grid grid-cols-4">
              <ChatButton thread={thread} />

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
                  {isOwner ? (
                    <DeletePost
                      threadId={thread.id}
                      onDelete={() => {
                        mutate(null, {
                          revalidate: false,
                        })
                      }}
                    />
                  ) : (
                    <ReportPost thread={thread} />
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
