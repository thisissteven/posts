import React from 'react'

import { TabLoader } from '@/components/UI'

import { EmptyPlaceholder } from './EmptyPlaceholder'

export function Posts() {
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 300)
  }, [])

  return (
    <div className="relative">
      <TabLoader visible={loading} />
      <EmptyPlaceholder />
    </div>
  )
}
