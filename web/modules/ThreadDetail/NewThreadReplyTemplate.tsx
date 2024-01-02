import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import {
  Controller,
  FormProvider,
  useForm,
  useFormContext,
  useWatch,
} from 'react-hook-form'

import { useMutation, useUser } from '@/hooks'

import { FormTextarea, RegularButton, UploadImageInput } from '@/components/UI'

import {
  CharacterCount,
  createNewThread,
  MediaPreview,
  NewThreadFormValues,
  NewThreadPayload,
  newThreadSchema,
  OpenGraphPreview,
} from '@/modules//ThreadForm'

import { ThreadItem } from '@/types'

export function NewThreadReplyTemplate({ thread }: { thread: ThreadItem }) {
  const [open, setOpen] = React.useState(false)
  const { user } = useUser()

  const methods = useForm<NewThreadFormValues>({
    shouldUnregister: true,
    resolver: zodResolver(newThreadSchema),
    mode: 'onChange',
    defaultValues: {
      textContent: '',
      source: null,
    },
  })

  const { handleSubmit, register, control, reset } = methods

  const onEscape = React.useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        setOpen(false)
        reset()
      }
    },
    [reset]
  )

  const { trigger } = useMutation<NewThreadPayload>(
    `/reply/${thread.level}/${thread.id}`,
    createNewThread,
    {
      mutatedBy: 'thread-reply',
    }
  )

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(async function (data) {
          await trigger({
            ...data,
            userId: user.id,
          })
          reset()
          setOpen(false)
        })}
        className="flex-1"
      >
        <div className="flex flex-col gap-1 w-full">
          {open && (
            <span className="text-span text-xs">
              Replying to @{thread.owner.username}
            </span>
          )}

          <Controller
            control={control}
            name="textContent"
            render={({ field: { onChange, onBlur, value, name } }) => (
              <FormTextarea
                style={{
                  height: open ? '48px' : '40px',
                }}
                onEscape={onEscape}
                onFocus={() => setOpen(true)}
                placeholder="Leave a reply..."
                placeholderClassName={[open ? 'top-[0.5px]' : 'top-[11px]']}
                onBlur={onBlur}
                onChange={onChange}
                value={value}
                name={name}
              />
            )}
          />

          <MediaPreview />
          <OpenGraphPreview />

          {open && (
            <div className="flex justify-between mt-2">
              <div className="flex gap-4 items-center">
                <UploadImageInput {...register('source')} />
                <CharacterCount control={control} />
              </div>
              <div className="space-x-2">
                <RegularButton
                  type="button"
                  variant="underline"
                  className="py-1.5 px-2"
                  onClick={() => {
                    setOpen(false)
                    reset()
                  }}
                >
                  Cancel
                </RegularButton>
                <PostButton
                  threadId={thread.id}
                  threadLevel={thread.level}
                  mutatedBy="thread-reply"
                />
              </div>
            </div>
          )}
        </div>
      </form>
    </FormProvider>
  )
}

function PostButton({
  mutatedBy,
  threadId,
  threadLevel,
}: {
  mutatedBy: string
  threadId: string
  threadLevel: number
}) {
  const {
    control,
    formState: { errors },
  } = useFormContext<NewThreadFormValues>()

  const input = useWatch({
    control,
    name: 'textContent',
  })

  const media = useWatch({
    control,
    name: 'source',
  })

  const { status } = useMutation(`/reply/${threadLevel}/${threadId}`)

  return (
    <RegularButton
      isLoading={status.state === 'loading' && status.mutatedBy === mutatedBy}
      loaderVariant="secondary"
      disabled={
        (!media && input.length === 0) || Boolean(errors['textContent'])
      }
    >
      Post
    </RegularButton>
  )
}
