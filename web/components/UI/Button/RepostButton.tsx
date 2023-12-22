import clsx from 'clsx'
import React from 'react'

import { RepostSmall, RepostSmallActive } from '@/components/Icons'

import { AuthButton } from '.'

export function RepostButton({ threadId }: { threadId: string }) {
  const [reposted, setReposted] = React.useState(false)

  return (
    <AuthButton
      className="flex items-center gap-2 group w-full justify-center -translate-x-[calc(50%-18.5px)]"
      onClick={() => {
        setReposted(!reposted)
      }}
    >
      <div className="group-active:scale-90">
        {reposted ? <RepostSmallActive /> : <RepostSmall />}
      </div>

      <span
        aria-hidden={!reposted}
        className={clsx(
          'text-xs text-success font-light duration-75',
          reposted ? 'opacity-100' : 'opacity-0'
        )}
      >
        1
      </span>
    </AuthButton>
  )
}
