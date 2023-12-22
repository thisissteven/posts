import React from 'react'

import { LikeYellowSmall } from '@/components/Icons'

export function SupporterOnly() {
  return (
    <p className="flex items-center gap-0.5 justify-center px-2 py-1 rounded-full bg-autumn-brown text-autumn-yellow w-fit">
      <LikeYellowSmall />
      <span className="text-xs font-light tracking-wide">supporter only</span>
    </p>
  )
}
