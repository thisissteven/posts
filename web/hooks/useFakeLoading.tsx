import * as React from 'react'

export function useFakeLoading(ms: number = 200) {
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, ms)
  }, [ms])

  return loading
}
