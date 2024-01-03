import Link from 'next/link'
import { useRouter } from 'next/navigation'
import useSWRImmutable from 'swr/immutable'

import { BackIcon } from '@/components/Icons'
import { ThreadUserAvatar } from '@/components/UI'

import { UserPopover } from '@/modules/Profile'
import { FindUserResponse } from '@/pages/api/profile/[username]'

export function DetailHeader({ from }: { from?: string | null }) {
  const { data: chattingWith } = useSWRImmutable<FindUserResponse>(() =>
    from ? `/profile/${from}` : null
  )

  const router = useRouter()

  return (
    <header className="bg-background sticky top-0 h-[61px] border-b border-b-popover">
      <div className="flex items-center gap-9 h-full px-6">
        <button
          onClick={() => router.back()}
          className="active:opacity-80 duration-200"
        >
          <BackIcon />
        </button>

        {chattingWith && (
          <div className="flex items-center gap-4">
            <ThreadUserAvatar
              defaultStyle={{
                transform: 'scale(0.8)',
                transformOrigin: 'left',
              }}
              style={{
                width: 40,
                height: 40,
              }}
              threadUser={{
                username: chattingWith?.username ?? '',
                avatarUrl: chattingWith?.avatarUrl,
              }}
            />
            <Link
              href={`/${from}`}
              className="hover:underline underline-offset-[3px] text-sm font-light"
            >
              {from}
            </Link>
          </div>
        )}

        <UserPopover user={chattingWith} />
      </div>
    </header>
  )
}
