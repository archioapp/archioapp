import { create } from "zustand"
import { useEventLog } from "@/lib/stores/useEventLog"
import { createClient } from "@/lib/supabase/client"

export type Role = "STUDENT" | "MENTOR" | "ADMIN"
export type User = { id: string; handle: string; email?: string; role: Role }

function load(): User | undefined {
  if (typeof window === "undefined") return undefined
  try {
    const raw = localStorage.getItem("archio.session")
    return raw ? (JSON.parse(raw) as User) : undefined
  } catch {
    return undefined
  }
}

function save(u?: User) {
  try {
    u ? localStorage.setItem("archio.session", JSON.stringify(u)) : localStorage.removeItem("archio.session")
  } catch {}
}

type S = {
  user?: User
  isLoading: boolean
  signIn: (u: User) => void
  signOut: () => Promise<void>
}

export const useSession = create<S>((set) => ({
  user: load(),
  isLoading: false,
  signIn: (u) => {
    save(u)
    useEventLog.getState().push("auth.signed_in", { u })
    set({ user: u })
  },
  signOut: async () => {
    // Sign out of Supabase first (clears cookies + session)
    try {
      const supabase = createClient()
      if (supabase) {
        await supabase.auth.signOut()
      }
    } catch {
      // Continue with local signout even if Supabase fails
    }

    // Clear local state
    save(undefined)
    useEventLog.getState().push("auth.signed_out")
    set({ user: undefined })
  },
}))
