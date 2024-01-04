import algoliasearch from 'algoliasearch'

export const algoliaSearchClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID as string,
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY as string
)

export const searchUser = async (keyword: string, page: number = 0) => {
  const index = algoliaSearchClient.initIndex('users')

  const searchResult = await index.search(keyword, {
    page,
    hitsPerPage: 100,
  })

  return searchResult.hits
}

export const getRecentlyJoined = async () => {
  const index = algoliaSearchClient.initIndex('users_createdAt_desc')

  const searchResult = await index.search('', {
    page: 0,
    hitsPerPage: 30,
    attributesToHighlight: [],
    attributesToRetrieve: [
      'avatarUrl',
      'createdAt',
      'displayName',
      'username',
      'bio',
      'timestamp',
      'objectID',
      'id',
    ],
  })

  return searchResult.hits
}
