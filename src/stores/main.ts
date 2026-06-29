import { create } from 'zustand'

interface MainState {
  theme: number
  setTheme: (theme: number) => void
}

export const useMainStore = create<MainState>((set) => ({
  theme: 1,
  setTheme: (theme) => set({ theme }),
}))
