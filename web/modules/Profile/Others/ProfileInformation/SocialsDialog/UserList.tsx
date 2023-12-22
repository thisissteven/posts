import { faker } from '@faker-js/faker'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import useSWR from 'swr'

import { RegularButton } from '@/components/UI'

import { useActiveTab } from './ActiveTabContext'
import { CrossFade } from './CrossFade'
import { EmptyPlaceholder } from './EmptyPlaceholder'

faker.seed(123)

const followingData = new Array(12).fill(null).map(() => {
  const displayName = faker.person.fullName()
  const username = `${displayName.split(' ')[0].toLowerCase()}${displayName
    .split(' ')[1]
    .toLowerCase()}`
  return {
    id: faker.string.uuid(),
    username,
    displayName,
    avatar: faker.internet.avatar(),
  }
})

faker.seed(321)

const followersData = new Array(5).fill(null).map(() => {
  const displayName = faker.person.fullName()
  const username = `${displayName.split(' ')[0].toLowerCase()}`
  return {
    id: faker.string.uuid(),
    username,
    displayName,
    avatar: faker.internet.avatar(),
  }
})

function UserListContent({
  data,
}: {
  data: {
    id: string
    username: string
    displayName: string
    avatar: string
  }[]
}) {
  return (
    <div className="space-y-2 py-4">
      {data.map((data) => {
        return (
          <div
            key={data.id}
            className="flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3">
              <div className="shrink-0 rounded-full overflow-hidden">
                <Image
                  src={data.avatar}
                  width={48}
                  height={48}
                  alt={data.username}
                />
              </div>
              <div>
                <Link
                  href={`/${data.username}`}
                  className="text-sm font-light tracking-wide hover:underline underline-offset-[3px] line-clamp-1"
                >
                  {data.displayName}
                </Link>
                <Link
                  href={`/${data.username}`}
                  className="text-xs font-light tracking-wide text-span hover:underline underline-offset-[3px] line-clamp-1"
                >
                  @{data.username}
                </Link>
              </div>
            </div>

            <div className="shrink-0">
              <RegularButton variant="secondary" className="px-4">
                Following
              </RegularButton>
              {/* <RegularButton className="px-4">Follow</RegularButton> */}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export function UserList() {
  const { activeTab } = useActiveTab()
  const { data: _ } = useSWR(`/api/socials/${activeTab}`)

  const currentIndex = activeTab === 'Following' ? 0 : 1

  const data = activeTab === 'Following' ? followingData : []
  const content =
    data.length === 0 ? (
      <EmptyPlaceholder type={activeTab} />
    ) : (
      <UserListContent data={data} />
    )

  return (
    <>
      <CrossFade
        contentA={content}
        contentB={content}
        currentIndex={currentIndex}
      />
    </>
  )
}
