// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { faker } from '@faker-js/faker'
import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const profiles = new Array(1000).fill(0).map((_) => {
    const displayName = faker.person.fullName()
    const username = `@${displayName.split(' ')[0].toLowerCase()}`

    const createdAt = faker.date.between({
      from: '2023-01-25',
      to: '2023-12-25',
    })
    const data = {
      avatarUrl:
        Math.random() > 0.25
          ? `https://picsum.photos/36/36/?random=${faker.number.int({
              max: 1000,
            })}`
          : null,
      displayName,
      username,
      bio: Math.random() > 0.25 ? faker.lorem.sentence() : null,
      createdAt: createdAt,
      timestamp: Math.floor(createdAt.getTime() / 1000),
    }
    return data
  })

  res.status(200).json(profiles)
}
