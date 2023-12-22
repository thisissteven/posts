import { Slot } from '@radix-ui/react-slot'
import * as React from 'react'

import { cn } from '@/lib'

type IconButtonProps = {
  children: React.ReactNode
  className?: string
  asChild?: boolean
  variant?: 'outline' | 'filled'
} & React.ComponentPropsWithRef<'button'>

const variantClassName = {
  outline: 'active:opacity-80 duration-200 border border-divider',
  filled: 'active:bg-light-background duration-200 bg-soft-background',
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ children, className, asChild, variant = 'outline', ...rest }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        ref={ref}
        className={cn(
          'w-11 aspect-square rounded-full grid place-items-center',
          variantClassName[variant],
          className
        )}
        {...rest}
      >
        {children}
      </Comp>
    )
  }
)
