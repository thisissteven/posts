import React from 'react'

import { UploadImage } from '../Icons'

export const UploadImageInput = React.forwardRef(function UploadImageInput(
  { ...rest }: React.ComponentPropsWithoutRef<'input'>,
  ref: React.Ref<HTMLInputElement>
) {
  return (
    <div className="relative active:opacity-80 shrink-0">
      <UploadImage />
      <input
        {...rest}
        ref={ref}
        className="peer cursor-pointer absolute inset-0 w-full h-full opacity-0"
        type="file"
        accept="image/jpeg, image/png, image/gif, video/mp4, video/quicktime"
      />
    </div>
  )
})
