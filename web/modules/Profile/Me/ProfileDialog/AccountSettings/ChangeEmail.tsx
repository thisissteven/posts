import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import { apiClient } from '@/lib'
import { useMutation, useUser } from '@/hooks'

import { FormInput, RegularButton } from '@/components/UI'

import { useAuth } from '@/modules/Auth'

import { SettingGroup } from './SettingGroup'

function ChangeEmailContent({
  toggleChangeEmail,
}: {
  toggleChangeEmail: () => void
}) {
  const { signOut } = useAuth()

  const { user } = useUser()

  const { trigger, status } = useMutation('/user', async (url) => {
    const { data } = await apiClient.delete(url)
    return data
  })

  const methods = useForm({
    defaultValues: {
      email: user.email,
    },
  })

  const {
    register,
    formState: { isDirty, errors },
  } = methods

  const hasError = Object.keys(errors).length > 0

  return (
    <FormProvider {...methods}>
      <form className="border-t border-t-divider pt-5 mt-5">
        <FormInput
          autoComplete="off"
          label="Update email address"
          {...register('email')}
          placeholder="Your username"
          readOnly
        />

        <div className="flex items-center justify-end gap-4 mt-4">
          <RegularButton
            type="button"
            variant="underline"
            onClick={toggleChangeEmail}
          >
            Cancel
          </RegularButton>
          <RegularButton
            disabled={!isDirty || hasError}
            isLoading={status.state === 'loading'}
            variant="secondary"
            className="disabled:bg-soft-background disabled:opacity-60"
            onClick={async () => {
              await trigger()
              signOut()
            }}
          >
            Save
          </RegularButton>
        </div>
      </form>
    </FormProvider>
  )
}

export function ChangeEmail() {
  const {
    user: { email },
  } = useUser()

  const [changeEmailMode, toggleChangeEmailMode] = React.useReducer(
    (state) => !state,
    false
  )

  if (changeEmailMode) {
    return <ChangeEmailContent toggleChangeEmail={toggleChangeEmailMode} />
  }

  return (
    <SettingGroup title="Email address" subtitle={email}>
      <RegularButton
        onClick={toggleChangeEmailMode}
        variant="secondary"
        style={{ width: '104px' }}
      >
        Change
      </RegularButton>
    </SettingGroup>
  )
}
