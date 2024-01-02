import clsx from 'clsx'
import React from 'react'

export default function RefreshPostsButton({
  onClick,
  showButton,
}: {
  onClick: () => void
  showButton: boolean
}) {
  return (
    <div
      aria-hidden={!showButton}
      className={clsx(
        'sticky z-50 flex justify-center top-16 h-0 transition',
        showButton
          ? 'opacity-100 translate-y-0'
          : '-translate-y-8 opacity-0 pointer-events-none'
      )}
    >
      <div className="flex items-center bg-soft-background mt-5 px-4 py-2 h-10 rounded-full shadow text-sm">
        <button onClick={onClick}>New posts</button>
      </div>
    </div>
  )
}
