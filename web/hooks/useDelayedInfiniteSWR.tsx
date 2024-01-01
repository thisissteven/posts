import { BareFetcher } from 'swr'
import useSWRInfinite, { SWRInfiniteConfiguration } from 'swr/infinite'

import { apiClient } from '@/lib'

import { useFakeLoading } from '.'

const defaultFetcher = (url: string) =>
  apiClient.get(url).then((res) => res.data)

export function useDelayedInfiniteSWR<Data = unknown, Error = unknown>(
  key: string,
  config?: {
    duration?: number
    fetcher?: BareFetcher<Data>
    once?: boolean
    swrInfiniteConfig?: SWRInfiniteConfiguration<Data, Error, BareFetcher<Data>>
  }
) {
  const duration = config?.duration ?? 200
  const fetcher = config?.fetcher ?? defaultFetcher
  const once = config?.once ?? false

  const { data, isLoading, isValidating, setSize, ...rest } = useSWRInfinite(
    (index, previousPageData) => {
      const cursor = previousPageData?.cursor
      if (previousPageData && !cursor) return null

      if (index === 0) {
        return key
      }

      if (key.includes('category')) {
        return `${key}&cursor=${cursor}`
      }

      return `${key}?cursor=${cursor}`
    },
    async (url: string) => {
      const [data] = await Promise.all([
        fetcher(url),
        new Promise((resolve) => setTimeout(resolve, duration)),
      ])
      return data
    },
    config?.swrInfiniteConfig
  )

  const isEmpty = Boolean(data && data[0]?.data.length === 0)

  const loading = useFakeLoading(duration) || isLoading

  const isEnd = data && !data[data.length - 1].cursor

  const paginatedData: unknown[] = []
  if (data) {
    data.forEach((page) => {
      paginatedData.push(...page.data)
    })
  }

  return {
    data: paginatedData as Data | undefined,
    hasData: data !== undefined,
    isEmpty,
    isLoading: once ? isLoading : loading,
    isError: Boolean(rest.error),
    isValidating,
    isEnd,
    setSize,
    loadMore: () => {
      if (!isEnd && !isValidating) {
        setSize((size) => size + 1)
      }
    },
    ...rest,
  }
}
