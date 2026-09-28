"use client"
import { useSession, type Role } from "@/lib/stores/useSession"
import type React from "react"

export default function RequireRole({
  allow,
  children,
  fallback,
}: { allow: Role[]; children: React.ReactNode; fallback?: React.ReactNode }) {
  const { user } = useSession()
  if (!user || !allow.includes(user.role)) return <>{fallback ?? null}</>
  return <>{children}</>
}
