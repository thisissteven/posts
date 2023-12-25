import React from 'react'

import { ThreadListTemplate } from '@/modules/Thread'

export function Following() {
  return <ThreadListTemplate url="/threads?category=following" />
}
