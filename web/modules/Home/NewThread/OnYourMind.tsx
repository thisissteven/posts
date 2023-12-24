import Image from 'next/image'
import React from 'react'

import { DefaultProfileLarge } from '@/components/Icons'

import { useAuth } from '@/modules/Auth'

import { NewThreadTemplate } from './NewThreadTemplate'

const OnYourMind = React.memo(function OnYourMind() {
  const { isAuthenticated, session } = useAuth()

  if (!isAuthenticated) return null

  return (
    <section className="border-b border-b-divider">
      <div className="flex px-6 py-5 gap-3 items-start">
        <div className="shrink-0 w-12 h-12 rounded-full overflow-hidden">
          {session?.user.avatarUrl ? (
            <Image
              width={48}
              height={48}
              src={session?.user.avatarUrl}
              alt="avatar"
            />
          ) : (
            <DefaultProfileLarge />
          )}
        </div>

        <NewThreadTemplate id="on-your-mind" />
      </div>
    </section>
  )
})

export { OnYourMind }
