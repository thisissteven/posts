import clsx from 'clsx'
import React from 'react'
import { Control, useWatch } from 'react-hook-form'

import { NewThreadFormValues } from './Form'

export function CharacterCount({
  control,
}: {
  control: Control<NewThreadFormValues>
}) {
  const value = useWatch({
    control,
    name: 'textContent',
  })

  const length = value?.length ?? 0

  const warning = length > 260 && length <= 280
  const danger = length > 280
  const transparent = length <= 260

  return (
    <span
      className={clsx(
        warning && 'text-orange',
        danger && 'text-danger-soft',
        transparent && 'text-transparent'
      )}
    >
      {280 - length}
    </span>
  )
}
