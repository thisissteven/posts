import clsx from 'clsx'
import { usePathname } from 'next/navigation'
import useSWRImmutable from 'swr/immutable'

import { useWindowSize } from '@/hooks'

import {
  BookmarksIcon,
  BookmarksIconInactive,
  HomeIcon,
  HomeIconInactive,
  NewPost,
  NotificationIcon,
  NotificationIconInactive,
  RepliesIcon,
  RepliesIconInactive,
  Search,
} from '@/components/Icons'
import { Dialog, Tooltip } from '@/components/UI'

import { SearchCommandMenu } from '@/modules/Search'
import { NewThreadDialog } from '@/modules/ThreadForm'

import { BottomBanner } from './BottomBanner'
import { NavItem, ProfileNavItem } from './Navigation'

export function Sidebar() {
  const { width } = useWindowSize()

  const side = width < 522 ? 'top' : 'right'

  const pathname = usePathname()

  return (
    <aside
      className={clsx(
        'bg-background w-[calc(100%-var(--removed-body-scroll-bar-size))] xs:w-full',
        'xs:sticky xs:top-0 xs:py-4 xs:h-fit',
        'max-xs:h-[61px] max-xs:fixed max-xs:bottom-[calc(0px+env(safe-area-inset-bottom))] max-xs:border-t max-xs:border-t-divider'
      )}
    >
      <div className="relative w-full h-full">
        <BottomBanner />
        <ul
          className={clsx(
            'grid xs:grid-rows-7 place-items-center gap-8',
            'xs:ml-auto xs:w-[60px] xs:flex-col',
            'max-xs:h-full max-xs:px-4 max-xs:grid-cols-6'
          )}
        >
          <Tooltip label="Home" tabIndex={-1} side={side}>
            <NavItem href="/">
              {pathname === '/' ? <HomeIcon /> : <HomeIconInactive />}
            </NavItem>
          </Tooltip>

          <li className="h-7">
            <SearchCommandMenu showProfile={pathname !== '/[username]'}>
              <Tooltip label="Search ⌘K" asChild side={side}>
                <Dialog.Trigger asChild>
                  <button className=" active:opacity-80 rounded-md">
                    <Search />
                  </button>
                </Dialog.Trigger>
              </Tooltip>
            </SearchCommandMenu>
          </li>

          <Tooltip label="Notifications" tabIndex={-1} side={side}>
            <NavItem href="/notifications" needAuth>
              <NotificationStatus />
              {pathname === '/notifications' ? (
                <NotificationIcon />
              ) : (
                <NotificationIconInactive />
              )}
            </NavItem>
          </Tooltip>

          <Tooltip label="Replies" tabIndex={-1} side={side}>
            <NavItem href="/replies" needAuth>
              {pathname === '/replies' ? (
                <RepliesIcon />
              ) : (
                <RepliesIconInactive />
              )}
            </NavItem>
          </Tooltip>

          <Tooltip label="Bookmarks" tabIndex={-1} side={side}>
            <NavItem href="/bookmarks" needAuth>
              {pathname === '/bookmarks' ? (
                <BookmarksIcon />
              ) : (
                <BookmarksIconInactive />
              )}
            </NavItem>
          </Tooltip>

          <ProfileNavItem />

          <li className="max-xs:hidden xs:-translate-y-1">
            <Dialog canEscape={false} needAuth>
              <Tooltip label="New Post" asChild>
                <Dialog.Trigger asChild>
                  <button className="w-9 h-9 active:opacity-80 duration-200 bg-primary rounded-full grid place-items-center">
                    <NewPost />
                  </button>
                </Dialog.Trigger>
              </Tooltip>
              <Dialog.Content className="max-w-[480px]">
                <NewThreadDialog />
              </Dialog.Content>
            </Dialog>
          </li>
        </ul>
      </div>
    </aside>
  )
}

function NotificationStatus() {
  const { data } = useSWRImmutable('/notifications/status')

  const isUnread = data?.status === 'UNREAD'

  if (isUnread) {
    return (
      <div className="absolute top-0 right-0 w-1 h-1 rounded-full bg-danger-soft"></div>
    )
  }

  return null
}
