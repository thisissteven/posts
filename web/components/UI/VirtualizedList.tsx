import {
  useWindowVirtualizer,
  VirtualItem,
  Virtualizer,
} from '@tanstack/react-virtual'
import * as React from 'react'

type VirtualizedListProps<T> = {
  children: (
    items: VirtualItem[],
    virtualizer: Virtualizer<Window, Element>
  ) => React.ReactNode
  data?: T[]
  estimateSize?: (index: number) => number
  overscan?: number
}

export function VirtualizedList<T>({
  children,
  data = [],
  estimateSize = () => 500,
  overscan = 7,
}: VirtualizedListProps<T>) {
  const listRef = React.useRef<HTMLDivElement | null>(null)

  const virtualizer = useWindowVirtualizer({
    count: data.length,
    estimateSize,
    overscan,
  })

  const items = virtualizer.getVirtualItems()

  const translateY = items[0]?.start ?? 0

  return (
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
            transform: `translateY(${translateY}px)`,
          }}
        >
          {children(items, virtualizer)}
        </div>
      </div>
    </div>
  )
}

VirtualizedList.Item = function Item({
  children,
  virtualizer,
  item,
}: {
  children: React.ReactNode
  virtualizer: Virtualizer<Window, Element>
  item: VirtualItem
}) {
  return (
    <div data-index={item.index} ref={virtualizer.measureElement}>
      {children}
    </div>
  )
}
