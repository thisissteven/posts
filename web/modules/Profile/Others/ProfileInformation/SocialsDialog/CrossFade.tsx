import clsx from 'clsx'
import * as React from 'react'

const DURATION = 300

export function CrossFade({
  contentA,
  contentB,
  currentIndex,
}: {
  contentA: React.ReactNode
  contentB: React.ReactNode
  currentIndex: 0 | 1
}) {
  const [currentContent, setCurrentContent] = React.useState<React.ReactNode>(
    currentIndex === 0 ? contentA : contentB
  )

  const ref = React.useRef<HTMLDivElement>(null)

  const timeoutRef = React.useRef<NodeJS.Timeout>()
  const secondTimeoutRef = React.useRef<NodeJS.Timeout>()

  function setCrossFadeState(state: 'fade-in' | 'fade-out' | 'change-content') {
    if (ref.current) {
      ref.current.dataset.crossfadeState = state
    }
  }

  React.useEffect(() => {
    clearTimeout(timeoutRef.current)
    clearTimeout(secondTimeoutRef.current)

    if (ref.current) {
      if (ref.current.dataset.isInitial === 'true') {
        setCurrentContent(currentIndex === 0 ? contentA : contentB)

        setTimeout(() => {
          if (ref.current) {
            ref.current.dataset.isInitial = 'false'
          }
        })
        return
      }
      setCrossFadeState('fade-out')

      timeoutRef.current = setTimeout(() => {
        setCrossFadeState('change-content')
        setCurrentContent(currentIndex === 0 ? contentA : contentB)

        secondTimeoutRef.current = setTimeout(() => {
          setCrossFadeState('fade-in')
        }, DURATION)
      }, DURATION)
    }

    return () => {
      clearTimeout(timeoutRef.current)
      clearTimeout(secondTimeoutRef.current)
    }
  }, [contentA, contentB, currentIndex])

  return (
    <div
      ref={ref}
      data-crossfade-state="fade-in"
      data-is-initial="true"
      className={clsx(
        'ease-in-out h-full',
        'data-[is-initial=true]:duration-0',
        'data-[is-initial=false]:duration-300',
        'data-[crossfade-state=fade-out]:opacity-0',
        'data-[crossfade-state=fade-in]:opacity-1'
      )}
    >
      {currentContent}
    </div>
  )
}
