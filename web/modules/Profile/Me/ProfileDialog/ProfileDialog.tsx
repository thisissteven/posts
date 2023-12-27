import React from 'react'

import { useDialogState } from '@/hooks'

import { SharedDialog } from '@/components/UI'

import { useCurrentOpenDialog, useDialogActions } from '@/store'

import {
  AccountSettingsContent,
  EditProfileContent,
  ProfileDialogTabs,
} from '.'

import { ProfileDialogTab } from '@/types'

export function ProfileDialog() {
  const dialogState = useDialogState()

  const open = useCurrentOpenDialog()
  const { closeDialog } = useDialogActions()

  React.useEffect(() => {
    if (open === 'EDIT_PROFILE' || open === 'ACCOUNT_SETTINGS') {
      dialogState.onOpenChange(true)
    } else {
      dialogState.onOpenChange(false)
    }
  }, [open, dialogState])

  const previousTab = React.useRef<ProfileDialogTab>()
  let currentTab: ProfileDialogTab | undefined

  if (open === 'EDIT_PROFILE') currentTab = 'Edit profile'
  else if (open === 'ACCOUNT_SETTINGS') currentTab = 'Account settings'
  else currentTab = previousTab.current

  if (previousTab.current !== currentTab) {
    previousTab.current = currentTab
  }

  return (
    <SharedDialog
      dialogState={{
        ...dialogState,
        onOpenChange(open) {
          if (!open) closeDialog()
          dialogState.onOpenChange(open)
        },
      }}
    >
      <SharedDialog.Content className="max-h-[1181px] max-w-[540px] h-[87vh] rounded-xl overflow-hidden">
        <div className="bg-background h-full w-full pb-4 flex flex-col justify-between">
          <ProfileDialogTabs currentTab={currentTab} />

          {currentTab === 'Account settings' ? (
            <AccountSettingsContent />
          ) : (
            <EditProfileContent />
          )}
        </div>
      </SharedDialog.Content>
    </SharedDialog>
  )
}
