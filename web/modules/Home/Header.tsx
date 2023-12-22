import React from 'react'

import { useAuth } from '@/modules/Auth'

import { HOME_TABS, HomeTab } from '@/types'

export function Header({
  activeTab,
  setActiveTab,
}: {
  activeTab?: HomeTab | null
  setActiveTab: (tab: HomeTab) => void
}) {
  const { isAuthenticated } = useAuth()

  const tabs = isAuthenticated
    ? HOME_TABS
    : HOME_TABS.filter((tab) => tab !== 'Following')

  return (
    <header className="bg-background sticky top-0 grid place-items-center h-[61px] border-b-[1.5px] border-b-divider">
      <ul className="flex text-span text-[14px] gap-6 font-medium">
        {tabs.map((tab) => {
          return (
            <li key={tab}>
              <button
                onClick={() => setActiveTab(tab)}
                data-active={activeTab === tab}
                className="data-[active=true]:text-primary duration-200"
              >
                {tab}
              </button>
            </li>
          )
        })}
      </ul>
    </header>
  )
}
