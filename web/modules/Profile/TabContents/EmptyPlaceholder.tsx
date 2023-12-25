export function EmptyPlaceholder({ visible }: { visible: boolean }) {
  if (!visible) {
    return null
  }

  return (
    <div className="h-52 grid place-items-center">
      <p className="text-span">No posts yet 🍃</p>
    </div>
  )
}
