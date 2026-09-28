import { z } from "zod"

export const createInviteSchema = z.object({
  org_id: z.string().uuid().optional(),
  room_id: z.string().uuid("Room ID is required"),
  expires_at: z.string().datetime().optional(),
})

export type CreateInviteInput = z.infer<typeof createInviteSchema>
