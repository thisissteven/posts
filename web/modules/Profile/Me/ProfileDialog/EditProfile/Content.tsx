import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import * as React from 'react'
import {
  FormProvider,
  useForm,
  useFormContext,
  useWatch,
} from 'react-hook-form'
import useSWR from 'swr'

import { apiClient } from '@/lib'
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
    updateUser,
  } = useUser()
  const { data: userData, mutate } = useSWR(`/profile/${username}`)
  const { trigger, reset: resetStatus } = useMutation<EditProfileSchema>(
    `/profile/${username}`,
    async (url, args) => {
      const response = await apiClient.put(url, args)
      return response.data
    }
  )

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

  const { handleSubmit, reset } = methods

  const router = useRouter()

  const onSubmit = async (values: EditProfileSchema) => {
    await trigger(values)
    await updateUser(values)
    reset(values)
    resetStatus()
    mutate(values, {
      revalidate: false,
    })
    if (values.username !== userData?.username) {
      router.replace(`/${values.username}`)
    }
  }

  return (
    <FormProvider {...methods}>
      <form
        onKeyDown={(e) => {
          const target = e.target as HTMLElement
          if (e.key === 'Enter' && target.tagName.toLowerCase() === 'input')
            e.preventDefault()
        }}
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
    reset,
    formState: { errors, dirtyFields },
  } = useFormContext<EditProfileSchema>()

  const {
    user: { username },
  } = useUser()

  const { status } = useMutation<EditProfileSchema>(`/profile/${username}`)

  const value = useWatch({
    control,
    name: 'username',
  })

  const debouncedValue = useDebounce(value, 300)

  const { data } = useSWR<{
    id: string
  }>(`/user/${debouncedValue}`)

  const usernameTaken = Boolean(data?.id) && Boolean(dirtyFields.username)

  const hasError = Object.keys(errors).length > 0 || usernameTaken

  const isDirty = Object.keys(dirtyFields).length > 0

  if (isDirty && status.state !== 'success') {
    return (
      <div className="pt-4 mx-4 xs:mx-8 border-t border-divider flex justify-end gap-4">
        <RegularButton
          type="button"
          variant="underline"
          onClick={() =>
            reset(undefined, {
              keepDefaultValues: true,
            })
          }
        >
          Cancel
        </RegularButton>
        <RegularButton
          variant="secondary"
          className="disabled:opacity-60 disabled:bg-soft-background"
          disabled={hasError}
          isLoading={status.state === 'loading'}
        >
          Save
        </RegularButton>
      </div>
    )
  }

  return (
    <div className="pt-4 mx-4 xs:mx-8 border-t border-divider flex justify-end">
      <SharedDialog.Close type="button" asChild>
        <RegularButton type="button" variant="secondary">
          Done
        </RegularButton>
      </SharedDialog.Close>
    </div>
  )
}
