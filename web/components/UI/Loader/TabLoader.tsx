import clsx from 'clsx'

import { LoadingBar } from './LoadingBar'
import { Overlay } from './Overlay'

export function TabLoader({
  visible,
  overlayOnly = false,
}: {
  visible: boolean
  overlayOnly?: boolean
}) {
  return (
    <>
      <Overlay visible={visible} />
      {!overlayOnly && (
        <div
          className={clsx(
            `absolute z-10 left-1/2 -translate-x-1/2 top-8`,
            visible ? 'opacity-100' : 'opacity-0 pointer-events-none'
          )}
          aria-hidden={!visible}
        >
          <LoadingBar visible={visible} />
        </div>
      )}
    </>
  )
}
