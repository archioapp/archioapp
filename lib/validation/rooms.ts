import { z } from "zod"

export const createRoomSchema = z.object({
  org_id: z.string().uuid("Invalid organization ID"),
  name: z.string().min(1, "Room name is required").max(100),
  slug: z.string().min(3).max(50).optional(),
  type: z.enum(["community", "private", "channel"]).default("community"),
  verification_required: z.boolean().default(false),
})

export const updateRoomSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  slug: z.string().min(3).max(50).optional(),
  type: z.enum(["community", "private", "channel"]).optional(),
  verification_required: z.boolean().optional(),
})

export type CreateRoomInput = z.infer<typeof createRoomSchema>
export type UpdateRoomInput = z.infer<typeof updateRoomSchema>
