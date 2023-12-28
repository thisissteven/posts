export function SettingGroup({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle?: string
  children: React.ReactNode
}) {
  return (
    <div className="flex justify-between items-center mt-5">
      <div className="space-y-1">
        <div className="text-sm">{title}</div>
        <div className="text-span text-sm">{subtitle}</div>
      </div>
      {children}
    </div>
  )
}
