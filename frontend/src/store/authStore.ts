import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { UserDTO } from '../types/api'

interface AuthState {
  user: UserDTO | null
  setUser: (user: UserDTO, token: string) => void
  clear: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user, token) => {
        localStorage.setItem('mv_token', token)
        set({ user })
      },
      clear: () => {
        localStorage.removeItem('mv_token')
        set({ user: null })
      },
    }),
    { name: 'mv-auth' }
  )
)
