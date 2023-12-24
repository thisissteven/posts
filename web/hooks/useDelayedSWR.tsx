import useSWR, { BareFetcher, SWRConfiguration } from 'swr'

import { apiClient } from '@/lib'

import { useFakeLoading } from '.'

const defaultFetcher = (url: string) =>
  apiClient.get(url).then((res) => res.data)

export function useDelayedSWR<Data = unknown, Error = unknown>(
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

  const { data, isLoading, ...rest } = useSWR(key, async (url: string) => {
    const [data] = await Promise.all([
      fetcher(url),
      new Promise((resolve) => setTimeout(resolve, duration)),
    ])
    return data
  })

  const isEmpty = data?.length === 0

  const loading = useFakeLoading() || isLoading

  return {
    data: data as Data | undefined,
    hasData: data !== undefined,
    isEmpty,
    isLoading: once ? isLoading : loading,
    isError: Boolean(rest.error),
    ...rest,
  }
}
