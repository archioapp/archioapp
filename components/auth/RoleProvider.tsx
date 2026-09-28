"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useSession, type Role } from "@/lib/stores/useSession"
import { useProfile } from "@/lib/stores/useProfile"

interface RoleContextValue {
  role: Role
  isMentor: boolean
  isStudent: boolean
  isAdmin: boolean
  isLoading: boolean
  // Role-specific feature flags
  canAccessMentorDashboard: boolean
  canViewMenteeSubmissions: boolean
  canCreateWarRooms: boolean
  canPublishForecasts: boolean
  canAccessAnalytics: boolean
  canModerateContent: boolean
}

const RoleContext = createContext<RoleContextValue | null>(null)

export function RoleProvider({ children }: { children: ReactNode }) {
  const { user } = useSession()
  const { myProfile, loadMyProfile, isLoading: profileLoading } = useProfile()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadMyProfile().finally(() => setIsLoading(false))
  }, [loadMyProfile])

  const role = user?.role || myProfile?.role || "STUDENT"
  const isMentor = role === "MENTOR"
  const isStudent = role === "STUDENT"
  const isAdmin = role === "ADMIN"

  const value: RoleContextValue = {
    role,
    isMentor,
    isStudent,
    isAdmin,
    isLoading: isLoading || profileLoading,
    // Feature flags based on role
    canAccessMentorDashboard: isMentor || isAdmin,
    canViewMenteeSubmissions: isMentor || isAdmin,
    canCreateWarRooms: isMentor || isAdmin,
    canPublishForecasts: true, // All users can publish forecasts
    canAccessAnalytics: isMentor || isAdmin,
    canModerateContent: isMentor || isAdmin,
  }

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>
}

export function useRole() {
  const context = useContext(RoleContext)
  if (!context) {
    throw new Error("useRole must be used within a RoleProvider")
  }
  return context
}

// HOC for role-gated components
interface RequireRoleProps {
  role: Role | Role[]
  children: ReactNode
  fallback?: ReactNode
}

export function RequireRole({ role, children, fallback = null }: RequireRoleProps) {
  const { role: currentRole, isLoading } = useRole()

  if (isLoading) {
    return null
  }

  const allowedRoles = Array.isArray(role) ? role : [role]
  
  if (!allowedRoles.includes(currentRole)) {
    return <>{fallback}</>
  }

  return <>{children}</>
}

// Conditional render based on mentor status
export function MentorOnly({ children, fallback = null }: { children: ReactNode; fallback?: ReactNode }) {
  return <RequireRole role="MENTOR" fallback={fallback}>{children}</RequireRole>
}

export function StudentOnly({ children, fallback = null }: { children: ReactNode; fallback?: ReactNode }) {
  return <RequireRole role="STUDENT" fallback={fallback}>{children}</RequireRole>
}

export function AdminOnly({ children, fallback = null }: { children: ReactNode; fallback?: ReactNode }) {
  return <RequireRole role="ADMIN" fallback={fallback}>{children}</RequireRole>
}
