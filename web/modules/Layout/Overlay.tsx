// todo: start the transition on fetch finished instead

import { useSession } from 'next-auth/react'
import React from 'react'

import { cn } from '@/lib'

const DURATION = 500

export function Overlay({ className }: { className?: string }) {
  const [show, setShow] = React.useState(true)

  const overlayRef = React.useRef() as React.MutableRefObject<HTMLDivElement>
  const { status } = useSession()

  const startTimeRef = React.useRef<number | null>(null)

  React.useEffect(() => {
    let timeout: NodeJS.Timeout

    if (status === 'loading' && !startTimeRef.current) {
      startTimeRef.current = Date.now()
    } else if (startTimeRef.current && status !== 'loading') {
      const elapsedTime = Date.now() - startTimeRef.current
      const remainingTime = Math.max(DURATION - elapsedTime, 0)

      timeout = setTimeout(() => {
        setShow(false)
      }, remainingTime)
    }

    return () => {
      clearTimeout(timeout)
    }
  }, [status])

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
