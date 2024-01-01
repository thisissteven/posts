import { useRouter } from 'next/navigation'
import * as React from 'react'

import { useDelayedInfiniteSWR } from '@/hooks'

import { VirtualizedList } from '@/components/UI'

import { GetUserNotificationsResponse } from '@/pages/api/notifications'

import { withIndicator } from './WithIndicator'
import {
  FollowNotification,
  LikeNotification,
  ReplyNotification,
  RepostNotification,
} from '../NotificationItem'

export function All() {
  const { data, isLoading, isEnd, loadMore } = useDelayedInfiniteSWR<
    GetUserNotificationsResponse['data']
  >('/notifications', {
    duration: 200,
    swrInfiniteConfig: {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateIfStale: false,
      revalidateFirstPage: false,
    },
  })

  const router = useRouter()

  return (
    <div className="relative">
      {withIndicator(
        {
          data,
          isLoading,
          isEnd,
          loadMore,
        },
        (notifications) => (
          <VirtualizedList data={notifications} estimateSize={() => 135}>
            {(items, virtualizer) => {
              if (!notifications) return null

              return items.map((item) => {
                const notification = notifications[item.index]
                const type = notification.type
                return (
                  <VirtualizedList.Item
                    key={item.key}
                    virtualizer={virtualizer}
                    item={item}
                  >
                    {type === 'LIKE' && (
                      <LikeNotification
                        key={notification.id}
                        notification={notification}
                        onClick={() => {
                          router.push(
                            `/${notification.recipient.username}/${notification.threadId}`
                          )
                        }}
                      />
                    )}

                    {type === 'FOLLOW' && (
                      <FollowNotification
                        key={notification.id}
                        notification={notification}
                        onClick={() => {
                          router.push(
                            `/${notification.followedByNotification?.followedBy.username}`
                          )
                        }}
                      />
                    )}

                    {type === 'REPLY' && (
                      <ReplyNotification
                        key={notification.id}
                        notification={notification}
                        onClick={() => {}}
                      />
                    )}

                    {type === 'REPOST' && (
                      <RepostNotification
                        key={notification.id}
                        notification={notification}
                        onClick={() => {
                          router.push(
                            `/${notification.recipient.username}/${notification.threadId}`
                          )
                        }}
                      />
                    )}
                  </VirtualizedList.Item>
                )
              })
            }}
          </VirtualizedList>
        )
      )}
    </div>
  )
}
