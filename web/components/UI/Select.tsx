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
          'appearance-none bg-soft-background pl-3 pr-7 py-1.5 rounded-lg text-sm peer disabled:opacity-60 disabled:cursor-not-allowed',
          className
        )}
        {...rest}
      >
        {children}
      </select>
      <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none peer-disabled:opacity-60">
        <ChevronDown />
      </div>
    </div>
  )
}
