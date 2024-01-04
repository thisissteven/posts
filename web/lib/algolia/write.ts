import algoliasearch from 'algoliasearch'

export const algoliaClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID as string,
  process.env.ALGOLIA_WRITE_API_KEY as string
)

export const saveUser = async (user: {
  username: string
  id: string
  displayName: string
  bio: string | null
}) => {
  const index = algoliaClient.initIndex('users')
  const record = {
    objectID: user.id,
    ...user,
  }

  await index.saveObject(record)
}

export const updateUser = async (user: {
  username: string
  id: string
  displayName: string
  bio: string | null
}) => {
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
