import { usePathname, useRouter } from 'next/navigation'
import React from 'react'

import { BackIcon } from '@/components/Icons'

import { HeaderContent } from './Me'
import { HeaderContent as OthersHeaderContent } from './Others'
import { useAuth } from '../Auth'

export function Header() {
  const router = useRouter()
  const pathname = usePathname()

  const { isAuthenticated, session } = useAuth()

  return (
    <header className="bg-background sticky top-0 h-[61px]">
      <div className="flex items-center gap-9 h-full px-6">
        <button
          onClick={() => router.back()}
          className="active:opacity-80 duration-200"
        >
          <BackIcon />
        </button>

        {isAuthenticated &&
        session &&
        pathname === `/${session.user.username}` ? (
          <HeaderContent />
        ) : (
          <OthersHeaderContent />
        )}
      </div>
    </header>
  )
}
