import React from 'react'

import { useAuth } from '@/modules/Auth'

export function AuthButton({
  children,
  onClick,
  ...rest
}: React.ComponentPropsWithoutRef<'button'>) {
  const { isAuthenticated, openAuthDialog } = useAuth()

  return (
    <button
      {...rest}
      onClick={(e) => {
        if (isAuthenticated) {
          e.stopPropagation()
          onClick?.(e)
        } else {
          e.preventDefault()
          e.stopPropagation()
          openAuthDialog()
        }
      }}
    >
      {children}
    </button>
  )
}
