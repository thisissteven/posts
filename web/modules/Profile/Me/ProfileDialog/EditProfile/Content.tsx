import * as React from 'react'

import { EditProfileForm, EditProfilePhoto } from '.'

export function EditProfileContent() {
  return (
    <div className="py-8">
      <div className="flex items-center gap-4">
        <EditProfilePhoto withRemoveImage />
      </div>
      <div className="mt-6">
        <EditProfileForm />
      </div>
    </div>
  )
}
