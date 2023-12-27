import { useRouter } from 'next/navigation'

import { BackIcon } from '@/components/Icons'

export function Header() {
  const router = useRouter()
  return (
    <header className="bg-background sticky top-0 h-[61px]">
      <div className="flex items-center gap-9 h-full px-6">
        <button
          onClick={() => router.back()}
          className="active:opacity-80 duration-200"
        >
          <BackIcon />
        </button>
        <h1 className="text-sm font-light">Thread</h1>
      </div>
    </header>
  )
}
