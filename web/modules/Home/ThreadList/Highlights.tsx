import React from 'react'

import { ThreadListTemplate } from '@/modules/Thread'

export function Highlights() {
  return <ThreadListTemplate url="/threads?category=highlights" useBuffer />
}
