import { create } from 'zustand'

type DialogName = 'BOOKMARKS' | 'REPORT'

interface DialogState {
  currentOpen: DialogName | null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dialogArgs: any
  openDialog: (name: DialogName, args?: unknown) => void
  closeDialog: () => void
}

export const useGlobalDialogStore = create<DialogState>()((set) => ({
  currentOpen: null,
  dialogArgs: null,
  openDialog: (name, args) =>
    set((_) => ({
      currentOpen: name,
      dialogArgs: args,
    })),
  closeDialog: () =>
    set((_) => ({
      currentOpen: null,
    })),
}))
