import React from 'react'

import { LinkButton, RegularButton, SharedDialog } from '@/components/UI'

import { SupporterOnly } from '.'

export function BookmarksDialogContent() {
  return (
    <div className="bg-background p-6">
      <SupporterOnly />
      <p className="mt-3 text-soft-primary text-sm leading-6">
        Bookmarks allow you to privately save posts for later. This feature is
        only available to supporters. Become a supporter to unlock this and more
        great features.
      </p>
      <div className="mt-3 flex justify-end gap-3">
        <SharedDialog.Trigger asChild>
          <RegularButton variant="underline">Cancel</RegularButton>
        </SharedDialog.Trigger>
        <LinkButton
          variant="secondary"
          href="https://read.cv/about/supporters"
          className="text-primary bg-soft-background"
        >
          Become a supporter
        </LinkButton>
      </div>
    </div>
  )
}
