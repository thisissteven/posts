import React from 'react'

import { Seo } from '@/components/Seo'

import { All, Header, Mentions } from '@/modules/Notification'

import { NotificationTab } from '@/types'

export default function Notifications() {
  const [activeTab, setActiveTab] = React.useState<NotificationTab>('All')

  return (
    <>
      <Seo title="Notifications" />

      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      {activeTab === 'All' && <All />}
      {activeTab === 'Mentions' && <Mentions />}
    </>
  )
}
