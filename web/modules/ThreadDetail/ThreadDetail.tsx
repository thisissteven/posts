import clsx from 'clsx'
import React from 'react'
import useSWRImmutable from 'swr/immutable'

import { cn, formatDate } from '@/lib'
import { useUser, useWindowSize } from '@/hooks'

import { MoreIconLarge, RepostSmall } from '@/components/Icons'
import { Lightbox, Popover, RegularButton } from '@/components/UI'

import {
  AddBookmark,
  Avatar,
  ChatButtonDetail,
  CopyLinkToPost,
  DeletePost,
  LikeButtonDetail,
  OpenGraphCard,
  ReportPost,
  RepostButtonDetail,
  ThreadText,
  UserDisplayThreadDetail,
} from '@/modules/Thread'

import { LikesAndRepostsCount } from './LikesAndRepostsCount'
import { ReplyToThread } from './ReplyToThread'

import { ThreadItem } from '@/types'

type ThreadProps = {
  thread: ThreadItem
  className?: string
  showRepost?: boolean
}

export function ThreadDetail({
  thread,
  className,
  showRepost = false,
}: ThreadProps) {
  const { width } = useWindowSize()
  const { user, isAuthenticated } = useUser()

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

  const repostedBy = thread.reposts && thread.reposts[0]?.user?.username

  const hasReplyTo = !!thread.replyToId

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

  if (isDeleted) {
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
      role="article"
      className={cn(
        'px-6 border-b border-divider',
        !hasReplyTo && 'pt-4',
        className
      )}
    >
      {showRepost && repostedBy && (
        <div className="ml-6 mb-2 flex items-center gap-2.5 text-sm font-light text-span">
          <RepostSmall /> {repostedBy} reposted
        </div>
      )}

      <div className="flex items-center gap-3">
        <div className="relative flex flex-col items-center">
          {hasReplyTo && <div className="h-3 w-[2px] bg-soft-background"></div>}
          <Avatar threadUser={thread.owner} />
        </div>
        <UserDisplayThreadDetail thread={thread} />
      </div>

      <div className="flex-1">
        {thread.textContent && (
          <div className="mt-3">
            <ThreadText textSize="normal" textContent={thread.textContent} />
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

        <div className="mt-7 text-span font-light text-sm">
          {formatDate(thread.createdAt)}
        </div>

        <LikesAndRepostsCount thread={thread} />

        <div className="mt-4">
          <div
            className={clsx(
              'grid grid-cols-4 place-items-center py-3',
              isAuthenticated
                ? 'border-y border-y-divider'
                : 'border-t border-t-divider'
            )}
          >
            <ChatButtonDetail thread={thread} />

            <RepostButtonDetail thread={thread} />

            <LikeButtonDetail thread={thread} />

            <Popover>
              <Popover.Trigger asChild>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                  }}
                  className="relative group flex w-full items-center justify-center"
                >
                  <div className="group-active:scale-95 origin-left group-active:opacity-90 duration-150">
                    <MoreIconLarge />
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

        <ReplyToThread thread={thread} />
      </div>
    </article>
  )
}
