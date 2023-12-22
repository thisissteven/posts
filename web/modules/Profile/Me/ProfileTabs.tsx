import React from 'react'

import { PROFILE_TABS, ProfileTab } from '@/types'

type ProfileTabProps = {
  activeTab: ProfileTab
  setActiveTab: (tab: ProfileTab) => void
}

export function ProfileTabs({ activeTab, setActiveTab }: ProfileTabProps) {
  return (
    <ul className="relative border-b border-b-divider grid grid-cols-3 place-items-center text-sm font-light">
      <div
        style={{
          left: `${
            (PROFILE_TABS.indexOf(activeTab) / PROFILE_TABS.length) * 100
          }%`,
        }}
        className="absolute duration-300 w-1/3 scale-x-[75%] origin-center h-[1.5px] rounded-full bg-primary -bottom-0.5"
      ></div>
      {PROFILE_TABS.map((tab) => {
        return (
          <li
            key={tab}
            data-active={activeTab === tab}
            className="duration-200 text-span data-[active=true]:text-primary"
          >
            <button
              className="p-3"
              onClick={() => {
                setActiveTab(tab)
              }}
            >
              {tab}
            </button>
          </li>
        )
      })}
    </ul>
  )
}
