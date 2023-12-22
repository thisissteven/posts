import Head from 'next/head'
import Link from 'next/link'
import React from 'react'

import { Header } from '@/modules/Replies'

function ChatItem() {
  return (
    <li>
      <Link
        href="/replies/123"
        className="flex gap-3 px-6 py-3 items-center hover:bg-soft-background active:bg-soft-background"
      >
        <div className="w-12 h-12 rounded-full bg-emerald-700"></div>
        <div className="flex-1">
          <p className="text-sm leading-4">steven</p>
          <span className="text-sm font-light text-span overflow-hidden flex gap-1">
            <span>You:</span>
            <span className="line-clamp-1">
              Lorem ipsum dolor sit, amet consectetur adipisicing elit.
              Laboriosam dolores consequuntur inventore ad fugit quos tempora
              iure ducimus tenetur. Dignissimos unde dolore expedita ullam
              accusantium enim consequuntur libero neque recusandae.
            </span>
          </span>
        </div>
        <span className="text-span text-xs self-start mt-2 font-light tracking-wide">
          16m
        </span>
      </Link>
    </li>
  )
}

export default function Replies() {
  return (
    <>
      <Head>
        <title>Replies</title>
      </Head>
      <Header />

      <ul>
        <ChatItem />
        <ChatItem />
        <ChatItem />
        <ChatItem />
        <ChatItem />
        <ChatItem />
        <ChatItem />
        <ChatItem />
        <ChatItem />
        <ChatItem />
      </ul>
    </>
  )
}
