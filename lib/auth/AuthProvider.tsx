"use client"

import { createContext, useContext, useEffect, useState, useRef, type ReactNode } from "react"
import { useSession, type User, type Role } from "@/lib/stores/useSession"
import type { User as SupabaseUser, Session, SupabaseClient } from "@supabase/supabase-js"

interface AuthContextType {
  user: User | undefined
  supabaseUser: SupabaseUser | null
  session: Session | null
  isLoading: boolean
  isAuthenticated: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const supabaseRef = useRef<SupabaseClient | null>(null)
  
  const { user, signIn, signOut: sessionSignOut } = useSession()

  // Initialize Supabase client after mount (client-side only)
  useEffect(() => {
    // Only run once
    if (supabaseRef.current) return
    
    // Ensure we're on the client and have required env vars
    if (typeof window === "undefined") {
      setIsLoading(false)
      return
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      console.warn("[AuthProvider] Supabase env vars not configured")
      setIsLoading(false)
      return
    }

    // Lazy load the Supabase client only when needed
    const initSupabase = async () => {
      try {
        const { createBrowserClient } = await import("@supabase/ssr")
        const client = createBrowserClient(supabaseUrl, supabaseAnonKey)
        
        if (client) {
          supabaseRef.current = client
          
          // Get initial session
          const { data: { session: initialSession } } = await client.auth.getSession()
          
          if (initialSession?.user) {
            setSupabaseUser(initialSession.user)
            setSession(initialSession)
            
            // Sync to Zustand store
            if (!user || user.id !== initialSession.user.id) {
              signIn({
                id: initialSession.user.id,
                email: initialSession.user.email || "",
                handle: initialSession.user.user_metadata?.display_name || 
                        initialSession.user.email?.split("@")[0] || 
                        "user",
                role: (initialSession.user.user_metadata?.role as Role) || "STUDENT",
              })
            }
          }
          
          // Listen for auth changes
          const { data: { subscription } } = client.auth.onAuthStateChange(
            async (event, newSession) => {
              setSession(newSession)
              setSupabaseUser(newSession?.user ?? null)

              if (event === "SIGNED_IN" && newSession?.user) {
                signIn({
                  id: newSession.user.id,
                  email: newSession.user.email || "",
                  handle: newSession.user.user_metadata?.display_name || 
                          newSession.user.email?.split("@")[0] || 
                          "user",
                  role: (newSession.user.user_metadata?.role as Role) || "STUDENT",
                })
              } else if (event === "SIGNED_OUT") {
                sessionSignOut()
              } else if (event === "TOKEN_REFRESHED" && newSession?.user) {
                if (!user || user.id !== newSession.user.id) {
                  signIn({
                    id: newSession.user.id,
                    email: newSession.user.email || "",
                    handle: newSession.user.user_metadata?.display_name || 
                            newSession.user.email?.split("@")[0] || 
                            "user",
                    role: (newSession.user.user_metadata?.role as Role) || "STUDENT",
                  })
                }
              }
            }
          )

          return () => {
            subscription?.unsubscribe()
          }
        }
      } catch (error) {
        console.error("[AuthProvider] Failed to initialize Supabase:", error)
      } finally {
        setIsLoading(false)
      }
    }
    
    initSupabase()
  }, [user, signIn, sessionSignOut])

  // Sign out function
  const handleSignOut = async () => {
    try {
      if (supabaseRef.current) {
        await supabaseRef.current.auth.signOut()
      }
      sessionSignOut()
      setSupabaseUser(null)
      setSession(null)
    } catch (error) {
      console.error("[AuthProvider] Sign out failed:", error)
      sessionSignOut()
      setSupabaseUser(null)
      setSession(null)
    }
  }

  const value: AuthContextType = {
    user,
    supabaseUser,
    session,
    isLoading,
    isAuthenticated: !!user && !!session,
    signOut: handleSignOut,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
