// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { faker } from '@faker-js/faker'
import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const profiles = new Array(100).fill(0).map((_) => {
    const displayName = faker.person.fullName()
    const username = `@${displayName.split(' ')[0].toLowerCase()}`
    const data = {
      avatar: `https://picsum.photos/36/36/?random=${faker.number.int({
        max: 1000,
      })}`,
      displayName,
      username,
      description: Math.random() > 0.6 ? faker.lorem.sentence() : username,
      alt: faker.string.alpha({ length: 2, casing: 'upper' }),
    }
    return data
  })

  res.status(200).json(profiles)
}
