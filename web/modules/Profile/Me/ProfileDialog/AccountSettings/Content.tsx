import { useSession } from 'next-auth/react'
import * as React from 'react'

import { RegularButton, Select, SharedDialog } from '@/components/UI'

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
    <div className="flex justify-between items-center mt-4">
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

      <SettingGroup title="New followers">
        <Select style={{ width: '104px' }}>
          <option value="Everyone">Everyone</option>
          <option value="Following">Following</option>
          <option value="Nobody">Nobody</option>
        </Select>
      </SettingGroup>
      <SettingGroup title="New replies">
        <Select style={{ width: '104px' }}>
          <option value="Everyone">Everyone</option>
          <option value="Following">Following</option>
          <option value="Nobody">Nobody</option>
        </Select>
      </SettingGroup>
      <SettingGroup title="Tagged in a profile">
        <Select style={{ width: '104px' }}>
          <option value="Everyone">Everyone</option>
          <option value="Following">Following</option>
          <option value="Nobody">Nobody</option>
        </Select>
      </SettingGroup>
    </div>
  )
}

function Account() {
  const { data: session } = useSession()

  const email = session?.user?.email as string
  return (
    <div>
      <h2 className="text-lg">Account</h2>
      <SettingGroup title="Email address" subtitle={email}>
        <Select style={{ width: '104px' }}>
          <option value="Everyone">Everyone</option>
          <option value="Following">Following</option>
          <option value="Nobody">Nobody</option>
        </Select>
      </SettingGroup>
      <SettingGroup title="Blocked accounts" subtitle="1 blocked accounts">
        <Select style={{ width: '104px' }}>
          <option value="Everyone">Everyone</option>
          <option value="Following">Following</option>
          <option value="Nobody">Nobody</option>
        </Select>
      </SettingGroup>
      <SettingGroup title="Account" subtitle="Joined 11 days ago">
        <Select style={{ width: '104px' }}>
          <option value="Everyone">Everyone</option>
          <option value="Following">Following</option>
          <option value="Nobody">Nobody</option>
        </Select>
      </SettingGroup>
    </div>
  )
}

export function AccountSettingsContent() {
  return (
    <>
      <div className="px-4 xs:px-8 flex-1 overflow-y-auto scrollbar-none">
        <div className="py-8 space-y-12">
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
