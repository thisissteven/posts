import clsx from 'clsx'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import React from 'react'
import useSWRImmutable from 'swr/immutable'

import { cn } from '@/lib'
import { useUser, useWindowSize } from '@/hooks'

import { Chat, MoreIcon, RepostSmall } from '@/components/Icons'
import { Lightbox, Popover, RegularButton } from '@/components/UI'

import { ChatButton, LikeButton, RepostButton } from './Buttons'
import { OpenGraphCard } from './OpenGraphCard'
import { AddBookmark, CopyLinkToPost, DeletePost, ReportPost } from './Popover'
import { Avatar, UserDisplay } from './Profile'
import { ThreadText } from './ThreadText'

import { ThreadItem } from '@/types'

type ThreadProps = {
  thread: ThreadItem
  className?: string
  onClick?: () => void
  showRepost?: boolean
  isReply?: boolean
  hasReplyTo?: boolean
  isOnlyThread?: boolean
}

function getRepostedBy(isMyThread: boolean, thread: ThreadItem) {
  const reposts = thread.reposts
  if (!reposts) return null

  if (isMyThread) {
    return reposts[0]?.user?.username
  }

  return reposts[0]?.user?.username === thread.owner.username
    ? reposts[0]?.user?.username
    : null
}

export function Thread({
  thread,
  className,
  onClick,
  showRepost = false,
  isReply = false,
  hasReplyTo = false,
  isOnlyThread = false,
}: ThreadProps) {
  const { width } = useWindowSize()
  const { user } = useUser()

  const userId = user.id
  const ownerId = thread.owner.id

  const isOwner = userId === ownerId

  const align = width < 522 ? 'end' : 'start'

  const { data: isDeleted, mutate: mutateDeleted } = useSWRImmutable<unknown>(
    `/threads/${thread.id}/deleted`,
    () => false
  )

  const { data: viewAnyway, mutate: mutateViewAnyway } =
    useSWRImmutable<boolean>(
      `blocked-threads/${thread.owner.username}`,
      () => false
    )

  const hasBlock =
    thread.owner.blockedBy?.some((value) => value?.id === userId) && !viewAnyway

  const params = useParams()

  const isMyThread = params?.username === user.username

  const repostedBy = getRepostedBy(isMyThread, thread)

  const replyTo = thread.replyTo?.owner.username

  const hasReplies = Boolean(thread.replies && thread.replies.length > 0)

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
                mutateViewAnyway(true, {
                  revalidate: false,
                })
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

  return (
    <article
      onClick={onClick}
      role="article"
      className={cn(
        'cursor-pointer px-6 hover:bg-soft-black transition-colors duration-200',
        (!hasReplies || isOnlyThread) && 'border-b border-divider',
        'py-4',
        hasReplies && 'pt-4 pb-0',
        isReply && 'pb-4 pt-0',
        className
      )}
    >
      {showRepost && repostedBy && (
        <div className="ml-6 mb-2 flex items-center gap-2.5 text-sm font-light text-span">
          <RepostSmall />
          <div>
            <Link
              onClick={(e) => e.stopPropagation()}
              href={`/${repostedBy}`}
              className="hover:underline underline-offset-[3px]"
            >
              {repostedBy}
            </Link>{' '}
            reposted
          </div>
        </div>
      )}

      {hasReplies && !hasReplyTo && (
        <div className="ml-6 mb-2 flex items-center gap-2.5 text-sm font-light text-span">
          <Chat />
          <div>
            <Link
              onClick={(e) => e.stopPropagation()}
              href={`/${thread.replies?.[0].owner.username}`}
              className="hover:underline underline-offset-[3px]"
            >
              {thread.replies?.[0].owner.username}
            </Link>{' '}
            replied
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <div className="flex flex-col items-center">
          {isReply && <div className="h-4 w-[2px] bg-soft-background"></div>}
          <Avatar threadUser={thread.owner} />
          {hasReplies && !isOnlyThread && (
            <div className="flex-1 w-[2px] bg-soft-background"></div>
          )}
        </div>

        {Boolean(isDeleted) && (
          <div
            className={clsx(
              'w-full p-3.5 rounded-2xl border border-divider',
              isReply && 'mt-4',
              hasReplies && 'mb-4'
            )}
          >
            <p className="text-sm text-center text-span font-light">
              This post has been deleted.
            </p>
          </div>
        )}

        {!isDeleted && (
          <div
            className={clsx(
              'w-[calc(100%-60px)]',
              isReply && 'pt-4',
              hasReplies && 'pb-4'
            )}
          >
            <UserDisplay thread={thread} />

            {replyTo !== undefined && (
              <p className="mt-1 text-sm font-light text-span">
                Replying to{' '}
                <Link
                  onClick={(e) => e.stopPropagation()}
                  href={`/${replyTo}`}
                  className="text-soft-primary hover:underline underline-offset-[3px]"
                >
                  @{replyTo}
                </Link>
              </p>
            )}

            {thread.textContent && (
              <div className="mt-1">
                <ThreadText textContent={thread.textContent} />
              </div>
            )}

            {thread.embed && <OpenGraphCard embed={thread.embed} />}

            {thread.mediaType && thread.source && (
              <div className="mt-3">
                <Lightbox
                  mediaType={thread.mediaType}
                  source={thread.source}
                  highResSource={thread.highResSource}
                  height={thread.height}
                  width={thread.width}
                  alt={thread.alt}
                />
              </div>
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
                          mutateDeleted(true, {
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
        )}
      </div>
    </article>
  )
}
