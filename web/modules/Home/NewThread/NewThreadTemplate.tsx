import React from 'react'
import z from 'zod'

import {
  Dialog,
  RegularButton,
  Textarea,
  UploadImageInput,
} from '@/components/UI'

const newThreadSchema = z.object({
  title: z.string().nonempty(),
  body: z.string().nonempty(),
})

export function NewThreadTemplate({
  canEscape = true,
}: {
  canEscape?: boolean
}) {
  const [open, setOpen] = React.useState(false)
  const [input, setInput] = React.useState('')

  const onEscape = React.useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && canEscape) {
        e.preventDefault()
        setOpen(false)
        setInput('')
      }
    },
    [canEscape]
  )

  return (
    <div className="flex flex-col gap-1 w-full">
      {open && <span className="text-span text-xs">Anyone can reply</span>}
      <Textarea
        className={open ? 'h-12' : 'h-10'}
        onEscape={onEscape}
        value={input}
        onChange={(e) => {
          setInput(e.target.value)
        }}
        onFocus={() => setOpen(true)}
        placeholder="What's on your mind..."
        placeholderClassName={[
          open ? 'top-[0.5px]' : 'top-[11px]',
          input.length > 0 && 'hidden',
        ]}
      />

      {open && (
        <div className="flex justify-between mt-2">
          <UploadImageInput />
          <div className="space-x-2">
            {canEscape ? (
              <RegularButton
                variant="underline"
                className="py-1.5 px-2"
                onClick={() => {
                  setOpen(false)
                  setInput('')
                }}
              >
                Cancel
              </RegularButton>
            ) : (
              <Dialog.Close asChild>
                <RegularButton className="py-1.5 px-2" variant="underline">
                  Cancel
                </RegularButton>
              </Dialog.Close>
            )}
            <RegularButton disabled={input.length === 0}>Post</RegularButton>
          </div>
        </div>
      )}
    </div>
  )
}
