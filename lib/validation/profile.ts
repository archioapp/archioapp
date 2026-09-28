import { z } from "zod"

export const updateProfileSchema = z.object({
  handle: z.string().min(3).max(30).optional(),
  display_name: z.string().min(1).max(100).optional(),
  avatar_url: z.string().url().optional(),
  bio: z.string().max(500).optional(),
  timezone: z.string().optional(),
  consent_analytics: z.boolean().optional(),
})

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>
