import React from 'react'

import { TabLoader } from '.'

export function LoadMore({
  whenInView,
  isEnd,
}: {
  whenInView: () => void
  isEnd?: boolean
}) {
  const loaderRowRef = React.useRef<HTMLDivElement | null>(null)

  React.useEffect(() => {
    const loaderRow = loaderRowRef.current
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        whenInView()
      }
    })

    if (loaderRow) {
      observer.observe(loaderRow)
    }

    return () => {
      if (loaderRow) {
        observer.unobserve(loaderRow)
      }
    }
  }, [whenInView])

  if (isEnd) return null

  return (
    <div
      ref={loaderRowRef}
      style={{
        height: 61,
      }}
      className="relative flex items-center justify-center"
    >
      <TabLoader offset={24} visible={isEnd === false || isEnd === undefined} />
    </div>
  )
}
