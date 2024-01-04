import { Command } from 'cmdk'
import React from 'react'
import useSWRImmutable from 'swr/immutable'

import { getRecentlyJoined } from '@/lib'

import { Dialog } from '@/components/UI'

import { useRecentlyViewed } from '@/store'

import {
  CommandMenuChips,
  CommandMenuFooter,
  CommandMenuGroup,
  CommandMenuHeader,
  CommandMenuProfileItem,
  CommandMenuSearch,
} from './CommandMenu'
import CommandNoResults from './CommandMenu/NoResults'

import { CommandMenuItemProps } from '@/types'

function useRecentlyJoined() {
  const { data: recentlyJoined } = useSWRImmutable<CommandMenuItemProps[]>(
    '/recently-joined',
    async () => {
      const users = await getRecentlyJoined()
      return users as unknown as CommandMenuItemProps[]
    }
  )

  return recentlyJoined ?? []
}

export function SearchCommandMenu({
  children,
  showProfile,
}: {
  children: React.ReactNode
  showProfile: boolean
}) {
  return (
    <Dialog triggerKey="k" needAuth>
      {children}

      <Dialog.Content
        overlayClassName="bg-transparent"
        className="border-[1.5px] border-divider top-[12px] xs:top-[72px] [--y-from:0.5rem] [--y-to:0rem] shadow-xl shadow-black-shadow rounded-lg"
      >
        <CommandMenuContent showProfile={showProfile} />
      </Dialog.Content>
    </Dialog>
  )
}

function CommandMenuContent({ showProfile }: { showProfile: boolean }) {
  const listRef = React.useRef<HTMLDivElement>(null)
  const [scrolled, setScrolled] = React.useState(false)

  const recentlyJoined = useRecentlyJoined()
  const recentlyViewed = useRecentlyViewed()

  const [value, setValue] = React.useState('')

  return (
    <>
      <Command
        label="Search for people or teams"
        className="relative bg-background h-[60vh] min-h-[400px]"
      >
        <CommandMenuHeader scrolled={scrolled}>
          <CommandMenuSearch value={value} onValueChange={setValue} />
          <CommandMenuChips />
        </CommandMenuHeader>

        <Command.List
          ref={listRef}
          onScroll={() => {
            if (!listRef.current) return
            listRef.current?.scrollTop > 0
              ? setScrolled(true)
              : setScrolled(false)
          }}
          className="overflow-y-auto h-[calc(100%-94px)] scrollbar-none p-2 scroll-pb-[86px] scroll-pt-[62px] pb-[calc(28px+0.5rem)]"
        >
          <CommandNoResults />

          {showProfile && <CommandMenuProfileItem />}

          {recentlyViewed && (
            <CommandMenuGroup heading="Recently viewed" data={recentlyViewed} />
          )}
          <CommandMenuGroup heading="Recently joined" data={recentlyJoined} />
        </Command.List>
      </Command>
      <CommandMenuFooter />
    </>
  )
}
