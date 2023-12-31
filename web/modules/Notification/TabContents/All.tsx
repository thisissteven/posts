import { useRouter } from 'next/navigation'
import * as React from 'react'
import useSWRImmutable from 'swr/immutable'

import { useDelayedInfiniteSWR, useUser } from '@/hooks'

import { VirtualizedList } from '@/components/UI'

import { GetUserNotificationsResponse } from '@/pages/api/notifications/[id]'
import { UserNotificationStatus } from '@/pages/api/notifications/status'

import { withIndicator } from './WithIndicator'
import {
  FollowNotification,
  LikeNotification,
  ReplyNotification,
  RepostNotification,
} from '../NotificationItem'

export function All() {
  const { user, isAuthenticated } = useUser()

  const { data: notificationStatus, mutate } =
    useSWRImmutable<UserNotificationStatus>(
      isAuthenticated ? '/notifications/status' : null
    )

  const {
    data,
    isLoading,
    isEnd,
    loadMore,
    hasData,
    mutate: mutateNotification,
  } = useDelayedInfiniteSWR<GetUserNotificationsResponse['data']>(
    `/notifications/${user?.id}`,
    {
      duration: 200,
      swrInfiniteConfig: {
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        revalidateIfStale: false,
        onSuccess: () => {
          if (notificationStatus) {
            mutate({
              ...notificationStatus,
              status: 'READ',
            })
          }
        },
      },
    }
  )

  React.useEffect(() => {
    if (notificationStatus?.status === 'UNREAD') {
      mutateNotification()
    }
  }, [mutateNotification, notificationStatus?.status])

  const router = useRouter()

  return (
    <div className="relative">
      {withIndicator(
        {
          data,
          isLoading,
          isEnd,
          loadMore,
          hasData,
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
                        onClick={() => {
                          router.push(
                            `/${notification.repliedByNotification?.repliedBy.username}/${notification.threadId}`
                          )
                        }}
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
