import React from 'react'

import { NOTIFICATION_TABS, NotificationTab } from '@/types'

export function Header({
  activeTab,
  setActiveTab,
}: {
  activeTab: NotificationTab
  setActiveTab: (tab: NotificationTab) => void
}) {
  return (
    <header className="bg-background sticky top-0 grid place-items-center h-[61px] border-b-[1.5px] border-b-divider">
      <ul className="flex text-span text-[14px] gap-6 font-medium">
        {NOTIFICATION_TABS.map((tab) => {
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
