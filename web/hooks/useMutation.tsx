import { AxiosResponse } from 'axios'
import useSWRMutation from 'swr/mutation'

import { apiClient } from '@/lib'

export function useMutation<T>(
  key: string,
  mutatorFn?: <K = AxiosResponse>(url: string, data: T) => Promise<K>
) {
  const { trigger, ...rest } = useSWRMutation(
    key,
    async (
      url: string,
      data: {
        arg: T
      }
    ) => {
      const { arg } = data
      if (!mutatorFn) {
        const response = await apiClient.post(url, arg)
        return response
      } else {
        return await mutatorFn(url, arg)
      }
    }
  )

  return {
    trigger: trigger as <K = AxiosResponse>(data: T) => Promise<K>,
    ...rest,
  }
}
