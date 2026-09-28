"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth/AuthProvider"
import { LogOut, User } from "lucide-react"

export default function UserButton() {
  const { user, isLoading, isAuthenticated, signOut } = useAuth()
  const [open, setOpen] = useState(false)
  const router = useRouter()

  // Handle sign out
  const handleSignOut = async () => {
    await signOut()
    setOpen(false)
    router.push("/login")
  }

  // Handle sign in click
  const handleSignIn = () => {
    router.push("/login")
  }

  // Don't show during loading or when not authenticated
  if (isLoading || !isAuthenticated || !user) {
    return null
  }

  return (
    <>
      <div className="fixed top-3 right-4 z-[55]">
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-slate-300 text-xs font-mono tracking-wide hover:bg-white/10 hover:border-white/15 transition-all duration-150"
        >
          <User className="w-3.5 h-3.5" />
          <span>{user.handle}</span>
          <span className="text-slate-500">·</span>
          <span className="text-blue-400/80">{user.role}</span>
        </button>
      </div>

      {/* Dropdown menu */}
      {open && isAuthenticated && user && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-transparent z-[60]"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute right-4 top-14 min-w-[220px] bg-[rgba(20,22,28,0.98)] border border-white/10 rounded-xl p-3 shadow-[0_20px_40px_rgba(0,0,0,0.5)]"
          >
            <div className="text-[10px] font-mono text-slate-500 tracking-wide mb-2">
              SIGNED IN AS
            </div>
            <div className="text-sm font-semibold text-slate-200 mb-1">
              {user.handle}
            </div>
            <div className="text-xs font-mono text-slate-500 mb-4">
              {user.email || "No email"}
            </div>

            <div className="h-px bg-white/5 mb-3" />

            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 text-slate-300 text-xs font-mono hover:bg-red-500/10 hover:text-red-400 transition-all duration-150"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign out
            </button>
          </div>
        </div>
      )}
    </>
  )
}
