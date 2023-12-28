import { usePathname, useRouter } from 'next/navigation'
import { signIn, signOut, useSession } from 'next-auth/react'
import React from 'react'
import { isMobile } from 'react-device-detect'
import { mutate } from 'swr'

import { newWindow } from '@/lib'
import { useDialogState } from '@/hooks/useDialogState'

import { SharedDialog } from '@/components/UI'

import { AuthDialogContent } from '.'

type AuthContextValues = {
  openAuthDialog: () => void
  closeAuthDialog: () => void
  isAuthenticated: boolean
  signOut: () => void

  signInWithGoogle: () => void
}

const AuthContext = React.createContext({} as AuthContextValues)

export function useAuth() {
  return React.useContext(AuthContext)
}

const needAuthPathnames = ['/replies', '/notifications', '/bookmarks']

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { status } = useSession()

  const dialogState = useDialogState()

  const router = useRouter()
  const pathname = usePathname()

  const isAuthenticated = React.useMemo(
    () => status === 'authenticated',
    [status]
  )

  React.useEffect(() => {
    let timeout: NodeJS.Timeout
    if (isAuthenticated) {
      timeout = setTimeout(() => {
        dialogState.onOpenChange(false)
      }, 500)
    }

    return () => clearTimeout(timeout)
  }, [dialogState, isAuthenticated])

  React.useEffect(() => {
    if (!isAuthenticated && needAuthPathnames.includes(pathname)) {
      router.replace('/')
    }
  }, [isAuthenticated, pathname, router])

  React.useEffect(() => {
    if (!isAuthenticated && needAuthPathnames.includes(pathname)) {
      dialogState.onOpenChange(true)
    }
  }, [dialogState, isAuthenticated, pathname])

  return (
    <AuthContext.Provider
      value={{
        openAuthDialog: () => dialogState.onOpenChange(true),
        closeAuthDialog: () => dialogState.onOpenChange(false),
        isAuthenticated,
        signInWithGoogle: () => {
          if (isMobile) {
            signIn('google', { callbackUrl: '/' })
          } else {
            newWindow('/google-signin', 'Sign In with Google')
          }
        },
        signOut: async () => {
          // clear cache for like and repost on sign out
          mutate(
            (key) =>
              typeof key === 'string' &&
              (key.includes('like') || key.includes('repost')),
            undefined,
            { revalidate: false }
          )
          await signOut({ redirect: false })
          router.replace('/')
        },
      }}
    >
      <SharedDialog dialogState={dialogState}>
        <SharedDialog.Content canEscape={!needAuthPathnames.includes(pathname)}>
          <AuthDialogContent />
        </SharedDialog.Content>
      </SharedDialog>
      {children}
    </AuthContext.Provider>
  )
}
