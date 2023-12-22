import React from 'react'

import { useAuth } from '@/modules/Auth'

import { HomeTab } from '@/types'

const getTabFromLocalStorage = (isAuthenticated: boolean) => {
  const lastOpenedTab = localStorage.getItem('lastOpenedTab') as HomeTab | null
  if (!isAuthenticated && lastOpenedTab === 'Following') {
    localStorage.removeItem('lastOpenedTab')
    return 'Highlights'
  }
  return lastOpenedTab || 'Highlights'
}

export function useLastOpenedTab() {
  const [activeTab, setActiveTab] = React.useState<HomeTab | null>(null)
  const { isAuthenticated } = useAuth()

  React.useEffect(() => {
    const storedTab = getTabFromLocalStorage(isAuthenticated)
    setActiveTab(storedTab)
  }, [activeTab, isAuthenticated])

  return {
    activeTab,
    setActiveTab: (tab: HomeTab) => {
      localStorage.setItem('lastOpenedTab', tab)
      setActiveTab(tab)
    },
  }
}
