import clsx from 'clsx'
import React from 'react'

import { LikeActiveSmall, LikeSmall } from '@/components/Icons'
import { AuthButton } from '@/components/UI'

import { useButtonCount } from './useButtonCount'

import { ThreadItem } from '@/types'

export function LikeButton({ thread }: { thread: ThreadItem }) {
  const { state, onClick } = useButtonCount({
    thread,
    countType: 'like',
  })

  return (
    <AuthButton
      className="flex items-center gap-2 group w-full justify-center -translate-x-[calc(50%-18.5px)]"
      onClick={onClick}
    >
      <div className="group-active:scale-90">
        {state.status ? <LikeActiveSmall /> : <LikeSmall />}
      </div>

      <span
        className={clsx(
          'text-xs font-light',
          state.count > 0 ? 'opacity-100' : 'opacity-0',
          state.status ? 'text-danger-soft' : 'text-span'
        )}
      >
        {state.count}
      </span>
    </AuthButton>
  )
}
