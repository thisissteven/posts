import * as React from 'react'

import { useUser } from '@/hooks'

import { Information } from '@/components/Icons'
import {
  RegularButton,
  Select,
  SharedDialog,
  Switch,
  Tooltip,
} from '@/components/UI'

function SettingGroup({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle?: string
  children: React.ReactNode
}) {
  return (
    <div className="flex justify-between items-center mt-5">
      <div className="space-y-1">
        <div className="text-sm">{title}</div>
        <div className="text-span text-sm">{subtitle}</div>
      </div>
      {children}
    </div>
  )
}

function GeneralSettings() {
  return (
    <div>
      <h2 className="text-lg">General</h2>
      <SettingGroup
        title="Allow new replies from"
        subtitle="Everyone can reply to you"
      >
        <Select style={{ width: '104px' }}>
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
  const {
    user: { email },
  } = useUser()

  return (
    <div>
      <h2 className="text-lg">Account</h2>
      <SettingGroup title="Email address" subtitle={email}>
        <RegularButton variant="secondary" style={{ width: '104px' }}>
          Change
        </RegularButton>
      </SettingGroup>
      <SettingGroup title="Blocked accounts" subtitle="1 blocked accounts">
        <RegularButton
          disabled
          className="disabled:bg-soft-background disabled:opacity-60"
          variant="secondary"
          style={{ width: '104px' }}
        >
          See all
        </RegularButton>
      </SettingGroup>
      <SettingGroup title="Account" subtitle="Joined 11 days ago">
        <RegularButton
          className="text-danger"
          variant="secondary"
          style={{ width: '104px' }}
        >
          Delete
        </RegularButton>
      </SettingGroup>
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
