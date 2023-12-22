import * as RadixPopover from '@radix-ui/react-popover'
import React from 'react'

import { cn } from '@/lib'

type PopoverContextProps = {
  open: boolean
  closePopover: () => void
}

const PopoverContext = React.createContext({} as PopoverContextProps)

export const usePopover = () => {
  return React.useContext(PopoverContext)
}

export function Popover({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false)
  return (
    <RadixPopover.Root open={open} onOpenChange={setOpen}>
      <PopoverContext.Provider
        value={{ open, closePopover: () => setOpen(false) }}
      >
        {children}
      </PopoverContext.Provider>
    </RadixPopover.Root>
  )
}

Popover.Content = function PopoverContent({
  children,
  className,
  align = 'end',
  ...rest
}: { children: React.ReactNode } & RadixPopover.PopoverContentProps) {
  return (
    <RadixPopover.Portal>
      <RadixPopover.Content
        side="bottom"
        sideOffset={4}
        align={align}
        className={cn(
          'z-40 data-[align=start]:mr-2 data-[align=end]:ml-2 bg-soft-background py-2 min-w-[240px] rounded-lg duration-200 shadow-xl',
          'data-[state=open]:animate-in data-[state=open]:fade-in data-[state=open]:slide-in-from-top-2',
          'data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=closed]:slide-out-to-top-2 data-[state=closed]:duration-300',
          className
        )}
        {...rest}
      >
        <ul>{children}</ul>
      </RadixPopover.Content>
    </RadixPopover.Portal>
  )
}

Popover.Trigger = RadixPopover.Trigger

type PopoverItemProps = { onSelect: () => void } & Omit<
  React.ComponentPropsWithoutRef<'button'>,
  'onClick'
>

export const popoverItemClassName =
  'cursor-pointer text-sm w-full px-4 py-1.5 text-left font-light hover:bg-popover active:bg-popover'

Popover.Item = function PopoverItem({
  children,
  onSelect,
  className,
}: PopoverItemProps) {
  const { closePopover } = usePopover()

  return (
    <li>
      <button
        className={cn(popoverItemClassName, className)}
        value={children?.toString()}
        onClick={(e) => {
          e.stopPropagation()
          onSelect()
          closePopover()
        }}
      >
        {children}
      </button>
    </li>
  )
}
