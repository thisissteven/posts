import { useSession } from 'next-auth/react'

import { apiClient, uploadImage } from '@/lib'
import { useMutation } from '@/hooks'

import { ProfileAvatar, RegularButton, TabLoader } from '@/components/UI'

export function EditProfilePhoto({
  withRemoveImage = false,
}: {
  withRemoveImage?: boolean
}) {
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
    <>
      <div className="w-[92px] h-[92px] rounded-full border border-divider flex items-center justify-center relative overflow-hidden">
        <ProfileAvatar isLoading={isLoading} />

        <div className="absolute scale-125">
          <TabLoader offset={-8} visible={isLoading} />
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
      {withRemoveImage && (
        <RegularButton
          disabled={!session?.user?.avatarUrl}
          className="disabled:bg-soft-background disabled:opacity-60"
          onClick={async () => {
            await apiClient.put('/profile/change-avatar', {
              avatarUrl: null,
            })
            const sessionObj = {
              ...session,
              user: {
                ...session?.user,
                avatarUrl: null,
              },
            }
            await update(sessionObj)
          }}
          variant="secondary"
        >
          Remove Image
        </RegularButton>
      )}
    </>
  )
}
