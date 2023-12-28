import { useRouter } from 'next/navigation'
import React from 'react'

import { apiClient } from '@/lib'
import { useUser } from '@/hooks'
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
  const { updateUser, isAuthenticated, isOnboarded } = useUser()

  const dialogState = useDialogState()
  const router = useRouter()

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
          await apiClient.put('/auth/onboarding', {
            username,
            displayName,
          })

          updateUser({ username, displayName })
            .then(() => {
              router.push(`/${username}`)
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
