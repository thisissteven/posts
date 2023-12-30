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
  },
  options?: {
    mutatedBy?: string
  }
) {
  const [status, setStatus] = React.useState<MutationState>({
    state: 'idle',
  })

  const { trigger, data, error, reset } = useSWRMutation(
    key,
    async (
      url: string,
      data: {
        arg: T
      }
    ) => {
      try {
        swrObserver.setMutationState(key, {
          state: 'loading',
          mutatedBy: options?.mutatedBy,
        })
        const response = await mutatorFn(url, data.arg)
        swrObserver.setMutationState(key, {
          state: 'success',
          mutatedBy: options?.mutatedBy,
        })
        return response
      } catch (error) {
        swrObserver.setMutationState(key, {
          state: 'error',
          mutatedBy: options?.mutatedBy,
        })
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
    isMutating: status.state === 'loading',
    reset: () => {
      reset()
      swrObserver.setMutationState(key, {
        state: 'idle',
        mutatedBy: options?.mutatedBy,
      })
    },
  }
}
