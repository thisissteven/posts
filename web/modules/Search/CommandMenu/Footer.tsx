import clsx from 'clsx'
import React from 'react'
import { isMobile } from 'react-device-detect'

function EnterIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.146 10.354a.5.5 0 010-.708l2.5-2.5a.5.5 0 11.708.708L4.707 9.5H9.5c.337 0 .853-.105 1.27-.406.392-.282.73-.757.73-1.594v-4a.5.5 0 011 0v4c0 1.163-.496 1.938-1.145 2.406A3.292 3.292 0 019.5 10.5H4.707l1.647 1.646a.5.5 0 01-.708.708l-2.5-2.5z"
        fill="#888"
      ></path>
    </svg>
  )
}

function CommandIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7 6V5a2 2 0 10-2 2h1v2H5a2 2 0 102 2v-1h2v1a2 2 0 102-2h-1V7h1a2 2 0 10-2-2v1H7zM5 6a1 1 0 111-1v1H5zm2 1v2h2V7H7zm3-1h1a1 1 0 10-1-1v1zm0 4v1a1 1 0 101-1h-1zm-4 0H5a1 1 0 101 1v-1z"
        fill="#888"
      ></path>
    </svg>
  )
}

export function CommandMenuFooter() {
  return (
    <div className="absolute bottom-0 w-full bg-background border-t border-t-divider">
      <div
        className={clsx(
          'flex gap-4 justify-end px-3 py-1.5',
          isMobile && 'opacity-0'
        )}
      >
        <span className="flex items-center gap-1 text-span text-xs font-light tracking-wide">
          <EnterIcon />
          Open
        </span>
        <span className="flex items-center gap-1 text-span text-xs font-light tracking-wide">
          <span className="flex items-center">
            <CommandIcon />
            <EnterIcon />
          </span>
          Open in new tab
        </span>
      </div>
    </div>
  )
}
