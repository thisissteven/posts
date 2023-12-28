import React from 'react'

import { useCurrentOpenDialog } from '@/store'

type DialogState = 'initial' | 'animate' | 'exit'

export type DialogStateReturnType = {
  open: boolean
  onOpenChange: (open: boolean) => void
  overlayRef: React.RefObject<HTMLDivElement>
  contentRef: React.RefObject<HTMLDivElement>
}

export function useDialogState() {
  const [open, setOpen] = React.useState(false)
  const timeoutRef = React.useRef<NodeJS.Timeout>()

  const overlayRef = React.useRef<HTMLDivElement>(null)
  const contentRef = React.useRef<HTMLDivElement>(null)

  function setState(state: DialogState) {
    if (overlayRef.current && contentRef.current) {
      overlayRef.current.dataset.dialogState = state
      contentRef.current.dataset.dialogState = state
    }
  }

  const hasEverOpen = React.useRef(false)

  const currentOpen = useCurrentOpenDialog()

  // Prevent layout shift caused by scrollbar
  React.useEffect(() => {
    if (open) {
      document.documentElement.style.scrollbarGutter = 'auto'
      hasEverOpen.current = true
    } else {
      // Only set scrollbarGutter to 'stable' if the dialog has ever been open,
      // not on first mount
      // Otherwise, it will cause a layout shift when another dialog is still open
      if (hasEverOpen.current && !currentOpen) {
        document.documentElement.style.scrollbarGutter = 'stable'
      }
    }
  }, [currentOpen, open])

  const onOpenChange = React.useCallback((open: boolean) => {
    clearTimeout(timeoutRef.current!)
    if (open) {
      setOpen(open)
      // Trigger the 'animate' transition by using an instant delay, or else it won't work
      setTimeout(() => {
        setState('animate')
      })
    } else {
      setState('exit')
      const duration = window.innerWidth <= 448 ? 500 : 200
      timeoutRef.current = setTimeout(() => {
        setState('initial')
        setOpen(open)
      }, duration)
    }
  }, [])

  return { open, onOpenChange, overlayRef, contentRef }
}
