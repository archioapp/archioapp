// Auth & Identity Types
export type UserRole = "admin" | "creator" | "moderator" | "member" | "pending" | "banned"
export type VerifiedLevel = 0 | 1 | 2 | 3
export type SubscriptionTier = "free" | "pro" | "live" | "mentor-elite"
export type SubscriptionStatus = "active" | "canceled" | "past_due" | "trialing"

export interface Profile {
  id: string
  user_id: string
  display_name?: string
  avatar_url?: string
  bio?: string
  verified_level: VerifiedLevel
  created_at: string
  updated_at: string
}

export interface Organization {
  id: string
  name: string
  slug: string
  description?: string
  avatar_url?: string
  owner_id: string
  created_at: string
  updated_at: string
}

export interface Room {
  id: string
  org_id: string
  name: string
  slug: string
  description?: string
  is_public: boolean
  created_at: string
  updated_at: string
}

export interface Membership {
  id: string
  room_id: string
  user_id: string
  role: UserRole
  joined_at: string
  updated_at: string
}

export interface Invite {
  id: string
  room_id: string
  invited_by: string
  invite_code: string
  email?: string
  expires_at?: string
  max_uses: number
  used_count: number
  created_at: string
}

export interface Plan {
  id: string
  name: string
  tier: SubscriptionTier
  price_monthly: number
  price_yearly: number
  stripe_price_id_monthly?: string
  stripe_price_id_yearly?: string
  features: Record<string, any>
  limits: Record<string, any>
}

export interface Subscription {
  id: string
  user_id: string
  plan_id: string
  status: SubscriptionStatus
  stripe_subscription_id?: string
  current_period_start: string
  current_period_end: string
  cancel_at_period_end: boolean
  created_at: string
  updated_at: string
}

// Request/Response DTOs
export interface SignUpRequest {
  email: string
  password: string
  display_name?: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface UpdateProfileRequest {
  display_name?: string
  avatar_url?: string
  bio?: string
}

export interface CreateOrganizationRequest {
  name: string
  description?: string
  avatar_url?: string
}

export interface UpdateOrganizationRequest {
  name?: string
  description?: string
  avatar_url?: string
}

export interface CreateRoomRequest {
  org_id: string
  name: string
  description?: string
  is_public?: boolean
}

export interface UpdateRoomRequest {
  name?: string
  description?: string
  is_public?: boolean
}

export interface CreateInviteRequest {
  room_id: string
  email?: string
  max_uses?: number
  expires_at?: string
}

export interface UpdateMembershipRequest {
  role: UserRole
}

export interface CreateCheckoutRequest {
  plan_id: string
  billing_period: "monthly" | "yearly"
}
