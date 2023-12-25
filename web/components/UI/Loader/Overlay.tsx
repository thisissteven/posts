import clsx from 'clsx'
import * as React from 'react'

export function Overlay({ visible }: { visible: boolean }) {
  const overlayRef = React.useRef() as React.MutableRefObject<HTMLDivElement>

  return (
    <div
      ref={overlayRef}
      className={clsx(
        'absolute z-10 top-0 left-0 w-full h-full bg-background ease-in-out',
        visible ? 'opacity-100' : 'duration-300 opacity-0 pointer-events-none'
      )}
      onTransitionEnd={(_) => {
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
