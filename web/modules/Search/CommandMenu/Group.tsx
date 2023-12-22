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
  heading: string
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
        className="mt-1.5 text-span text-xs font-light tracking-wide"
      >
        {data.map((props) => {
          return (
            <CommandMenuItem
              onSelect={async (value) => {
                const profileUrl = `/${value}`.replace('@', '')

                router.push(profileUrl)
                closeDialog()
              }}
              key={props.username}
              {...props}
            />
          )
        })}
      </Command.Group>
    </>
  )
}
