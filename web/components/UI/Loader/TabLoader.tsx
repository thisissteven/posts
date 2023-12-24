import { LoadingBar } from './LoadingBar'
import { Overlay } from './Overlay'

export function TabLoader({ visible }: { visible: boolean }) {
  return (
    <>
      <Overlay visible={visible} />
      <div
        className="absolute z-10 left-1/2 -translate-x-1/2 top-8 pointer-events-none"
        aria-hidden={!visible}
      >
        <LoadingBar visible={visible} />
      </div>
    </>
  )
}
