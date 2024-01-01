import Link from 'next/link'

import { LikeActiveLarge } from '@/components/Icons'
import { ThreadUserAvatar } from '@/components/UI'

import { GetUserNotificationsResponse } from '@/pages/api/notifications'

import { NotificationProps } from '.'

export function RepostNotification({
  notification,
  onClick,
}: NotificationProps) {
  if (
    !notification.repostedByNotification ||
    !notification.repostedByNotification.length
  )
    return null

  const thread = notification.thread
  const reposters = notification.repostedByNotification

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
          {reposters.map(({ repostedBy }) => {
            return (
              <li key={repostedBy.username}>
                <Link
                  onClick={(e) => {
                    e.stopPropagation()
                  }}
                  href={`/${repostedBy.username}`}
                >
                  <ThreadUserAvatar
                    medium
                    style={{
                      width: 40,
                      height: 40,
                    }}
                    threadUser={{
                      username: repostedBy.username,
                      avatarUrl: repostedBy.avatarUrl,
                    }}
                  />
                </Link>
              </li>
            )
          })}
        </ul>

        <p className="mt-2 text-sm font-light">
          <PostReposters reposters={reposters} />
        </p>

        <div className="mt-0.5 text-sm font-light text-span">
          {thread?.textContent}
        </div>
      </div>
    </li>
  )
}

function PostReposters({
  reposters,
}: {
  reposters: GetUserNotificationsResponse[number]['repostedByNotification']
}) {
  if (reposters.length === 1) {
    return <span>{reposters[0].repostedBy.username} reposted your post</span>
  }

  if (reposters.length === 2) {
    return (
      <span>
        {reposters[0].repostedBy.username} and{' '}
        {reposters[1].repostedBy.username} reposted your post
      </span>
    )
  }

  if (reposters.length === 3) {
    return (
      <span>
        {reposters[0].repostedBy.username}, {reposters[1].repostedBy.username}{' '}
        and {reposters[2].repostedBy.username} reposted your post
      </span>
    )
  }

  return (
    <span>
      {reposters[0].repostedBy.username}, {reposters[1].repostedBy.username},{' '}
      {reposters[2].repostedBy.username}, and others reposted your post
    </span>
  )
}
