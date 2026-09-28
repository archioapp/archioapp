import { createClient } from "@/lib/supabase/server"
import type {
  Profile,
  Organization,
  Room,
  Membership,
  Invite,
  Subscription,
  CreateOrganizationRequest,
  CreateRoomRequest,
  UpdateProfileRequest,
  UpdateOrganizationRequest,
  UpdateRoomRequest,
  UserRole,
} from "@/types/auth"

// ============ PROFILES ============

export async function getProfile(userId: string): Promise<Profile | null> {
  const supabase = await createClient()

  const { data, error } = await supabase.from("profiles").select("*").eq("user_id", userId).single()

  if (error) {
    if (error.code === "PGRST116") return null
    throw error
  }

  return data
}

export async function updateProfile(userId: string, updates: UpdateProfileRequest): Promise<Profile> {
  const supabase = await createClient()

  const { data, error } = await supabase.from("profiles").update(updates).eq("user_id", userId).select().single()

  if (error) throw error
  return data
}

// ============ ORGANIZATIONS ============

export async function getUserOrganizations(userId: string): Promise<Organization[]> {
  const supabase = await createClient()

  // Get orgs where user is owner or has membership in any room
  const { data, error } = await supabase
    .from("organizations")
    .select(`
      *,
      rooms!inner(
        memberships!inner(user_id)
      )
    `)
    .or(`owner_id.eq.${userId},rooms.memberships.user_id.eq.${userId}`)

  if (error) throw error
  return data || []
}

export async function getOrganization(orgId: string): Promise<Organization | null> {
  const supabase = await createClient()

  const { data, error } = await supabase.from("organizations").select("*").eq("id", orgId).single()

  if (error) {
    if (error.code === "PGRST116") return null
    throw error
  }

  return data
}

export async function getOrganizationBySlug(slug: string): Promise<Organization | null> {
  const supabase = await createClient()

  const { data, error } = await supabase.from("organizations").select("*").eq("slug", slug).single()

  if (error) {
    if (error.code === "PGRST116") return null
    throw error
  }

  return data
}

