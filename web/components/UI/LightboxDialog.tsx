import * as RadixDialog from '@radix-ui/react-dialog'
import React from 'react'

import { cn } from '@/lib'

type DialogState = 'initial' | 'animate' | 'exit'

type DialogContextProps = {
  canEscape: boolean
  overlayRef: React.RefObject<HTMLDivElement>
  contentRef: React.RefObject<HTMLDivElement>
  closeDialog: () => void
}

const DialogContext = React.createContext({} as DialogContextProps)

const exitDuration = 500
const overlayExitDuration = 400

export function useDialog() {
  return React.useContext(DialogContext)
}

type DialogProps = {
  children: React.ReactNode
  canEscape?: boolean
  triggerKey?: string
  enterDurationMobile?: number
  exitDurationMobile?: number
  enterDuration?: number
  exitDuration?: number
  overlayEnterDuration?: number
  overlayExitDuration?: number
}

export function Dialog({
  children,
  canEscape = true,
  triggerKey,
}: DialogProps) {
  const [open, setOpen] = React.useState(false)
  const timeoutRef = React.useRef<NodeJS.Timeout>()

  const overlayRef = React.useRef<HTMLDivElement>(null)
  const contentRef = React.useRef<HTMLDivElement>(null)

  function setState(state: DialogState, overlayDelay: number = 0) {
    if (overlayRef.current && contentRef.current) {
      setTimeout(() => {
        if (overlayRef.current) {
          overlayRef.current.dataset.dialogState = state
        }
      }, overlayDelay)
      contentRef.current.dataset.dialogState = state
    }
  }

  // Prevent layout shift caused by scrollbar
  React.useEffect(() => {
    if (open) {
      document.documentElement.style.scrollbarGutter = 'auto'
    } else {
      document.documentElement.style.scrollbarGutter = 'stable'
    }
  }, [open])

  const onOpenChange = React.useCallback((open: boolean) => {
    clearTimeout(timeoutRef.current!)
    if (open) {
      setOpen(open)
      // Trigger the 'animate' transition by using an instant delay, or else it won't work
      setTimeout(() => {
        setState('animate')
      })
    } else {
      setState('exit', overlayExitDuration)
      const duration = exitDuration
      timeoutRef.current = setTimeout(() => {
        setState('initial')
        setTimeout(() => {
          setOpen(open)
        }, duration - overlayExitDuration)
      }, duration + overlayExitDuration)
    }
  }, [])

  // Toggle the menu when ⌘[trigger_key] is pressed
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === triggerKey && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        onOpenChange(!open)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [triggerKey, onOpenChange, open])

  return (
    <RadixDialog.Root open={open} onOpenChange={onOpenChange}>
      <DialogContext.Provider
        value={{
          canEscape,
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
}

function DialogContent({
  children,
  className,
  overlayClassName,
}: DialogContentProps) {
  const { canEscape, overlayRef, contentRef, closeDialog } = useDialog()

  return (
    <RadixDialog.Portal>
      <RadixDialog.Overlay
        onClick={(e) => {
          e.stopPropagation()
        }}
        ref={overlayRef}
        data-dialog-overlay
        data-lightbox
        data-dialog-state="initial"
        className={cn(
          'fixed inset-0 z-30 w-full h-full bg-black/50 brightness-0',
          overlayClassName
        )}
      />
      <RadixDialog.Content
        onClick={(e) => {
          e.stopPropagation()
          closeDialog()
        }}
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
        data-lightbox
        data-dialog-state="initial"
        className={cn(
          'fixed z-30 top-0 left-0 shadow-md',
          'h-screen w-screen rounded-md',

          '[--scale-from:1] [--scale-to:1]',
          '[--y-from:0%] [--y-to:0%]',
          '[--x-from:0%] [--x-to:0%]',

          className
        )}
      >
        {children}
      </RadixDialog.Content>
    </RadixDialog.Portal>
  )
}

Dialog.Content = DialogContent
Dialog.Trigger = RadixDialog.Trigger
Dialog.Close = RadixDialog.Close
