import { useWindowVirtualizer } from '@tanstack/react-virtual'
import { useRouter } from 'next/navigation'
import React from 'react'
import useSWR from 'swr'

import { useFakeLoading } from '@/hooks'

import { TabLoader } from '@/components/UI'

import { Thread } from '..'

import { ThreadItem } from '@/types'

export function Everyone() {
  const router = useRouter()

  const { data: threadItems, isLoading } = useSWR<ThreadItem[]>('/threads')

  const loading = useFakeLoading() || !threadItems || isLoading

  const listRef = React.useRef<HTMLDivElement | null>(null)

  const virtualizer = useWindowVirtualizer({
    count: threadItems?.length ?? 0,
    estimateSize: () => 300,
    overscan: 5,
  })

  const items = virtualizer.getVirtualItems()

  return (
    <div className="relative">
      <TabLoader visible={loading} />
      <div ref={listRef}>
        <div
          style={{
            height: virtualizer.getTotalSize(),
            width: '100%',
            position: 'relative',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              transform: `translateY(${items[0]?.start ?? 0}px)`,
            }}
          >
            {threadItems &&
              items.map((item) => {
                const thread = threadItems[item.index]
                return (
                  <div
                    key={item.key}
                    data-index={item.index}
                    ref={virtualizer.measureElement}
                  >
                    <Thread
                      key={thread.id}
                      onClick={() =>
                        router.push(`${thread.owner.username}/${thread.id}`)
                      }
                      thread={thread}
                    />
                  </div>
                )
              })}
          </div>
        </div>
      </div>
    </div>
  )
}
