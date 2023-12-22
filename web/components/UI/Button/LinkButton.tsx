import * as React from 'react'

import { cn } from '@/lib'

type LinkButtonProps = {
  children: React.ReactNode
  className?: string
  variant?: 'filled' | 'yellow' | 'underline' | 'secondary'
} & React.ComponentPropsWithoutRef<'a'>

const variantClassName = {
  filled:
    'text-primary bg-soft-background text-center py-2 flex-1 text-xs font-light tracking-wide active:bg-light-background disabled:active:bg-soft-background',
  yellow:
    'w-full text-autumn-yellow bg-autumn-brown py-2 px-6 flex gap-1 items-center justify-center active:opacity-80',
  underline:
    'rounded-lg text-primary text-sm hover:underline underline-offset-[3px]',
  secondary:
    'text-sm text-primary px-3 py-1.5 rounded-lg disabled:bg-span active:bg-light-background bg-soft-background',
}

export const LinkButton = React.forwardRef(function LinkButton(
  { children, className, variant = 'underline', ...rest }: LinkButtonProps,
  ref: React.ForwardedRef<HTMLAnchorElement>
) {
  return (
    <a
      {...rest}
      target="_blank"
      ref={ref}
      className={cn(
        'relative overflow-hidden rounded-full duration-200',
        variantClassName[variant],
        className
      )}
    >
      {children}
    </a>
  )
})
