import React from 'react'

import { ThreadListTemplate } from '@/modules/Thread'

export function Everyone() {
  return <ThreadListTemplate url="/threads" useBuffer />
}
