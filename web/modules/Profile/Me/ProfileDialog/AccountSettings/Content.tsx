import * as React from 'react'

import { Information } from '@/components/Icons'
import {
  RegularButton,
  Select,
  SharedDialog,
  Switch,
  Tooltip,
} from '@/components/UI'

import { BlockedAccounts } from './BlockedAccounts'
import { ChangeEmail } from './ChangeEmail'
import { DeleteAccount } from './DeleteAccount'
import { SettingGroup } from './SettingGroup'

function GeneralSettings() {
  return (
    <div>
      <h2 className="text-lg">General</h2>
      <SettingGroup
        title="Allow new replies from"
        subtitle="Everyone can reply to you"
      >
        <Select style={{ width: '104px' }} disabled>
          <option value="Everyone">Everyone</option>
          <option value="Following">Following</option>
          <option value="Nobody">Nobody</option>
        </Select>
      </SettingGroup>
      <SettingGroup title="Appearance" subtitle="Inherits OS dark mode">
        <Select style={{ width: '104px' }}>
          <option value="System">System</option>
          <option value="Light">Light</option>
          <option value="Dark">Dark</option>
        </Select>
      </SettingGroup>
    </div>
  )
}

function EmailNotifications() {
  return (
    <div>
      <h2 className="text-lg">Email notifications</h2>

      <fieldset disabled>
        <form>
          <SettingGroup title="New followers">
            <div className="flex items-center gap-3">
              <Tooltip
                label="Receive an email notification when someone new follows you."
                side="left"
              >
                <Information />
              </Tooltip>
              <Switch />
            </div>
          </SettingGroup>
          <SettingGroup title="New replies">
            <div className="flex items-center gap-3">
              <Tooltip
                label="Receive an email notification when you receive a new reply."
                side="left"
              >
                <Information />
              </Tooltip>
              <Switch />
            </div>
          </SettingGroup>
          <SettingGroup title="Tagged in a profile">
            <div className="flex items-center gap-3">
              <Tooltip
                label="Receive an email notification when you are tagged in a profile."
                side="left"
              >
                <Information />
              </Tooltip>
              <Switch />
            </div>
          </SettingGroup>
        </form>
      </fieldset>
    </div>
  )
}

function Account() {
  return (
    <div>
      <h2 className="text-lg">Account</h2>
      <ChangeEmail />
      <BlockedAccounts />
      <DeleteAccount />
    </div>
  )
}

export function AccountSettingsContent() {
  return (
    <>
      <div className="px-4 xs:px-8 flex-1 overflow-y-auto scrollbar-none">
        <div className="py-8 space-y-14">
          <GeneralSettings />
          <EmailNotifications />
          <Account />
        </div>
      </div>
      <div className="pt-4 mx-4 xs:mx-8 border-t border-divider flex justify-end">
        <SharedDialog.Close asChild>
          <RegularButton variant="secondary">Done</RegularButton>
        </SharedDialog.Close>
      </div>
    </>
  )
}
