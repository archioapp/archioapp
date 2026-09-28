import type { UserRole, Membership, Room, Organization } from "@/types/auth"

// Role hierarchy for permission checks
const ROLE_HIERARCHY: Record<UserRole, number> = {
  admin: 5,
  creator: 4,
  moderator: 3,
  member: 2,
  pending: 1,
  banned: 0,
}

export function hasRole(userRole: UserRole, requiredRole: UserRole): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole]
}

export function canAccessRoom(membership: Membership | null, room: Room): boolean {
  // Public rooms can be accessed by anyone
  if (room.is_public) return true

  // Private rooms require active membership
  if (!membership) return false

  return membership.role !== "banned" && membership.role !== "pending"
}

export function canManageRoom(membership: Membership | null, room: Room): boolean {
  if (!membership) return false

  return hasRole(membership.role, "moderator")
}

export function canManageOrganization(userId: string, org: Organization): boolean {
  return userId === org.owner_id
}

export function canInviteToRoom(membership: Membership | null): boolean {
  if (!membership) return false

  return hasRole(membership.role, "moderator")
}

export function canUpdateMemberRole(actorMembership: Membership | null, targetMembership: Membership): boolean {
  if (!actorMembership) return false

  // Must be at least moderator
  if (!hasRole(actorMembership.role, "moderator")) return false

  // Cannot modify someone with equal or higher role
  return ROLE_HIERARCHY[actorMembership.role] > ROLE_HIERARCHY[targetMembership.role]
}

export function canRemoveMember(actorMembership: Membership | null, targetMembership: Membership): boolean {
  return canUpdateMemberRole(actorMembership, targetMembership)
}

export function getRoleDisplayName(role: UserRole): string {
  const names: Record<UserRole, string> = {
    admin: "Admin",
    creator: "Creator",
    moderator: "Moderator",
    member: "Member",
    pending: "Pending",
    banned: "Banned",
  }
  return names[role]
}
