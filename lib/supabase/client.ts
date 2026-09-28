import { createBrowserClient, type SupabaseClient } from "@supabase/ssr"

let client: SupabaseClient | null = null

/**
 * Creates a Supabase client for use in browser/client components only.
 * Returns null if:
 * - Running on the server (SSR)
 * - Environment variables are missing
 * 
 * This is safe to import in "use client" components - it will only
 * actually create the client when running in the browser.
 */
export function createClient(): SupabaseClient | null {
  // Strict check: only create client in browser environment
  // This check MUST come first before any other code
  if (typeof window === "undefined") {
    // Server-side: return null silently
    return null
  }
  
  // Return existing client if already created (singleton pattern)
  if (client) {
    return client
  }
  
  // Check environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!supabaseUrl || !supabaseAnonKey) {
    // Missing env vars - this is expected in development without Supabase setup
    return null
  }
  
  // Only now create the client (browser-side only, with valid env vars)
  try {
    client = createBrowserClient(supabaseUrl, supabaseAnonKey)
    return client
  } catch (error) {
    // If createBrowserClient fails for any reason, return null gracefully
    console.error("[Supabase Client] Failed to create client:", error)
    return null
  }
}

/**
 * Check if Supabase is available (client created successfully)
 */
export function isSupabaseAvailable(): boolean {
  if (typeof window === "undefined") return false
  return createClient() !== null
}
