import React from 'react'

import { useDialogState } from '@/hooks'

import { RegularButton, SharedDialog } from '@/components/UI'

import { useGlobalDialogStore } from '@/store'

import {
  AccountSettingsContent,
  EditProfileContent,
  ProfileDialogTabs,
} from '.'

export function ProfileDialog() {
  const dialogState = useDialogState()

  const open = useGlobalDialogStore((state) => state.currentOpen)
  const closeDialog = useGlobalDialogStore((state) => state.closeDialog)

  React.useEffect(() => {
    if (open === 'EDIT_PROFILE' || open === 'ACCOUNT_SETTINGS') {
      dialogState.onOpenChange(true)
    } else {
      dialogState.onOpenChange(false)
    }
  }, [open, dialogState])

  const currentTab =
    open === 'ACCOUNT_SETTINGS' ? 'Account settings' : 'Edit profile'

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

          <div className="px-4 xs:px-8 flex-1 overflow-y-auto scrollbar-none">
            {open === 'ACCOUNT_SETTINGS' ? (
              <AccountSettingsContent />
            ) : (
              <EditProfileContent />
            )}
          </div>

          <div className="pt-4 mx-4 xs:mx-8 border-t border-divider flex justify-end">
            <SharedDialog.Close asChild>
              <RegularButton variant="secondary">Done</RegularButton>
            </SharedDialog.Close>
          </div>
        </div>
      </SharedDialog.Content>
    </SharedDialog>
  )
}
