import { zodResolver } from '@hookform/resolvers/zod'
import clsx from 'clsx'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'

import { FormInput, RegularButton } from '@/components/UI'

import { useAuth } from '@/modules/Auth'

import { useOnboarding } from '.'

const onboardingSchema = z.object({
  username: z
    .string()
    .min(2, 'Username is invalid')
    .max(20, 'Username is invalid')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username is invalid'),
  displayName: z.string().min(1).max(48),
})

type OnboardingFormValues = z.infer<typeof onboardingSchema>

export function OnboardingDialogContent() {
  const { signOut } = useAuth()
  const { isUpdating, closeOnboardingDialog, updateOnboardingState } =
    useOnboarding()

  const methods = useForm<OnboardingFormValues>({
    resolver: zodResolver(onboardingSchema),
    mode: 'onChange',
    defaultValues: {
      displayName: '',
      username: '',
    },
  })

  const {
    handleSubmit,
    formState: { errors },
  } = methods

  return (
    <div className="bg-background overflow-x-hidden">
      <div className={clsx('flex duration-300 ease-in-out')}>
        <div className="shrink-0 w-full px-6 py-5 grid place-items-center">
          <div>
            <p className="text-lg font-medium">Welcome to CV 👋</p>
            <p className="mt-1.5 text-sm">
              We just need a few details to finish creating your account. You
              can always change this later.
            </p>

            <FormProvider {...methods}>
              <form
                className="mt-3 space-y-3"
                onSubmit={handleSubmit(updateOnboardingState)}
              >
                <FormInput
                  id="username"
                  label="Username"
                  placeholder="your unique @username"
                  autoComplete="off"
                />

                <FormInput
                  id="displayName"
                  label="Display Name"
                  placeholder="The name on your profile"
                  autoComplete="off"
                  maxLength={48}
                  watchLength
                />

                <div className="flex justify-between">
                  <RegularButton
                    type="button"
                    onClick={() => {
                      signOut()
                      closeOnboardingDialog()
                    }}
                    variant="underline"
                    className="text-span text-xs font-light"
                  >
                    Log in with a different email
                  </RegularButton>

                  <RegularButton
                    variant="secondary"
                    disabled={Boolean(errors.username || errors.displayName)}
                    isLoading={isUpdating}
                    className="disabled:bg-soft-background disabled:text-span"
                  >
                    Continue
                  </RegularButton>
                </div>
              </form>
            </FormProvider>
          </div>
        </div>
      </div>
    </div>
  )
}
