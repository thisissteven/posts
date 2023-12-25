import React from 'react'

import { HomeThreadListTemplate } from './Template'

export function Everyone() {
  return <HomeThreadListTemplate url="/threads?category=everyone" />
}
