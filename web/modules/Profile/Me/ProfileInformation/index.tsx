import { useSession } from 'next-auth/react'
import React from 'react'

import { apiClient, uploadImage } from '@/lib'
import { useMutation } from '@/hooks'

import { PencilIcon, ReadIcon } from '@/components/Icons'
import { IconButton, LoadingBar, ProfileAvatar, Tooltip } from '@/components/UI'

import Followers from './Followers'
import { Following } from './Following'

function ProfilePhoto() {
  const { data: session, update } = useSession()

  const { trigger, status } = useMutation<{
    file: File
  }>('/profile/change-avatar', async (url, args) => {
    const formData = new FormData()
    formData.append('file', args.file)
    formData.append('type', 'image')
    const { source } = await uploadImage({
      formData,
      userId: session?.user.id as string,
    })

    const avatarUrl = source.replace('w_430', 'h_92,w_92')
    const { data } = await apiClient.put(url, {
      avatarUrl,
    })
    const sessionObj = {
      ...session,
      user: {
        ...session?.user,
        avatarUrl,
      },
    }
    await update(sessionObj)
    return data
  })

  const isLoading = status.state === 'loading'

  return (
    <div className="w-[92px] h-[92px] rounded-full border border-divider flex items-center justify-center relative overflow-hidden">
      <ProfileAvatar isLoading={isLoading} />

      <div className="absolute scale-125">
        <LoadingBar visible={isLoading} />
      </div>

      <input
        title="Change profile picture"
        onChange={async (e) => {
          if (e.target.files) {
            const file = e.target.files[0]
            await trigger({ file })
          }
        }}
        className="peer cursor-pointer absolute inset-0 w-full h-full opacity-0"
        type="file"
        accept="image/jpeg, image/png, image/gif"
      />
    </div>
  )
}
export function ProfileInformation() {
  const { data: session } = useSession()
  return (
    <>
      <div className="px-6 py-4 flex items-center gap-4">
        <ProfilePhoto />

        <p className="text-lg">{session?.user.displayName}</p>
      </div>

      <div className="mx-6 my-4 h-11 flex gap-2">
        <Following />
        <Followers />

        <Tooltip label="read.cv" side="top" sideOffset={6} tabIndex={-1}>
          <IconButton asChild>
            <a href="https://read.cv" target="_blank">
              <ReadIcon />
            </a>
          </IconButton>
        </Tooltip>

        <Tooltip label="Edit profile" side="top" asChild>
          <IconButton variant="filled">
            <PencilIcon />
          </IconButton>
        </Tooltip>
      </div>
    </>
  )
}
