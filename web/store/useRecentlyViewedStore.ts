import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { CommandMenuItemProps } from '@/types'

interface StoreState {
  recentlyViewed: CommandMenuItemProps[] | null
  updateRecentlyViewed: (user: CommandMenuItemProps) => void
  clearRecentlyViewed: () => void
}

const useRecentlyViewedStore = create<StoreState>()(
  persist(
    (set) => ({
      recentlyViewed: null,
      updateRecentlyViewed: (user) =>
        set(({ recentlyViewed }) => {
          if (!recentlyViewed) {
            return {
              recentlyViewed: [user],
            }
          }

          // check if currentUser is the last viewed
          if (recentlyViewed[recentlyViewed.length - 1].id === user.id) {
            return {
              recentlyViewed,
            }
          }

          let currentRecentlyViewed = recentlyViewed.filter(
            (currentUser) => currentUser.id !== user.id
          )
          currentRecentlyViewed = [user, ...currentRecentlyViewed].slice(0, 3)

          return {
            recentlyViewed: currentRecentlyViewed,
          }
        }),
      clearRecentlyViewed: () =>
        set(() => ({
          recentlyViewed: null,
        })),
    }),
    {
      name: 'recently-viewed-storage',
    }
  )
)

export const useRecentlyViewed = () =>
  useRecentlyViewedStore((state) => state.recentlyViewed)

export const useUpdateRecentlyViewed = () =>
  useRecentlyViewedStore((state) => state.updateRecentlyViewed)

export const useClearRecentlyViewed = () =>
  useRecentlyViewedStore((state) => state.clearRecentlyViewed)
