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
    hasData: boolean | undefined
  },
  renderChild: (data: T) => React.ReactNode
) {
  const { data, isLoading, isEnd, loadMore, hasData } = response

  const isEmpty = data?.length === 0

  return (
    <React.Fragment>
      <EmptyPlaceholder visible={isEmpty} />

      <div
        className={clsx(
          'duration-300',
          isLoading ? 'opacity-0' : 'opacity-100'
        )}
      >
        {hasData && renderChild(data!)}
      </div>

      <LoadMore isEnd={isEnd} whenInView={loadMore} />

      <TabLoader visible={isLoading} overlayOnly={hasData} />
    </React.Fragment>
  )
}
