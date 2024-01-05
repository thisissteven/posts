import { faker } from '@faker-js/faker'
import { Prisma, PrismaClient } from '@prisma/client'

import { AlgoliaUser, saveManyUsers } from '../lib/algolia'
import { FindUserResponse } from '../pages/api/profile/[username]'

const prisma = new PrismaClient()

function getDescription(user?: FindUserResponse) {
  const pronounOnly = user?.pronouns && !user?.profession && !user?.location
  const professionOnly = user?.profession && !user?.location && !user?.pronouns
  const locationOnly = user?.location && !user?.profession && !user?.pronouns

  const pronounAndProfession =
    user?.pronouns && user?.profession && !user?.location
  const professionAndLocation =
    user?.profession && user?.location && !user?.pronouns

  const nothing = !user?.profession && !user?.location && !user?.pronouns

  if (nothing) {
    return ''
  }

  if (professionOnly) {
    return user?.profession
  }

  if (locationOnly) {
    return user?.location
  }

  if (pronounOnly) {
    return user?.pronouns
  }

  if (professionAndLocation) {
    return `${user?.profession} in ${user?.location}`
  }

  if (pronounAndProfession) {
    return `${user?.profession}, ${user?.pronouns}`
  }

  return `${user?.profession} in ${user?.location}, ${user?.pronouns}`
}

async function dropDb() {
  await prisma.user.deleteMany()
}

async function createUsers() {
  const profiles = new Array(100).fill(0).map((_) => {
    const displayName = faker.person.fullName()
    const username = faker.internet.userName()

    const createdAt = faker.date.between({
      from: '2023-01-25',
      to: '2023-12-25',
    })

    const data = {
      id: faker.string.uuid(),
      avatarUrl:
        Math.random() > 0.25
          ? `https://picsum.photos/36/36/?random=${faker.number.int({
              max: 1000,
            })}`
          : null,
      displayName,
      username,
      location: Math.random() > 0.25 ? faker.location.city() : null,
      profession: Math.random() > 0.25 ? faker.person.jobTitle() : null,
      createdAt: createdAt,
      email: faker.internet.email(),
    } satisfies Prisma.UserCreateArgs['data']
    return data
  })

  await prisma.user.createMany({
    data: profiles,
  })

  const users = profiles.map((profile) => {
    return {
      ...profile,
      timestamp: Math.floor(profile.createdAt.getTime() / 1000),
      bio: getDescription(profile as unknown as FindUserResponse),
    }
  })

  await saveManyUsers(users as unknown as AlgoliaUser[])
}

async function main() {
  await dropDb()
  await createUsers()
}

main()
