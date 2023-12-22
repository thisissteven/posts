import clsx from 'clsx'
import React from 'react'

import { LikeActiveSmall, LikeSmall } from '@/components/Icons'

import { AuthButton } from '.'

export function LikeButton({ threadId }: { threadId: string }) {
  const [liked, setLiked] = React.useState(false)

  return (
    <AuthButton
      className="flex items-center gap-2 group w-full justify-center -translate-x-[calc(50%-18.5px)]"
      onClick={() => {
        setLiked(!liked)
      }}
    >
      <div className="group-active:scale-90">
        {liked ? <LikeActiveSmall /> : <LikeSmall />}
      </div>

      <span
        className={clsx(
          'text-xs font-light',
          liked ? 'text-danger-soft' : 'text-span'
        )}
      >
        1
      </span>
    </AuthButton>
  )
}
