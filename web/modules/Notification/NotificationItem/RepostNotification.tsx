import Link from 'next/link'

import { RepostLargeActive } from '@/components/Icons'
import { ThreadUserAvatar } from '@/components/UI'

import { GetUserNotificationsResponse } from '@/pages/api/notifications/[id]'

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
    <div
      onClick={onClick}
      className="px-6 py-5 flex gap-3 border-b border-b-divider hover:bg-soft-black active:bg-soft-black cursor-pointer"
    >
      <div className="shrink-0 w-12 h-12 flex items-center justify-end">
        <RepostLargeActive />
      </div>

      <div className="mt-1">
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

        <TextContent textContent={thread?.textContent} />
      </div>
    </div>
  )
}

function TextContent({ textContent }: { textContent?: string }) {
  if (!textContent) return null

  return (
    <div className="mt-0.5 text-sm font-light text-span line-clamp-2 whitespace-pre-line">
      {textContent}
    </div>
  )
}

function PostReposters({
  reposters,
}: {
  reposters: GetUserNotificationsResponse['data'][number]['repostedByNotification']
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
