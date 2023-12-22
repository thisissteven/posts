import React from 'react'

import { useDialogState } from '@/hooks'

import { SharedDialog } from '@/components/UI'

import { BookmarksDialogContent } from './BookmarksDialogContent'

type BookmarksDialogContextValues = {
  openBookmarksDialog: () => void
  closeBookmarksDialog: () => void
}

const BookmarksDialogContext = React.createContext(
  {} as BookmarksDialogContextValues
)

export function useBookmarksDialog() {
  return React.useContext(BookmarksDialogContext)
}

export function BookmarksDialogProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const dialogState = useDialogState()

  return (
    <BookmarksDialogContext.Provider
      value={{
        openBookmarksDialog: () => dialogState.onOpenChange(true),
        closeBookmarksDialog: () => dialogState.onOpenChange(false),
      }}
    >
      <SharedDialog dialogState={dialogState}>
        <SharedDialog.Content className="max-w-[415px]">
          <BookmarksDialogContent />
        </SharedDialog.Content>
      </SharedDialog>
      {children}
    </BookmarksDialogContext.Provider>
  )
}
