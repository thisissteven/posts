import React from 'react'

import { useAuth } from '@/modules/Auth'

import { NewThreadTemplate } from './NewThreadTemplate'

const OnYourMind = React.memo(function OnYourMind() {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) return null

  return (
    <section className="border-b border-b-divider">
      <div className="flex px-6 py-5 gap-3 items-start">
        <div className="shrink-0 w-12 h-12 rounded-full bg-[#33691e] grid place-items-center">
          <span className="text-3xl font-light">S</span>
        </div>

        <NewThreadTemplate />
      </div>
    </section>
  )
})

export { OnYourMind }
