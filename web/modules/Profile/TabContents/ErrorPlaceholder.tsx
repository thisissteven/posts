export function ErrorPlaceholder({ visible }: { visible: boolean }) {
  if (!visible) {
    return null
  }

  return (
    <div className="h-52 grid place-items-center">
      <p className="text-danger-soft">🚨 An error occurred. 🚨</p>
    </div>
  )
}
