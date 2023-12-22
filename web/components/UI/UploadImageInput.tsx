import React from 'react'

import { UploadImage } from '../Icons'

export function UploadImageInput({
  ...rest
}: React.ComponentPropsWithoutRef<'input'>) {
  return (
    <div className="relative active:opacity-80 shrink-0">
      <UploadImage />
      <input
        className="peer cursor-pointer absolute inset-0 w-full h-full opacity-0"
        type="file"
        accept="image/jpeg, image/png, image/gif, video/mp4, video/quicktime"
        {...rest}
      />
    </div>
  )
}
