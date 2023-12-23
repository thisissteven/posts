import { Slot } from '@radix-ui/react-slot'
import * as React from 'react'

import { cn } from '@/lib'

import { LoadingBar } from '..'

type RegularButtonProps = {
  children: React.ReactNode
  className?: string
  asChild?: boolean
  variant?: 'filled' | 'yellow' | 'underline' | 'primary' | 'secondary'
  isLoading?: boolean
} & React.ComponentPropsWithoutRef<'button'>

const variantClassName = {
  filled:
    'text-primary bg-soft-background text-center py-2 flex-1 text-xs font-light tracking-wide active:bg-light-background',
  yellow:
    'w-full text-autumn-yellow bg-autumn-brown py-2 px-6 flex gap-1 items-center justify-center active:opacity-80',
  underline:
    'rounded-lg text-primary text-sm hover:underline underline-offset-[3px]',
  primary:
    'text-sm text-background px-3 py-1.5 rounded-lg active:opacity-80 disabled:bg-span bg-primary disabled:data-[loading=true]:bg-primary',
  secondary:
    'text-sm text-primary px-3 py-1.5 rounded-lg disabled:bg-span active:bg-light-background bg-soft-background',
}

export const RegularButton = React.forwardRef(function RegularButton(
  {
    children,
    className,
    asChild,
    variant = 'primary',
    isLoading = false,
    disabled,
    ...rest
  }: RegularButtonProps,
  ref: React.ForwardedRef<HTMLButtonElement>
) {
  const Comp = asChild ? Slot : 'button'
  return (
    <Comp
      ref={ref}
      className={cn(
        'relative overflow-hidden rounded-full disabled:pointer-events-none',
        variantClassName[variant],
        className
      )}
      disabled={disabled || isLoading}
      data-loading={isLoading}
      {...rest}
    >
      <>
        {isLoading && (
          <div className="absolute inset-0 w-full h-full grid place-items-center bg-inherit">
            <LoadingBar
              color={variant === 'primary' ? '#121212' : '#eeeeee'}
              visible={isLoading}
            />
          </div>
        )}
        {children}
      </>
    </Comp>
  )
})
