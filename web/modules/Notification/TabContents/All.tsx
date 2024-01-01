import clsx from 'clsx'
import { useRouter } from 'next/navigation'
import * as React from 'react'
import { SWRResponse } from 'swr'

import { useDelayedSWR } from '@/hooks'

import { TabLoader } from '@/components/UI'

import { GetUserNotificationsResponse } from '@/pages/api/notifications'

import { EmptyPlaceholder } from './EmptyPlaceholder'
import {
  FollowNotification,
  LikeNotification,
  ReplyNotification,
  RepostNotification,
} from '../NotificationItem'

function withIndicator<T extends any[]>(
  response: SWRResponse<T, any, any>,
  renderChild: (data: T) => React.ReactNode
) {
  const { data, isLoading } = response

  const isEmpty = data?.length === 0
  const hasData = data !== undefined

  return (
    <React.Fragment>
      <TabLoader visible={isLoading} />
      <EmptyPlaceholder visible={isEmpty} />

      <div
        className={clsx(
          'duration-300',
          isLoading ? 'opacity-0' : 'opacity-100'
        )}
      >
        {hasData && renderChild(data)}
      </div>
    </React.Fragment>
  )
}

export function All() {
  const swrResponse = useDelayedSWR<GetUserNotificationsResponse>(
    '/notifications',
    {
      duration: 300,
      swrConfig: {
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        revalidateIfStale: false,
      },
    }
  )

  const router = useRouter()

  return (
    <div className="relative">
      {withIndicator(
        swrResponse,
        (notifications: GetUserNotificationsResponse) => (
          <ul>
            {notifications.map((notification) => {
              switch (notification.type) {
                case 'LIKE':
                  return (
                    <LikeNotification
                      key={notification.id}
                      notification={notification}
                      onClick={() => {
                        router.push(
                          `/${notification.recipient.username}/${notification.threadId}`
                        )
                      }}
                    />
                  )

                case 'FOLLOW':
                  return (
                    <FollowNotification
                      key={notification.id}
                      notification={notification}
                      onClick={() => {
                        router.push(
                          `/${notification.followedByNotification?.followedBy.username}`
                        )
                      }}
                    />
                  )

                case 'REPLY':
                  return (
                    <ReplyNotification
                      key={notification.id}
                      notification={notification}
                      onClick={() => {}}
                    />
                  )

                case 'REPOST':
                  return (
                    <RepostNotification
                      key={notification.id}
                      notification={notification}
                      onClick={() => {
                        router.push(
                          `/${notification.recipient.username}/${notification.threadId}`
                        )
                      }}
                    />
                  )
                default:
                  return null
              }
            })}
          </ul>
        )
      )}
    </div>
  )
}
