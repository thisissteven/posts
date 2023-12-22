import React from 'react'

export function CommandMenuHeader({
  children,
  scrolled,
}: {
  children: React.ReactNode
  scrolled: boolean
}) {
  return (
    <div
      data-list-scrolled={scrolled}
      className="sticky top-0 w-full bg-background duration-300 border-b-[1.5px] border-b-transparent data-[list-scrolled=true]:border-b-divider"
    >
      {children}
    </div>
  )
}
