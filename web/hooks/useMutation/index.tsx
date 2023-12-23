import { AxiosResponse } from 'axios'
import React from 'react'
import useSWRMutation from 'swr/mutation'

import { apiClient } from '@/lib'

import { MutationState, swrObserver } from './state'

export function useMutation<T>(
  key: string,
  mutatorFn: (url: string, payload: T) => Promise<AxiosResponse> = async (
    url,
    payload
  ) => {
    return await apiClient.post(url, payload)
  }
) {
  const [status, setStatus] = React.useState<MutationState>('idle')

  const { trigger, data, error, reset } = useSWRMutation(
    key,
    async (
      url: string,
      data: {
        arg: T
      }
    ) => {
      try {
        swrObserver.setMutationState(key, 'loading')
        const response = await mutatorFn(url, data.arg)
        swrObserver.setMutationState(key, 'success')
        return response
      } catch (error) {
        swrObserver.setMutationState(key, 'error')
        throw error
      }
    }
  )

  React.useEffect(() => {
    const unsubscribe = swrObserver.subscribe(key, (mutationState) => {
      setStatus(mutationState)
    })

    return () => {
      unsubscribe()
    }
  }, [key])

  return {
    trigger,
    status,
    data,
    error,
    reset: () => {
      reset()
      swrObserver.setMutationState(key, 'idle')
    },
  }
}
