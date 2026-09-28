import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

// Purely public routes that must never depend on Supabase being reachable.
// Keeps the landing/marketing surface instantly navigable even when the
// Supabase instance is paused, cold, or unreachable.
const PUBLIC_ROUTE_PREFIXES = [
  "/welcome",
  "/pitch",
  "/docs",
  "/_next",
  "/api/health",
]

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const { pathname } = request.nextUrl

  // Fast-path: skip Supabase entirely for purely public routes so they
  // never block on a paused/slow Supabase instance.
  if (PUBLIC_ROUTE_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
    return supabaseResponse
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    // Supabase not configured, skip auth middleware
    return supabaseResponse
  }

  try {
    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
        },
      },
    })

    // Do not run code between createServerClient and
    // supabase.auth.getUser(). A simple mistake could make it very hard to debug
    // issues with users being randomly logged out.

    const {
      data: { user },
    } = await supabase.auth.getUser()

    const protectedRoots = [
      "/usage",
      "/support",
      "/integrations",
      "/developers",
      "/status",
      "/settings",
      "/billing",
      "/admin",
      /* ── Room-Navigator alignment (July 2026) ──────────────────────
         /profile /hub /copilot /nexus /intelligence were removed from
         this list: they are Flight-Deck door targets rendering the same
         mock demo telemetry as the fully-public /dashboard, so gating
         them only broke the cockpit navigator with login bounces.
         When real per-user data lands, re-add them here (and restore
         the server-side guard in app/(main)/hub/page.tsx). */
    ]

    const isProtected =
      protectedRoots.some((p) => pathname === p || pathname.startsWith(p + "/"))

    if (
      isProtected &&
      !user &&
      !pathname.startsWith("/login") &&
      !pathname.startsWith("/auth")
    ) {
      const url = request.nextUrl.clone()
      url.pathname = "/login"
      url.searchParams.set("from", pathname)
      return NextResponse.redirect(url)
    }

    return supabaseResponse
  } catch {
    // If Supabase is paused or unreachable, allow the request through
    // so the app remains navigable during dev/testing
    return supabaseResponse
  }
}
