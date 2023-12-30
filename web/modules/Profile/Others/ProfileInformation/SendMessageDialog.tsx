import { usePathname } from 'next/navigation'
import React from 'react'

import { useUser } from '@/hooks'

import { RepliesIconFilled } from '@/components/Icons'
import {
  Dialog,
  IconButton,
  RegularButton,
  Textarea,
  Tooltip,
} from '@/components/UI'

export function SendMessageDialog() {
  const { user: currentUser } = useUser()

  const createdAt = currentUser?.createdAt

  const has24HoursPassed = React.useMemo(() => {
    if (!createdAt) return false

    const now = new Date()
    const createdAtDate = new Date(createdAt)

    const diff = now.getTime() - createdAtDate.getTime()

    const hours = diff / (1000 * 60 * 60)

    return hours >= 24
  }, [createdAt])

  return (
    <Dialog needAuth>
      <Tooltip label="Message" side="top" asChild>
        <Dialog.Trigger asChild>
          <IconButton variant="filled">
            <div className="-translate-x-0.5">
              <RepliesIconFilled />
            </div>
          </IconButton>
        </Dialog.Trigger>
      </Tooltip>
      <Dialog.Content className="max-w-[375px]">
        {has24HoursPassed ? <SendMessageDialogContent /> : <CannotReplyYet />}
      </Dialog.Content>
    </Dialog>
  )
}

function SendMessageDialogContent() {
  const pathname = usePathname()
  const usernameToMessage = pathname?.split('/')[1]

  const [message, setMessage] = React.useState('')

  return (
    <div className="bg-background p-6 rounded-2xl overflow-hidden">
      <p className="text-lg font-medium">New message</p>
      <Textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        style={{
          height: '82px',
        }}
        minHeight="82px"
        className="bg-soft-background rounded-lg mt-3 p-3 text-primary text-sm placeholder:text-light-span"
        placeholder={`Message @${usernameToMessage}...`}
        spellCheck={false}
      />

      <div className="flex justify-end gap-4 mt-4">
        <Dialog.Close asChild>
          <RegularButton variant="underline">Cancel</RegularButton>
        </Dialog.Close>
        <RegularButton
          className="disabled:bg-soft-background disabled:opacity-60"
          disabled={message.length === 0}
          variant="secondary"
        >
          Send
        </RegularButton>
      </div>
    </div>
  )
}

function CannotReplyYet() {
  return (
    <div className="bg-background p-6 rounded-2xl overflow-hidden">
      <p className="text-lg font-medium">24 hours until you can reply 🐣</p>
      <p className="mt-1.5 text-sm leading-6 font-light">
        In order to help keep our community safe profiles must be over 24 hours
        old to send new replies. You can still send messages to people who have
        sent you replies in the replies tab.
      </p>

      <div className="flex justify-end mt-4">
        <Dialog.Close asChild>
          <RegularButton variant="secondary">Got it</RegularButton>
        </Dialog.Close>
      </div>
    </div>
  )
}
