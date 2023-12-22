import * as React from 'react'

import { TabLoader } from '@/components/UI'

import { EmptyPlaceholder } from './EmptyPlaceholder'

export function All() {
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 500)
  }, [])

  return (
    <div className="relative">
      <TabLoader visible={loading} />
      <EmptyPlaceholder />
    </div>
  )
}
