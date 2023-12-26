import Link from 'next/link'
import React from 'react'

import { BackIcon } from '@/components/Icons'

export function Header() {
  return (
    <header className="bg-background sticky top-0 h-[61px]">
      <div className="flex items-center gap-9 h-full px-6">
        <Link href="/" className="active:opacity-80 duration-200">
          <BackIcon />
        </Link>
        <h1 className="text-sm font-light">Thread</h1>
      </div>
    </header>
  )
}
