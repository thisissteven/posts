import { useRouter } from 'next/router'
import React from 'react'

export function usePreviousRoute() {
  const router = useRouter()
  const prevRouteRef = React.useRef('')

  React.useEffect(() => {
    const handleRouteChange = () => {
      prevRouteRef.current = router.asPath
    }

    router.events.on('routeChangeComplete', handleRouteChange)

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router])

  return prevRouteRef.current
}
