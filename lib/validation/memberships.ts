import { z } from "zod"

export const createMembershipSchema = z.object({
  user_id: z.string().uuid("Invalid user ID"),
  org_id: z.string().uuid().optional(),
  room_id: z.string().uuid("Room ID is required"),
  role: z.enum(["admin", "creator", "moderator", "member", "pending", "banned"]).default("member"),
})

export const updateMembershipSchema = z.object({
  role: z.enum(["admin", "creator", "moderator", "member", "pending", "banned"]),
})

export type CreateMembershipInput = z.infer<typeof createMembershipSchema>
export type UpdateMembershipInput = z.infer<typeof updateMembershipSchema>
