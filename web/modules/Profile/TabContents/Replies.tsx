import { usePathname } from 'next/navigation'

import { ThreadListTemplate } from '@/modules/Thread'

import { useHasBlock } from './useHasBlock'

export function Replies() {
  const pathname = usePathname()

  const username = pathname?.split('/')[1]

  return useHasBlock(() => {
    return <ThreadListTemplate url={`/profile/${username}/threads/replies`} />
  })
}
