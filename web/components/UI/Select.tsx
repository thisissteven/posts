import React from 'react'

import { cn } from '@/lib'

import { ChevronDown } from '../Icons'

export function Select({
  className,
  children,
  ...rest
}: React.ComponentPropsWithoutRef<'select'>) {
  return (
    <div className="relative">
      <select
        className={cn(
          'appearance-none bg-soft-background pl-3 pr-7 py-1.5 rounded-lg text-sm',
          className
        )}
        {...rest}
      >
        {children}
      </select>
      <div className="absolute right-2.5 top-1/2 -translate-y-1/2">
        <ChevronDown />
      </div>
    </div>
  )
}
