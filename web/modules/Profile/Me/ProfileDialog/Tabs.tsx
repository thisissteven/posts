import * as React from 'react'

import { useGlobalDialogStore } from '@/store'

import { PROFILE_DIALOG_TABS, ProfileDialogTab } from '@/types'

export function ProfileDialogTabs({
  currentTab = 'Edit profile',
}: {
  currentTab?: ProfileDialogTab
}) {
  const openDialog = useGlobalDialogStore((state) => state.openDialog)

  return (
    <div className="flex items-center justify-center gap-5 py-5 px-4 xs:px-8 border-b border-b-divider">
      {PROFILE_DIALOG_TABS.map((tab) => {
        return (
          <button
            key={tab}
            onClick={() => {
              openDialog(
                tab === 'Edit profile' ? 'EDIT_PROFILE' : 'ACCOUNT_SETTINGS'
              )
            }}
            data-active={currentTab === tab}
            className="data-[active=true]:text-primary text-span duration-200 text-sm"
          >
            {tab}
          </button>
        )
      })}
    </div>
  )
}
