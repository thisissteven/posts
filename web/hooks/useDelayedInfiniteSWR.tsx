import { BareFetcher, SWRConfiguration } from 'swr'
import useSWRInfinite from 'swr/infinite'

import { apiClient } from '@/lib'

import { useFakeLoading } from '.'

const defaultFetcher = (url: string) =>
  apiClient.get(url).then((res) => res.data)

export function useDelayedInfiniteSWR<Data = unknown, Error = unknown>(
  key: string,
  config?: SWRConfiguration<Data, Error, BareFetcher<Data>> & {
    duration?: number
    fetcher?: BareFetcher<Data>
    once?: boolean
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

      return `${key}&cursor=${cursor}`
    },
    async (url: string) => {
      const [data] = await Promise.all([
        fetcher(url),
        new Promise((resolve) => setTimeout(resolve, duration)),
      ])
      return data
    }
  )

  const isEmpty = data?.length === 0

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
