import * as React from 'react'

export function useFakeLoading(ms: number) {
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, ms)
  }, [ms])

  return loading
}
