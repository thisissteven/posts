import * as RadixTooltip from '@radix-ui/react-tooltip'
import React from 'react'
import { isMobile } from 'react-device-detect'

type TooltipProps = {
  label: string
  tabIndex?: number
} & RadixTooltip.TooltipContentProps

export function Tooltip({
  children,
  label,
  side = 'right',
  asChild,
  tabIndex,
  sideOffset = 10,
}: TooltipProps) {
  return (
    <RadixTooltip.Provider delayDuration={0}>
      <RadixTooltip.Root>
        <RadixTooltip.Trigger asChild={asChild} tabIndex={tabIndex}>
          {children}
        </RadixTooltip.Trigger>
        <RadixTooltip.Portal>
          <RadixTooltip.Content
            className={
              isMobile
                ? 'hidden'
                : 'z-40 overflow-hidden rounded-lg px-2.5 py-2 text-xs font-medium text-primary bg-black shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=top]:data-[state=closed]:slide-out-to-bottom-2 data-[side=right]:data-[state=closed]:slide-out-to-left-2 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 max-w-[180px] data-[side=left]:data-[state=closed]:slide-out-to-right-2'
            }
            side={side}
            sideOffset={sideOffset}
            aria-hidden={isMobile}
          >
            {label}
          </RadixTooltip.Content>
        </RadixTooltip.Portal>
      </RadixTooltip.Root>
    </RadixTooltip.Provider>
  )
}
