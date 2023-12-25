import React from 'react'

import { HomeThreadListTemplate } from './Template'

export function Following() {
  return <HomeThreadListTemplate url="/threads?category=following" />
}
