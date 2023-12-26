import clsx from 'clsx'
import React from 'react'
import { Control, useFormContext, useWatch } from 'react-hook-form'

import { Popover, RegularButton, Textarea, usePopover } from '@/components/UI'

import { NewThreadFormValues } from './Form'

function CharacterCount({
  control,
}: {
  control: Control<NewThreadFormValues>
}) {
  const value = useWatch({
    control,
    name: 'alt',
  })

  const length = value?.length ?? 0

  const digits = length.toString().length

  return (
    <div className="text-span text-xs flex">
      <div
        className={clsx(
          digits === 1 && 'w-3',
          digits === 2 && 'w-[18px]',
          digits === 3 && 'w-6'
        )}
      >
        {length}
      </div>{' '}
      / 100
    </div>
  )
}

export const DescriptiveText = React.memo(() => {
  const { control, getValues, setValue } = useFormContext<NewThreadFormValues>()
  const [alt, setAlt] = React.useState(getValues('alt'))

  const { closePopover } = usePopover()

  return (
    <>
      <div className="flex flex-col gap-2 px-4 py-2">
        <Textarea
          style={{
            height: '48px',
          }}
          value={alt}
          onChange={(e) => {
            setAlt(e.target.value)
          }}
          minHeight="48px"
          placeholder="Add descriptive text for screen readers"
          className="text-sm text-primary"
          maxLength={100}
        />
      </div>
      <div className="flex items-center justify-between px-4">
        <CharacterCount control={control} />
        <div className="flex justify-end gap-2">
          <Popover.Close asChild>
            <RegularButton variant="underline">Cancel</RegularButton>
          </Popover.Close>
          <RegularButton
            variant="secondary"
            onClick={() => {
              setValue('alt', alt)
              closePopover()
            }}
          >
            Save
          </RegularButton>
        </div>
      </div>
    </>
  )
})
