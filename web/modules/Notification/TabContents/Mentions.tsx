import { useRouter } from 'next/navigation'
import * as React from 'react'

import { useDelayedInfiniteSWR } from '@/hooks'

import { VirtualizedList } from '@/components/UI'

import { GetUserNotificationsResponse } from '@/pages/api/notifications'

import { withIndicator } from './WithIndicator'
import { ReplyNotification } from '../NotificationItem'

export function Mentions() {
  const { data, isLoading, isEnd, loadMore } = useDelayedInfiniteSWR<
    GetUserNotificationsResponse['data']
  >('/notifications', {
    duration: 200,
    swrInfiniteConfig: {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateIfStale: false,
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
                    {type === 'REPLY' && (
                      <ReplyNotification
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
