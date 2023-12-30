import useSWRImmutable from 'swr/immutable'

import { OpenGraphData } from '@/lib'

export function useOpenGraphData(url?: string) {
  const { data, ...rest } = useSWRImmutable<OpenGraphData>(() =>
    url ? `/og?url=${url}` : null
  )

  return { data, ...rest }
}
