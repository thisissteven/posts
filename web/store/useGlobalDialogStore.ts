import { create } from 'zustand'

type DialogName =
  | 'BOOKMARKS'
  | 'REPORT'
  | 'ALT'
  | 'EDIT_PROFILE'
  | 'ACCOUNT_SETTINGS'
  | 'BLOCK_USER'

interface DialogState {
  currentOpen: DialogName | null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dialogArgs: any
  actions: {
    openDialog: (name: DialogName, args?: unknown) => void
    closeDialog: () => void
  }
}

const useGlobalDialogStore = create<DialogState>()((set) => ({
  currentOpen: null,
  dialogArgs: null,
  actions: {
    openDialog: (name, args) =>
      set((_) => ({
        currentOpen: name,
        dialogArgs: args,
      })),
    closeDialog: () =>
      set((_) => ({
        currentOpen: null,
      })),
  },
}))

export const useCurrentOpenDialog = () =>
  useGlobalDialogStore((state) => state.currentOpen)

export const useDialogArgs = () =>
  useGlobalDialogStore((state) => state.dialogArgs)

export const useDialogActions = () =>
  useGlobalDialogStore((state) => state.actions)
