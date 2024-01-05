import algoliasearch from 'algoliasearch'

export const algoliaClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID as string,
  process.env.ALGOLIA_WRITE_API_KEY as string
)

export type AlgoliaUser = {
  username: string
  id: string
  displayName: string
  bio: string | null
  avatarUrl: string | null
  createdAt: Date
  timestamp: number
}

export const saveManyUsers = async (users: AlgoliaUser[]) => {
  try {
    const index = algoliaClient.initIndex('users')
    const records = users.map((user) => {
      return {
        objectID: user.id,
        ...user,
      }
    })

    await index.saveObjects(records)
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err)
  }
}

export const saveUser = async (user: AlgoliaUser) => {
  const index = algoliaClient.initIndex('users')
  const record = {
    objectID: user.id,
    ...user,
  }

  await index.saveObject(record)
}

export const updateUser = async (user: Partial<AlgoliaUser>) => {
  const index = algoliaClient.initIndex('users')

  await index.partialUpdateObject({
    objectID: user.id,
    ...user,
  })
}

export const deleteUser = async (id: string) => {
  const index = algoliaClient.initIndex('users')

  await index.deleteObject(id)
}
