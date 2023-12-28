import * as React from 'react'

import { cn } from '@/lib'

export function Overlay({
  visible,
  className,
  noRemove,
}: {
  visible: boolean
  className?: string
  noRemove?: boolean
}) {
  const overlayRef = React.useRef() as React.MutableRefObject<HTMLDivElement>

  return (
    <div
      ref={overlayRef}
      className={cn(
        'absolute z-10 top-0 left-0 w-full h-full bg-background ease-in-out',
        visible ? 'opacity-100' : 'duration-300 opacity-0 pointer-events-none',
        className
      )}
      onTransitionEnd={(_) => {
        if (noRemove) return
        setTimeout(() => {
          if (overlayRef.current) {
            overlayRef.current.remove()
          }
        })
      }}
      aria-hidden
    ></div>
  )
}
