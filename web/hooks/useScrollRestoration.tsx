import { Router } from 'next/router'
import * as React from 'react'

import { useScrollPosition } from '@/store'

export function useScrollRestoration(router: Router, paths: string[] = []) {
  const scrollPosition = useScrollPosition((state) => state.scrollPosition)
  const setScrollPosition = useScrollPosition(
    (state) => state.setScrollPosition
  )

  React.useEffect(() => {
    let timeout: NodeJS.Timeout

    const handleRouteChangeStart = () => {
      setScrollPosition(router.pathname, document.documentElement.scrollTop)
    }

    router.events.on('routeChangeStart', handleRouteChangeStart)

    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart)
      clearTimeout(timeout)
    }
  }, [router.events, router.pathname, scrollPosition, setScrollPosition])

  const timeoutRef = React.useRef<NodeJS.Timeout>()

  React.useEffect(() => {
    clearTimeout(timeoutRef.current!)

    if (scrollPosition && paths.includes(router.pathname)) {
      timeoutRef.current = setTimeout(() => {
        document.documentElement.scrollTo({
          top: scrollPosition[router.pathname] || 0,
          // behavior: 'smooth',
        })
      }, 300)
    }
  }, [router.pathname, scrollPosition, setScrollPosition, paths])
}
