import { AxiosResponse } from 'axios'
import React from 'react'
import useSWRMutation from 'swr/mutation'

import { apiClient } from '@/lib'

import { swrObserver } from './state'

export function useMutation<T>(
  key: string,
  mutatorFn?: <K = AxiosResponse>(url: string, data: T) => Promise<K>
) {
  const [isLoading, setIsLoading] = React.useState(false)

  const { trigger, ...rest } = useSWRMutation(
    key,
    async (
      url: string,
      data: {
        arg: T
      }
    ) => {
      const { arg } = data
      try {
        swrObserver.setLoadingState(key, true)
        if (!mutatorFn) {
          const response = await apiClient.post(url, arg)
          return response
        } else {
          return await mutatorFn(url, arg)
        }
      } finally {
        swrObserver.setLoadingState(key, false)
      }
    }
  )

  React.useEffect(() => {
    const unsubscribe = swrObserver.subscribe(key, (observerIsLoading) => {
      setIsLoading(observerIsLoading)
    })

    return () => {
      unsubscribe()
    }
  }, [key])

  return {
    trigger,
    isLoading,
    ...rest,
  }
}

// export function useMutation<T>(
//   key: string,
//   mutatorFn?: <K = AxiosResponse>(url: string, data: T) => Promise<K>
// ) {
//   const { trigger, ...rest } = useSWRMutation(
//     key,
//     async (
//       url: string,
//       data: {
//         arg: T
//       }
//     ) => {
//       const { arg } = data
//       if (!mutatorFn) {
//         const response = await apiClient.post(url, arg)
//         return response
//       } else {
//         return await mutatorFn(url, arg)
//       }
//     }
//   )

//   return {
//     trigger: trigger as <K = AxiosResponse>(data: T) => Promise<K>,
//     ...rest,
//   }
// }
