import * as RadixDialog from '@radix-ui/react-dialog'
import React from 'react'

import { cn } from '@/lib'
import { DialogStateReturnType } from '@/hooks/useDialogState'

type DialogContextProps = {
  overlayRef: React.RefObject<HTMLDivElement>
  contentRef: React.RefObject<HTMLDivElement>
  closeDialog: () => void
}

const DialogContext = React.createContext({} as DialogContextProps)

function useSharedDialog() {
  return React.useContext(DialogContext)
}

type DialogProps = {
  children: React.ReactNode
  dialogState: DialogStateReturnType
}

export function SharedDialog({
  children,
  dialogState: { open, onOpenChange, overlayRef, contentRef },
}: DialogProps) {
  return (
    <RadixDialog.Root open={open} onOpenChange={onOpenChange}>
      <DialogContext.Provider
        value={{
          overlayRef,
          contentRef,
          closeDialog: () => onOpenChange(false),
        }}
      >
        {children}
      </DialogContext.Provider>
    </RadixDialog.Root>
  )
}

type DialogContentProps = {
  children: React.ReactNode
  className?: string
  overlayClassName?: string
  canEscape?: boolean
}

function SharedDialogContent({
  children,
  className,
  overlayClassName,
  canEscape = true,
}: DialogContentProps) {
  const { overlayRef, closeDialog, contentRef } = useSharedDialog()

  return (
    <RadixDialog.Portal>
      <RadixDialog.Overlay
        ref={overlayRef}
        data-dialog-overlay
        data-dialog-state="initial"
        className={cn(
          'fixed inset-0 z-30 w-full h-full bg-black/50 brightness-0',
          overlayClassName
        )}
      />
      <RadixDialog.Content
        onCloseAutoFocus={(e) => {
          e.preventDefault()
        }}
        onEscapeKeyDown={(e) => {
          e.preventDefault()
          if (canEscape) closeDialog()
        }}
        onPointerDownOutside={(e) => {
          e.preventDefault()
          if (canEscape) closeDialog()
        }}
        onInteractOutside={(e) => {
          e.preventDefault()
          if (canEscape) closeDialog()
        }}
        ref={contentRef}
        data-dialog-content
        data-dialog-state="initial"
        className={cn(
          'fixed z-30 top-1/2 left-1/2 shadow-md',
          'max-h-dialog overflow-y-auto scrollbar',

          // default
          'w-full max-w-[375px] rounded-2xl',

          // desktop styles override
          'w-[calc(100%-1rem)] xs:w-[calc(100%-2rem)]',
          '[--scale-from:1] [--scale-to:1]',
          '[--y-from:-48%] [--y-to:-50%]',
          className
        )}
      >
        {children}
      </RadixDialog.Content>
    </RadixDialog.Portal>
  )
}

SharedDialog.Content = SharedDialogContent
SharedDialog.Trigger = RadixDialog.Trigger
SharedDialog.Close = RadixDialog.Close
