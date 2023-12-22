import React from 'react'

export default function useDragToScroll() {
  const ref = React.useRef() as React.MutableRefObject<HTMLDivElement>
  const [isDragging, setIsDragging] = React.useState(false)

  const onMouseDown = () => {
    setIsDragging(true)
  }

  const onMouseUp = () => {
    setIsDragging(false)
  }

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return

    const container = ref.current.getBoundingClientRect()

    if (
      e.clientX >= container.left &&
      e.clientX <= container.right &&
      e.clientY >= container.top &&
      e.clientY <= container.bottom
    ) {
      ref.current.scrollLeft -= e.movementX
    }
  }

  return { ref, onMouseDown, onMouseUp, onMouseMove }
}
