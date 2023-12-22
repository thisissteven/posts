import React from 'react'

import { MoreIconWhite } from '@/components/Icons'
import { Popover } from '@/components/UI'

export function HeaderContent() {
  return (
    <>
      <h1 className="text-sm font-light">@random</h1>

      <Popover>
        <Popover.Trigger asChild>
          <button className="relative ml-auto active:opacity-80 duration-200">
            <MoreIconWhite />
          </button>
        </Popover.Trigger>
        <Popover.Content>
          <Popover.Item onSelect={() => {}}>Report</Popover.Item>
          <Popover.Item onSelect={() => {}} className="text-danger">
            Block
          </Popover.Item>
        </Popover.Content>
      </Popover>
    </>
  )
}
