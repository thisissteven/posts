import { zodResolver } from '@hookform/resolvers/zod'
import * as React from 'react'
import {
  FormProvider,
  useForm,
  useFormContext,
  useWatch,
} from 'react-hook-form'
import useSWR from 'swr'

import { useDebounce, useMutation, useUser } from '@/hooks'

import { RegularButton, SharedDialog } from '@/components/UI'

import {
  EditProfileForm,
  EditProfilePhoto,
  EditProfileSchema,
  editProfileSchema,
} from '.'

export function EditProfileContent() {
  const {
    user: { username },
  } = useUser()
  const { data: userData } = useSWR(`/profile/${username}`)
  const { trigger } = useMutation<EditProfileSchema>(`/profile/${username}`)

  const methods = useForm<EditProfileSchema>({
    resolver: zodResolver(editProfileSchema),
    mode: 'onChange',
    defaultValues: {
      username: userData?.username ?? '',
      displayName: userData?.displayName ?? '',
      profession: userData?.profession ?? '',
      location: userData?.location ?? '',
      pronouns: userData?.pronouns ?? '',
      website: userData?.website ?? '',
    },
  })

  const { handleSubmit } = methods

  const onSubmit = async (values: EditProfileSchema) => {}

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-background h-[calc(100%-61px)] w-full flex flex-col justify-between"
      >
        <div className="px-4 xs:px-8 flex-1 overflow-y-auto scrollbar-none">
          <div className="py-8">
            <div className="flex items-center gap-4">
              <EditProfilePhoto withRemoveImage />
            </div>
            <div className="mt-6">
              <EditProfileForm />
            </div>
            <div className="mt-10 mb-2">
              <p className="text-xs text-center font-light tracking-wide text-span">
                Edit your full profile at{' '}
                <a
                  href="https://read.cv"
                  target="_blank"
                  className="text-soft-primary hover:underline underline-offset-[3px]"
                >
                  read.cv
                </a>
              </p>
            </div>
          </div>
        </div>
        <FormButton />
      </form>
    </FormProvider>
  )
}

function FormButton() {
  const {
    control,
    formState: { isDirty, errors },
  } = useFormContext<EditProfileSchema>()

  const value = useWatch({
    control,
    name: 'username',
  })

  const debouncedValue = useDebounce(value, 300)

  const { data } = useSWR<{
    id: string
  }>(`/user/${debouncedValue}`)

  const usernameTaken = Boolean(data?.id)

  const hasError = Object.keys(errors).length > 0 || usernameTaken

  if (isDirty) {
    return (
      <div className="pt-4 mx-4 xs:mx-8 border-t border-divider flex justify-end gap-4">
        <RegularButton type="button" variant="underline">
          Cancel
        </RegularButton>
        <RegularButton
          variant="secondary"
          className="disabled:opacity-60 disabled:bg-soft-background"
          disabled={hasError}
        >
          Save
        </RegularButton>
      </div>
    )
  }

  return (
    <div className="pt-4 mx-4 xs:mx-8 border-t border-divider flex justify-end">
      <SharedDialog.Close asChild>
        <RegularButton type="button" variant="secondary">
          Done
        </RegularButton>
      </SharedDialog.Close>
    </div>
  )
}
