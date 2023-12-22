import * as React from 'react'

import { Dialog, RegularButton } from '@/components/UI'

import { ActiveTabProvider } from './ActiveTabContext'
import { Tab } from './Tabs'
import { UserList } from './UserList'

import { SocialTab } from '@/types'

export function SocialsDialogContent({ type }: { type: SocialTab }) {
  return (
    <Dialog.Content className="max-h-[1181px] h-[87vh] rounded-xl overflow-hidden">
      <div className="bg-background h-full w-full px-4 xs:px-8 pt-8 pb-4 flex flex-col">
        <ActiveTabProvider type={type}>
          <Tab />
          <div className="flex-1 overflow-y-auto scrollbar-none">
            <UserList />
          </div>
        </ActiveTabProvider>
        <div className="pt-4 border-t border-divider flex justify-end">
          <Dialog.Close asChild>
            <RegularButton variant="secondary">Done</RegularButton>
          </Dialog.Close>
        </div>
      </div>
    </Dialog.Content>
  )
}
