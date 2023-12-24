import { useRouter } from 'next/router'
import * as React from 'react'

import { useScrollPosition } from '@/store'

export function useLastSeenFeed(key: string) {
  const scrollPosition = useScrollPosition((state) => state.scrollPosition)
  const setScrollPosition = useScrollPosition(
    (state) => state.setScrollPosition
  )

  const router = useRouter()

  React.useEffect(() => {
    let timeout: NodeJS.Timeout

    const handleRouteChangeStart = () => {
      setScrollPosition(key, document.documentElement.scrollTop)
    }

    router.events.on('routeChangeStart', handleRouteChangeStart)

    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart)
      clearTimeout(timeout)
    }
  }, [router.events, key, scrollPosition, setScrollPosition])

  const timeoutRef = React.useRef<NodeJS.Timeout>()

  React.useEffect(() => {
    clearTimeout(timeoutRef.current!)

    if (scrollPosition) {
      timeoutRef.current = setTimeout(() => {
        document.documentElement.scrollTo({
          top: scrollPosition[key] || 0,
          behavior: 'smooth',
        })
      }, 300)
    }
  }, [key, scrollPosition, setScrollPosition])
}
