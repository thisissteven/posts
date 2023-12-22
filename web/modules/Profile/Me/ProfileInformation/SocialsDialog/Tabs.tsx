import clsx from 'clsx'

import { useActiveTab } from './ActiveTabContext'

import { SOCIAL_TABS } from '@/types'

export function Tab() {
  const { activeTab, setActiveTab } = useActiveTab()
  return (
    <div>
      <div className="flex gap-5">
        {SOCIAL_TABS.map((tab) => {
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={clsx(
                'text-sm font-light tracking-wide duration-200',
                activeTab === tab ? 'text-primary' : 'text-span'
              )}
            >
              {tab}
            </button>
          )
        })}
      </div>
      <div className="relative w-full bg-soft-background h-[1.5px] rounded-full mt-3">
        <div
          className={clsx(
            'absolute left-0 top-0 w-[65px] duration-300 ease-in-out bg-primary h-[1.5px] rounded-full',
            activeTab === 'Following' ? 'translate-x-0' : 'translate-x-[86px]'
          )}
        ></div>
      </div>
    </div>
  )
}
