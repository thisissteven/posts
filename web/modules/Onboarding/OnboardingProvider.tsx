import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import React from 'react'

import { apiClient } from '@/lib'
import { useDialogState } from '@/hooks/useDialogState'

import { SharedDialog } from '@/components/UI'

import { OnboardingDialogContent } from './OnboardingDialogContent'

type OnboardingContextValues = {
  openOnboardingDialog: () => void
  closeOnboardingDialog: () => void
  updateOnboardingState: ({
    username,
    displayName,
  }: {
    username: string
    displayName: string
  }) => Promise<void>
  isOnboarded: boolean
  isUpdating: boolean
}

const OnboardingContext = React.createContext({} as OnboardingContextValues)

export function useOnboarding() {
  return React.useContext(OnboardingContext)
}

export function OnboardingProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status, update } = useSession()

  const dialogState = useDialogState()
  const router = useRouter()

  const isAuthenticated = status === 'authenticated'

  const isOnboarded = Boolean(
    session?.user?.displayName && session?.user?.username
  )

  React.useEffect(() => {
    let timeout: NodeJS.Timeout
    if (isAuthenticated && !isOnboarded) {
      timeout = setTimeout(() => {
        dialogState.onOpenChange(true)
      }, 1000)
    }

    return () => clearTimeout(timeout)
  }, [dialogState, isOnboarded, isAuthenticated])

  const [isUpdating, setIsUpdating] = React.useState(false)

  return (
    <OnboardingContext.Provider
      value={{
        openOnboardingDialog: () => dialogState.onOpenChange(true),
        closeOnboardingDialog: () => dialogState.onOpenChange(false),
        isOnboarded,
        isUpdating,
        updateOnboardingState: async ({ username, displayName }) => {
          setIsUpdating(true)
          const response = await apiClient.put('/auth/onboarding', {
            username,
            displayName,
          })
          const sessionObj = {
            ...session,
            user: {
              ...session?.user,
              username: response.data.username,
              displayName: response.data.displayName,
            },
          }
          update(sessionObj)
            .then(() => {
              router.push(`/${sessionObj.user?.username}`)
              dialogState.onOpenChange(false)
            })
            .finally(() => setIsUpdating(false))
        },
      }}
    >
      <SharedDialog dialogState={dialogState}>
        <SharedDialog.Content canEscape={false}>
          <OnboardingDialogContent />
        </SharedDialog.Content>
      </SharedDialog>
      {children}
    </OnboardingContext.Provider>
  )
}
