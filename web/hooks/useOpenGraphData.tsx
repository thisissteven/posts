import useSWRImmutable from 'swr/immutable'

import { apiClient, getHref, isWebsite, OpenGraphData } from '@/lib'

import { useDebounce } from './useDebounce'

export function useOpenGraphData(textContent?: string) {
  const lines = textContent?.split('\n') ?? []
  const hasLines = lines.length > 0

  const lastLineIndex = lines.length - 1

  const textToCheck = hasLines ? lines[lastLineIndex] : textContent

  const url = getHref(textToCheck?.split(' ').find(isWebsite))

  const secureUrl = useDebounce(url, 500)

  const { data, ...rest } = useSWRImmutable<OpenGraphData>(
    () => (secureUrl ? `/og?url=${secureUrl}` : null),
    async (url) => {
      const response = await apiClient.get(url)
      return response.data
    },
    {
      keepPreviousData: true,
    }
  )

  return { data, ...rest, secureUrl, key: `/og?url=${secureUrl}` }
}
