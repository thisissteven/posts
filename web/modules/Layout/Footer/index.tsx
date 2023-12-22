import React from 'react'

import { FooterButton } from './FooterButton'
import { JobListings } from './JobListings'

export function Footer() {
  return (
    <>
      <style jsx>{`
        @media (max-width: 781px) {
          footer {
            display: none;
          }
        }
      `}</style>
      <footer className="hidden sticky h-screen top-0 xs:flex flex-col justify-between">
        <div className="p-6">
          <p className="text-sm leading-none mt-1">Posts</p>
          <span className="text-xs text-span text-light">
            A community app by{' '}
            <a
              className="hover:underline underline-offset-[3px]"
              href="https://read.cv/"
              target="_blank"
            >
              Read.cv
            </a>
          </span>
          <ul className="text-soft-primary mt-1 text-xs font-light flex gap-2">
            <li>
              <a
                className="hover:underline underline-offset-[3px]"
                href="https://posts.cv/about"
              >
                About
              </a>
            </li>
            <li>
              <a
                className="hover:underline underline-offset-[3px]"
                href="https://posts.cv/conduct"
              >
                Conduct
              </a>
            </li>
            <li>
              <a
                className="hover:underline underline-offset-[3px]"
                href="https://testflight.apple.com/join/OTiyTXl2"
              >
                Test Flight
              </a>
            </li>
          </ul>

          <FooterButton />
        </div>

        <JobListings />
      </footer>
    </>
  )
}
