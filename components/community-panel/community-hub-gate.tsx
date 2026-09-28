"use client"

import { usePathname } from "next/navigation"
import { FloatingCommunityHub } from "./floating-community-hub"

/* Routes that are presentation surfaces — the swipe tab would sit over the
 * headline. Everywhere else the hub mounts as before. */
const QUIET_PREFIXES = ["/pitch", "/owen"]

export function CommunityHubGate() {
  const pathname = usePathname() ?? ""
  if (QUIET_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`))) return null
  return <FloatingCommunityHub />
}