export async function createOrganization(userId: string, orgData: CreateOrganizationRequest): Promise<Organization> {
  const supabase = await createClient()

  // Generate slug from name
  const slug = orgData.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")

  const { data, error } = await supabase
    .from("organizations")
    .insert({
      ...orgData,
      slug,
      owner_id: userId,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateOrganization(orgId: string, updates: UpdateOrganizationRequest): Promise<Organization> {
  const supabase = await createClient()

  const { data, error } = await supabase.from("organizations").update(updates).eq("id", orgId).select().single()

  if (error) throw error
  return data
}

export async function deleteOrganization(orgId: string): Promise<void> {
  const supabase = await createClient()

  const { error } = await supabase.from("organizations").delete().eq("id", orgId)

  if (error) throw error
}

// ============ ROOMS ============

export async function getRooms(filters?: {
  org_id?: string
  user_id?: string
  is_public?: boolean
}): Promise<Room[]> {
  const supabase = await createClient()

  let query = supabase.from("rooms").select("*")

  if (filters?.org_id) {
    query = query.eq("org_id", filters.org_id)
  }

  if (filters?.is_public !== undefined) {
    query = query.eq("is_public", filters.is_public)
  }

  if (filters?.user_id) {
    query = query
      .select(`
      *,
      memberships!inner(user_id)
    `)
      .eq("memberships.user_id", filters.user_id)
  }

  const { data, error } = await query.order("created_at", { ascending: false })

  if (error) throw error
  return data || []
}

export async function getRoom(roomId: string): Promise<Room | null> {
  const supabase = await createClient()

  const { data, error } = await supabase.from("rooms").select("*").eq("id", roomId).single()

  if (error) {
    if (error.code === "PGRST116") return null
    throw error
  }

  return data
}

export async function getRoomBySlug(orgId: string, slug: string): Promise<Room | null> {
  const supabase = await createClient()

  const { data, error } = await supabase.from("rooms").select("*").eq("org_id", orgId).eq("slug", slug).single()

  if (error) {
    if (error.code === "PGRST116") return null
    throw error
  }

  return data
}

export async function createRoom(roomData: CreateRoomRequest): Promise<Room> {
  const supabase = await createClient()

  // Generate slug from name
  const slug = roomData.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")

  const { data, error } = await supabase
    .from("rooms")
    .insert({
      ...roomData,
      slug,
      is_public: roomData.is_public ?? false,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateRoom(roomId: string, updates: UpdateRoomRequest): Promise<Room> {
  const supabase = await createClient()

  const { data, error } = await supabase.from("rooms").update(updates).eq("id", roomId).select().single()

  if (error) throw error
  return data
}

export async function deleteRoom(roomId: string): Promise<void> {
  const supabase = await createClient()

  const { error } = await supabase.from("rooms").delete().eq("id", roomId)

  if (error) throw error
}

// ============ MEMBERSHIPS ============

export async function getMembership(userId: string, roomId: string): Promise<Membership | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("memberships")
    .select("*")
    .eq("user_id", userId)
    .eq("room_id", roomId)
    .single()

  if (error) {
    if (error.code === "PGRST116") return null
    throw error
  }

  return data
}

export async function getRoomMemberships(roomId: string): Promise<Membership[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("memberships")
    .select("*")
    .eq("room_id", roomId)
    .order("joined_at", { ascending: false })

  if (error) throw error
  return data || []
}

export async function getUserMemberships(userId: string): Promise<Membership[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("memberships")
    .select("*")
    .eq("user_id", userId)
    .order("joined_at", { ascending: false })

  if (error) throw error
  return data || []
}

export async function createMembership(roomId: string, userId: string, role: UserRole = "member"): Promise<Membership> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("memberships")
    .insert({
      room_id: roomId,
      user_id: userId,
      role,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateMembership(membershipId: string, role: UserRole): Promise<Membership> {
  const supabase = await createClient()

  const { data, error } = await supabase.from("memberships").update({ role }).eq("id", membershipId).select().single()

  if (error) throw error
  return data
}

export async function deleteMembership(membershipId: string): Promise<void> {
  const supabase = await createClient()

  const { error } = await supabase.from("memberships").delete().eq("id", membershipId)

  if (error) throw error
}

// ============ INVITES ============

export async function getInvite(inviteCode: string): Promise<Invite | null> {
  const supabase = await createClient()

  const { data, error } = await supabase.from("invites").select("*").eq("invite_code", inviteCode).single()

  if (error) {
    if (error.code === "PGRST116") return null
    throw error
  }

  return data
}

export async function getRoomInvites(roomId: string): Promise<Invite[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("invites")
    .select("*")
    .eq("room_id", roomId)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data || []
}

export async function createInvite(
  roomId: string,
  invitedBy: string,
  options?: {
    email?: string
    max_uses?: number
    expires_at?: string
  },
): Promise<Invite> {
  const supabase = await createClient()

  // Generate unique invite code
  const inviteCode = Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10)

  const { data, error } = await supabase
    .from("invites")
    .insert({
      room_id: roomId,
      invited_by: invitedBy,
      invite_code: inviteCode,
      email: options?.email,
      max_uses: options?.max_uses ?? 1,
      expires_at: options?.expires_at,
      used_count: 0,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function incrementInviteUsage(inviteId: string): Promise<void> {
  const supabase = await createClient()

  const { error } = await supabase.rpc("increment_invite_usage", {
    invite_id: inviteId,
  })

  if (error) throw error
}

export async function deleteInvite(inviteId: string): Promise<void> {
  const supabase = await createClient()

  const { error } = await supabase.from("invites").delete().eq("id", inviteId)

  if (error) throw error
}

// ============ SUBSCRIPTIONS ============

export async function getUserSubscription(userId: string): Promise<Subscription | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", userId)
    .eq("status", "active")
    .single()

  if (error) {
    if (error.code === "PGRST116") return null
    throw error
  }

  return data
}
