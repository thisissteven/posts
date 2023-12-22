import * as React from 'react'

import { SocialTab } from '@/types'

type ActiveTabContextValues = {
  activeTab: SocialTab
  setActiveTab: (type: SocialTab) => void
}

const ActiveTabContext = React.createContext({} as ActiveTabContextValues)

export function useActiveTab() {
  return React.useContext(ActiveTabContext)
}

export function ActiveTabProvider({
  children,
  type,
}: {
  children: React.ReactNode
  type: SocialTab
}) {
  const [activeTab, setActiveTab] = React.useState<SocialTab>(type)

  return (
    <ActiveTabContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </ActiveTabContext.Provider>
  )
}
