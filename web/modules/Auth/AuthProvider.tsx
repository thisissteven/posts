import { usePathname, useRouter } from 'next/navigation'
import { Session } from 'next-auth'
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
  session: Session | null
}

const AuthContext = React.createContext({} as AuthContextValues)

export function useAuth() {
  return React.useContext(AuthContext)
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()

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
    const needAuthPathnames = ['/replies', '/notifications', '/bookmarks']
    if (!isAuthenticated && needAuthPathnames.includes(pathname)) {
      router.replace('/')
      dialogState.onOpenChange(true)
    }
  }, [dialogState, isAuthenticated, pathname, router])

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
        signOut: () => {
          // clear cache for like and repost on sign out
          mutate(
            (key) =>
              typeof key === 'string' &&
              (key.includes('like') || key.includes('repost')),
            undefined,
            { revalidate: false }
          )
          signOut({ redirect: false }).then(() => router.replace('/'))
        },
        session,
      }}
    >
      <SharedDialog dialogState={dialogState}>
        <SharedDialog.Content>
          <AuthDialogContent />
        </SharedDialog.Content>
      </SharedDialog>
      {children}
    </AuthContext.Provider>
  )
}
