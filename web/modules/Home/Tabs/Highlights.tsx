import { faker } from '@faker-js/faker'
import { useRouter } from 'next/navigation'
import React from 'react'

import { Thread } from '..'

import { ThreadItem } from '@/types'

const media = [
  'https://res.cloudinary.com/read-cv/image/upload/c_limit,w_430/dpr_2.0/v1/1/users/m8wH2khfZXaKqZSynTuKnS8iDct1/post-c6526bd9-72e9-4db3-b758-f306858d5639.png?_a=ATO2BAA0',
  'https://res.cloudinary.com/read-cv/image/upload/c_limit,w_430/dpr_2.0/v1/1/users/LMGVb1BfppaBSOhcPE8xosRNHkt1/post-5f3610fb-e68d-4d43-ae95-b3cbeb20b6fa.png?_a=ATO2BAA0',
  'https://res.cloudinary.com/read-cv/image/upload/c_limit,w_430/dpr_2.0/v1/1/users/tOOn3TXt1lZ6duVtM5JQJbEhu4T2/post-41ed16b3-bfa9-45e9-9926-dc73359d4f3e.png?_a=ATO2BAA0',
  'https://res.cloudinary.com/read-cv/video/upload/t_v_p/v1/1/users/T9VME1PFRBbbQhR4QheF56OHoy73/post-8ffc4013-42bc-4250-87c7-a9c28a58bdda.mp4?_a=ATO2BAA0',
  'https://res.cloudinary.com/read-cv/video/upload/t_v_p/v1/1/users/eJL8Qq7GNngNoky1CwXsyNv0lIg2/post-1fef42ed-6de7-4d38-a7d7-1d18ce4aa109.mp4?_a=ATO2BAA0',
  'https://res.cloudinary.com/read-cv/image/upload/c_limit,w_430/dpr_2.0/v1/1/users/Ml1HAeeALYcyQwnPuYxofhShpDx2/post-cfba665f-69f1-4a0d-9438-bbec32c6e0a5.jpg?_a=ATO2BAA0',
  'https://res.cloudinary.com/read-cv/image/upload/c_limit,w_430/dpr_2.0/v1/1/users/0ylioqw4ofZ2z2wfrfsygGETRk72/post-acc4d4f2-3bae-46ea-bb04-c4150daa55c2.jpg?_a=ATO2BAA0',
  'https://res.cloudinary.com/read-cv/image/upload/c_limit,w_430/dpr_2.0/v1/1/users/pl3D0fbvxDXvBwZeQ2ThO4G1igh2/post-c614fe56-5be3-4698-8ac2-d8195609a491.jpg?_a=ATO2BAA0',
]

const threadItems = new Array(8).fill(0).map(
  (_, i) =>
    ({
      id: faker.string.alphanumeric(10),
      threadUser: {
        username: faker.internet.userName(),
        displayName: faker.person.firstName(),
        avatarUrl: faker.image.avatar(),
        isSupporter: Math.random() > 0.8,
      },
      isOwnThread: Math.random() > 0.7,
      lastActivity: faker.date.recent({
        days: 1,
      }),
      likesCount: faker.number.int({ min: 0, max: 100 }),
      repliesCount: faker.number.int({ min: 0, max: 100 }),
      repostsCount: faker.number.int({ min: 0, max: 100 }),
      threadContent: {
        textContent: faker.lorem.sentence({
          min: 5,
          max: 25,
        }),
        mediaType: media[i].includes('mp4') ? 'video' : 'image',
        mediaSource: media[i],
        highResMediaSource: media[i].replace('w_430', 'h_2048,w_2048'),
      },
    }) satisfies ThreadItem
)

export function Highlights() {
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 300)
  }, [])

  const router = useRouter()

  return (
    <div className="relative">
      {/* <TabLoader visible={loading} /> */}

      <div className="divide-y divide-divider">
        {threadItems.map((thread, i) => (
          <Thread
            key={i}
            onClick={() => router.push(`${'username'}/${123}`)}
            thread={thread}
          />
        ))}
      </div>
    </div>
  )
}
