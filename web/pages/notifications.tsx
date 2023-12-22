import Head from 'next/head'
import React from 'react'

import { All, Header, Mentions } from '@/modules/Notification'

import { NotificationTab } from '@/types'

export default function Notifications() {
  const [activeTab, setActiveTab] = React.useState<NotificationTab>('All')

  const title = activeTab ? `Notifications - ${activeTab}` : 'Notifications'

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      {activeTab === 'All' && <All />}
      {activeTab === 'Mentions' && <Mentions />}
    </>
  )
}