import { usePathname } from 'next/navigation'

import { ThreadListTemplate } from '@/modules/Thread'

export function Replies() {
  const pathname = usePathname()

  const username = pathname?.split('/')[1]

  return <ThreadListTemplate url={`/profile/${username}/threads/replies`} />
}
