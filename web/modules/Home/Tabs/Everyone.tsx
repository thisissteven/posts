import { useRouter } from 'next/navigation'
import React from 'react'

import { TabLoader } from '@/components/UI'

import { Thread } from '..'

export function Everyone() {
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 300)
  }, [])

  const router = useRouter()

  return (
    <div className="relative">
      <TabLoader visible={loading} />
      <div className="divide-y divide-divider">
        {[].map((thread, i) => (
          <Thread
            key={i}
            onClick={() => router.push(`${'username'}/${123}`)}
            thread={thread}
          />
        ))}
      </div>
    </div>
  )
}
