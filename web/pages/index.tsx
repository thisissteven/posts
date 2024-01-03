import React from 'react'

import { useLastOpenedTab } from '@/hooks'

import { Seo } from '@/components/Seo'

import { Header } from '@/modules/Home'
import { Everyone, Following, Highlights } from '@/modules/Home'
import { OnYourMind } from '@/modules/ThreadForm'

export default function Home() {
  const { activeTab, setActiveTab } = useLastOpenedTab()

  return (
    <>
      <Seo />
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      <OnYourMind />
      {activeTab === 'Highlights' && <Highlights />}
      {activeTab === 'Everyone' && <Everyone />}
      {activeTab === 'Following' && <Following />}
    </>
  )
}
