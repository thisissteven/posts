import clsx from 'clsx'
import * as React from 'react'

import { LoadMore, TabLoader } from '@/components/UI'

import { EmptyPlaceholder } from './EmptyPlaceholder'

export function withIndicator<T extends any[]>(
  response: {
    data: T | undefined
    isLoading: boolean
    isEnd: boolean | undefined
    loadMore: () => void
  },
  renderChild: (data: T) => React.ReactNode
) {
  const { data, isLoading, isEnd, loadMore } = response

  const isEmpty = data?.length === 0
  const hasData = data !== undefined

  return (
    <React.Fragment>
      <TabLoader visible={isLoading} />
      <EmptyPlaceholder visible={isEmpty} />

      <div
        className={clsx(
          'duration-300',
          isLoading ? 'opacity-0' : 'opacity-100'
        )}
      >
        {hasData && renderChild(data)}
      </div>

      <LoadMore isEnd={isEnd} whenInView={loadMore} />
    </React.Fragment>
  )
}
