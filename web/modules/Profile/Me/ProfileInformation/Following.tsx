import useSWR from 'swr'

import { FollowList } from '@/lib'

import { Dialog } from '@/components/UI'

import { SocialsDialogContent } from './SocialsDialog'

export function Following() {
  const { data } = useSWR<FollowList>('/profile/following')

  return (
    <Dialog>
      <Dialog.Trigger asChild>
        <button className="tracking-wide active:opacity-80 duration-200 rounded-full bg-soft-background flex-1 h-full relative">
          <div className="whitespace-nowrap text-ellipsis overflow-hidden absolute inset-0 w-full top-1/2 -translate-y-1/2 px-4 text-sm font-light text-center">
            {data?.list?.length} following
          </div>
        </button>
      </Dialog.Trigger>
      <SocialsDialogContent type="Following" />
    </Dialog>
  )
}
