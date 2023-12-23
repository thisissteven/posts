// todo: start the transition on fetch finished instead

import React from 'react'

import { cn } from '@/lib'

const DURATION = 1000

export function Overlay({ className }: { className?: string }) {
  const [show, setShow] = React.useState(true)

  const overlayRef = React.useRef() as React.MutableRefObject<HTMLDivElement>

  React.useEffect(() => {
    document.documentElement.style.scrollbarGutter = 'stable'
    const interval = setInterval(() => {
      setShow(false)
    }, DURATION)

    return () => {
      clearInterval(interval)
    }
  }, [])

  return (
    <div
      ref={overlayRef}
      className={cn(
        'fixed inset-0 z-50 w-screen h-[100vh] bg-background duration-300',
        show ? 'opacity-100' : 'opacity-0 pointer-events-none',
        className
      )}
      onTransitionEnd={(_) => {
        setTimeout(() => {
          if (overlayRef.current) {
            overlayRef.current.remove()
          }
        }, 500)
      }}
      aria-hidden
    ></div>
  )
}
