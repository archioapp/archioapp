import { createClient as createBrowserClient } from "@supabase/ssr"
import type { NextRequest } from "next/server"

/**
 * Creates a Supabase client bound to the request user.
 * Supports both Bearer token and cookie-based authentication.
 * RLS policies will be enforced based on the authenticated user.
 */
export function createClientForRequest(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  // Check for Authorization header
  const authHeader = request.headers.get("Authorization")
  const bearerToken = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null

  // Check for cookie-based auth
  const cookieToken = request.cookies.get("sb-access-token")?.value

  const accessToken = bearerToken || cookieToken

  if (!accessToken) {
    throw new Error("Unauthorized: No access token provided")
  }

  // Create client with the token
  const client = createBrowserClient(supabaseUrl, supabaseAnonKey)

  // Set the auth token so RLS applies
  client.auth.setSession({
    access_token: accessToken,
    refresh_token: "", // Not needed for request-scoped client
  })

  return client
}

/**
 * Gets the authenticated user from the request.
 * Throws 401 if no valid token is present.
 */
export async function getUserFromRequest(request: NextRequest) {
  try {
    const client = createClientForRequest(request)
    const {
      data: { user },
      error,
    } = await client.auth.getUser()

    if (error || !user) {
      throw new Error("Unauthorized")
    }

    return user
  } catch (error) {
    throw new Error("Unauthorized")
  }
}
