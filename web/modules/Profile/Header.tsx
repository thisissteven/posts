import { usePathname, useRouter } from 'next/navigation'

import { useUser } from '@/hooks'

import { BackIcon } from '@/components/Icons'

import { HeaderContent } from './Me'
import { HeaderContent as OthersHeaderContent } from './Others'

export function Header() {
  const pathname = usePathname()

  const { isAuthenticated, user } = useUser()

  const isMe = isAuthenticated && pathname === `/${user.username}`

  const router = useRouter()

  return (
    <header className="bg-background sticky top-0 h-[61px]">
      <div className="relative w-full flex items-center gap-9 h-full px-6">
        <button
          onClick={() => router.back()}
          className="active:opacity-80 duration-200"
        >
          <BackIcon />
        </button>

        {isMe ? <HeaderContent /> : <OthersHeaderContent />}
      </div>
    </header>
  )
}
