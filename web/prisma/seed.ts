import { faker } from '@faker-js/faker'
import { Prisma, PrismaClient } from '@prisma/client'

import { AlgoliaUser, deleteAllUsers, saveManyUsers } from '../lib/algolia'
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
    const username = faker.internet
      .userName()
      .replace(/[_.\W]/g, '')
      .toLowerCase()

    const createdAt = faker.date.between({
      from: '2023-01-25',
      to: new Date(),
    })

    const data = {
      id: faker.string.uuid(),
      avatarUrl: Math.random() > 0.25 ? faker.image.avatarGitHub() : null,
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

  return users
}

function randomSource(width: number, height: number) {
  const random = Math.random()

  if (random < 0.2) {
    return faker.image.sports(width, height, true)
  }

  if (random < 0.4) {
    return faker.image.animals(width, height, true)
  }

  if (random < 0.6) {
    return faker.image.city(width, height, true)
  }

  if (random < 0.8) {
    return faker.image.nature(width, height, true)
  }

  return faker.image.transport(width, height, true)
}

function randomSourceData() {
  const random = Math.random()

  if (random > 0.6) {
    return {}
  }

  const width = faker.number.int({
    min: 640,
    max: 800,
  })
  const height = faker.number.int({
    min: 400,
    max: 540,
  })
  const source = randomSource(width, height)

  const alt = Math.random() > 0.7 ? faker.lorem.sentence() : null

  return {
    source,
    highResSource: source,
    width,
    height,
    mediaType: 'image',
    alt,
  } satisfies Partial<Prisma.ThreadCreateArgs['data']>
}

async function createUserPost(
  user: { id: string },
  randomUsers: Array<{ id: string }>
) {
  await prisma.thread.create({
    data: {
      id: faker.string.uuid(),
      ...randomSourceData(),
      textContent: faker.lorem.paragraph(),
      ownerId: user?.id as string,
      createdAt: faker.date.between({
        from: '2023-01-25',
        to: new Date(),
      }),
      updatedAt: faker.date.between({
        from: '2023-01-25',
        to: new Date(),
      }),
      likeCount: randomUsers.length,
      likes: {
        createMany: {
          data: randomUsers.map((user) => ({ userId: user.id })),
        },
      },
      repostCount: randomUsers.length,
      reposts: {
        createMany: {
          data: randomUsers.map((user) => ({ userId: user.id })),
        },
      },
    },
  })
}

async function createPosts(users: Array<{ id: string }>) {
  const postPromises = users.map(async (user) => {
    const numOfPosts = faker.number.int({
      min: 1,
      max: 5,
    })

    const randomNumber = faker.number.int({
      min: 1,
      max: 9,
    })

    const randomIndex = faker.number.int({
      min: 0,
      max: users.length - 10,
    })

    const randomUsers = users.slice(randomIndex, randomIndex + randomNumber)

    const userPostPromises = Array(numOfPosts)
      .fill(null)
      .map(async (_) => {
        await createUserPost(user, randomUsers)
      })

    await Promise.all(userPostPromises)
  })

  await Promise.all(postPromises)
}

async function main() {
  await dropDb()
  await deleteAllUsers()

  const users = await createUsers()

  await createPosts(users)
}

main()
