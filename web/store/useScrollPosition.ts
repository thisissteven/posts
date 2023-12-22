import { create } from 'zustand'

interface ScrollState {
  scrollPosition: Record<string, number>
  setScrollPosition: (key: string, value: number) => void
}

export const useScrollPosition = create<ScrollState>()((set) => ({
  scrollPosition: {},
  setScrollPosition: (key, value) =>
    set((state) => ({
      scrollPosition: {
        ...state.scrollPosition,
        [key]: value,
      },
    })),
}))
