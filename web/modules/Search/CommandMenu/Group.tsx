import clsx from 'clsx'
import { Command } from 'cmdk'
import { useRouter } from 'next/navigation'
import React from 'react'

import { useDialog } from '@/components/UI'

import { CommandMenuItem } from './Item'

import { CommandMenuItemProps } from '@/types'

export function CommandMenuGroup({
  heading,
  data,
}: {
  heading?: string
  data: CommandMenuItemProps[]
}) {
  const router = useRouter()

  const { closeDialog } = useDialog()

  return (
    <>
      <style jsx global>{`
        [cmdk-group-heading] {
          padding: 0.5rem;
        }
      `}</style>
      <Command.Group
        heading={heading}
        className={clsx(
          'text-span text-xs font-light tracking-wide',
          heading && 'mt-1.5'
        )}
      >
        {data.map((user) => {
          return (
            <CommandMenuItem
              key={user.id}
              value={`${heading} ${user.displayName} ${user.username} ${user.bio}`}
              onSelect={async () => {
                const profileUrl = `/${user.username}`.replace('@', '')

                router.push(profileUrl)
                closeDialog()
              }}
              {...user}
            />
          )
        })}
      </Command.Group>
    </>
  )
}
