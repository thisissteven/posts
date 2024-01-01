import Link from 'next/link'

import { LikeActiveLarge } from '@/components/Icons'
import { ThreadUserAvatar } from '@/components/UI'

import { GetUserNotificationsResponse } from '@/pages/api/notifications'

import { NotificationProps } from '.'

export function LikeNotification({ notification, onClick }: NotificationProps) {
  if (
    !notification.likedByNotification ||
    !notification.likedByNotification.length
  )
    return null

  const thread = notification.thread
  const likers = notification.likedByNotification

  return (
    <li
      onClick={onClick}
      className="px-6 py-5 flex gap-3 border-b border-b-divider hover:bg-soft-black active:bg-soft-black cursor-pointer"
    >
      <div className="w-10 h-10 flex items-center justify-end">
        <LikeActiveLarge />
      </div>

      <div>
        <ul className="flex gap-2">
          {likers.map(({ likedBy }) => {
            return (
              <li key={likedBy.username}>
                <Link
                  onClick={(e) => {
                    e.stopPropagation()
                  }}
                  href={`/${likedBy.username}`}
                >
                  <ThreadUserAvatar
                    medium
                    style={{
                      width: 40,
                      height: 40,
                    }}
                    threadUser={{
                      username: likedBy.username,
                      avatarUrl: likedBy.avatarUrl,
                    }}
                  />
                </Link>
              </li>
            )
          })}
        </ul>

        <p className="mt-2 text-sm font-light">
          <PostLikers likers={likers} />
        </p>

        <div className="mt-0.5 text-sm font-light text-span">
          {thread?.textContent}
        </div>
      </div>
    </li>
  )
}

function PostLikers({
  likers,
}: {
  likers: GetUserNotificationsResponse[number]['likedByNotification']
}) {
  if (likers.length === 1) {
    return <span>{likers[0].likedBy.username} liked your post</span>
  }

  if (likers.length === 2) {
    return (
      <span>
        {likers[0].likedBy.username} and {likers[1].likedBy.username} liked your
        post
      </span>
    )
  }

  if (likers.length === 3) {
    return (
      <span>
        {likers[0].likedBy.username}, {likers[1].likedBy.username} and{' '}
        {likers[2].likedBy.username} liked your post
      </span>
    )
  }

  return (
    <span>
      {likers[0].likedBy.username}, {likers[1].likedBy.username},{' '}
      {likers[2].likedBy.username}, and others liked your post
    </span>
  )
}
