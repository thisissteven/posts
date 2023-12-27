import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

import { useUser } from '@/hooks'

import { BackIcon } from '@/components/Icons'

import { HeaderContent } from './Me'
import { HeaderContent as OthersHeaderContent } from './Others'

export function Header() {
  const pathname = usePathname()

  const { isAuthenticated, user } = useUser()

  const isMe = isAuthenticated && pathname === `/${user.username}`

  return (
    <header className="bg-background sticky top-0 h-[61px]">
      <div className="relative w-full flex items-center gap-9 h-full px-6">
        <Link
          scroll={false}
          href="/"
          className="active:opacity-80 duration-200"
        >
          <BackIcon />
        </Link>

        {isMe ? <HeaderContent /> : <OthersHeaderContent />}
      </div>
    </header>
  )
}
