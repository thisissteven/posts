import React from 'react'

import useDragToScroll from '@/hooks/useDragToScroll'

const chips = [
  'Role',
  'Location',
  'Has worked at',
  'Years of experience',
  'Collaborators',
]

export function CommandMenuChips() {
  const { ref, ...rest } = useDragToScroll()
  return (
    <div
      ref={ref}
      {...rest}
      className="h-[42px] pb-2 flex items-center overflow-x-auto scrollbar-none w-full"
    >
      <ul className="px-2 flex gap-1.5 whitespace-nowrap">
        {chips.map((chip) => {
          return (
            <li key={chip} className="text-xs text-soft-primary font-light">
              <button className="bg-background border-[1.5px] border-divider rounded-full px-3 py-1">
                {chip}
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
