import React from 'react'

import { VirtualizedList } from '@/components/UI'

export default function List() {
  const [numbers, setNumbers] = React.useState<number[]>([])
  return (
    <div className="min-h-[200vh]">
      <button onClick={() => setNumbers([Math.random(), ...numbers])}>
        add new item
      </button>

      <VirtualizedList data={numbers}>
        {(items, virtualizer) => {
          if (!numbers) return null

          return items.map((item) => {
            const thread = numbers[item.index]

            return (
              <VirtualizedList.Item
                key={item.key}
                virtualizer={virtualizer}
                item={item}
              >
                <div
                  key={item.index}
                  className="w-full h-40 px-6 py-2 bg-zinc-500"
                >
                  {thread}
                </div>
              </VirtualizedList.Item>
            )
          })
        }}
      </VirtualizedList>
    </div>
  )
}
