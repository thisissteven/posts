import clsx from 'clsx'
import React from 'react'

import { RepostSmall, RepostSmallActive } from '@/components/Icons'
import { AuthButton } from '@/components/UI'

import { useButtonCount } from './useButtonCount'

import { ThreadItem } from '@/types'

export function RepostButton({ thread }: { thread: ThreadItem }) {
  const { state, onClick } = useButtonCount({
    thread,
    countType: 'repost',
  })

  return (
    <AuthButton
      className="flex items-center gap-2 group w-full justify-center -translate-x-[calc(50%-18.5px)]"
      onClick={onClick}
    >
      <div className="group-active:scale-90">
        {state.status ? <RepostSmallActive /> : <RepostSmall />}
      </div>

      <span
        aria-hidden={!state.status}
        className={clsx(
          'text-xs font-light duration-75',
          state.count > 0 ? 'opacity-100' : 'opacity-0',
          state.status ? 'text-success' : 'text-span'
        )}
      >
        {state.count}
      </span>
    </AuthButton>
  )
}