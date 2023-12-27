import Link from 'next/link'
import { useParams } from 'next/navigation'

import { cn } from '@/lib'
import { useUser, useWindowSize } from '@/hooks'

import { SidebarAvatar, Tooltip } from '@/components/UI'

import { useAuth } from '@/modules/Auth'

type URLS = '/' | '/notifications' | '/bookmarks' | '/replies'
type AvailableUrls = URLS | Omit<URLS, string>

export function NavItem({
  href,
  children,
  className,
  needAuth,
}: {
  href: AvailableUrls
  children: React.ReactNode
  className?: string
  needAuth?: boolean
}) {
  const { openAuthDialog, isAuthenticated } = useAuth()

  return (
    <li className={cn('h-[28px] shrink-0', className)}>
      <Link
        scroll={false}
        onClick={(e) => {
          if (needAuth && !isAuthenticated) {
            e.preventDefault()
            openAuthDialog()
          }
        }}
        className="active:opacity-80 rounded-md inline-block"
        href={href as string}
      >
        {children}
      </Link>
    </li>
  )
}

export function ProfileNavItem() {
  const { width } = useWindowSize()
  const side = width < 522 ? 'top' : 'right'

  const params = useParams()

  const {
    isAuthenticated,
    user: { username },
  } = useUser()
  const isProfilePage =
    params &&
    params['username'] &&
    params['username'] === username &&
    !params['thread-id']

  if (!isAuthenticated) return null

  return (
    <Tooltip label="Profile" tabIndex={-1} side={side}>
      <div className="xs:-translate-y-0.5">
        <NavItem href={`/${username}`} className="max-xs:h-[32px]">
          <div
            className={cn(
              'w-6 h-6 flex items-center justify-center m-1 active:opacity-80 rounded-full overflow-hidden bg-black',
              isProfilePage &&
                'ring-2 ring-offset-2 ring-offset-background ring-primary duration-200'
            )}
          >
            <SidebarAvatar />
          </div>
        </NavItem>
      </div>
    </Tooltip>
  )
}
