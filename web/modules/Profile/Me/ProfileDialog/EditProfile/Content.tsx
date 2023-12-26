import * as React from 'react'

import { RegularButton, SharedDialog } from '@/components/UI'

import { EditProfileForm, EditProfilePhoto } from '.'

export function EditProfileContent() {
  return (
    <>
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
      <div className="pt-4 mx-4 xs:mx-8 border-t border-divider flex justify-end">
        <SharedDialog.Close asChild>
          <RegularButton variant="secondary">Done</RegularButton>
        </SharedDialog.Close>
      </div>
    </>
  )
}
