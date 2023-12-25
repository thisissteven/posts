import { usePathname } from 'next/navigation'

import { ThreadListTemplate } from '@/modules/Thread'

export function Posts() {
  const pathname = usePathname()

  const username = pathname?.split('/')[1]

  return <ThreadListTemplate url={`/threads/${username}`} />
}
