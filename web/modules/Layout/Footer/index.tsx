import React from 'react'

import { Github } from '@/components/Icons'
import { LinkButton } from '@/components/UI'

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

          <LinkButton
            variant="filled"
            href="https://github.com/thisissteven/posts"
            className="flex items-center justify-center gap-2 text-sm mt-2"
          >
            <Github className="w-5 h-fit" /> View github source
          </LinkButton>
        </div>

        <JobListings />
      </footer>
    </>
  )
}
